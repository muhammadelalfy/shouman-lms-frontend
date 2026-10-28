import "server-only";
import { getSessionToken } from "@/lib/auth/session";
import { getCurrentUser } from "@/features/account/api";
import { getServerEnv } from "@/config/server-env";
import { isApiError } from "@/lib/api/errors";
import { canUseCsv, isCsvResource } from "./resources";
const MAX_FILE = 1048576;
const MAX_BODY = MAX_FILE + 65536;
const privateHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
function failure(status: number, message: string) {
  return Response.json({ message }, { status, headers: privateHeaders });
}
/** Closed BFF: bearer credentials never reach the browser; Laravel owns row policy. */
export async function proxyCsv(request: Request, resource: string, operation: string): Promise<Response> {
  if (!isCsvResource(resource) || !["export", "template", "import"].includes(operation)) return failure(404, "العملية غير متاحة.");
  const importing = operation === "import";
  if (request.method !== (importing ? "POST" : "GET")) return failure(405, "طريقة الطلب غير متاحة.");
  if (importing) {
    const origin = request.headers.get("origin");
    let sameOrigin = false;
    try {
      const source = new URL(origin ?? "");
      // Host is supplied by the browser/reverse proxy; Next's internal URL may
      // use the container hostname and port. Never trust forwarded-host input.
      sameOrigin = ["http:", "https:"].includes(source.protocol) && source.host === (request.headers.get("host") ?? new URL(request.url).host);
    } catch { /* Missing/invalid Origin is denied for cookie-authenticated writes. */ }
    if (!sameOrigin) return failure(403, "مصدر الطلب غير مسموح.");
  }
  try {
    const token = await getSessionToken();
    if (!token) return failure(401, "انتهت جلستك. سجّل الدخول مجددًا.");
    const user = await getCurrentUser(token);
    // Templates are import aids; audit exposes only the export operation.
    if (!canUseCsv(resource, user.permissions, operation !== "export", user.roles)) return failure(403, "ليست لديك صلاحية لهذه العملية.");
    let body: FormData | undefined;
    if (importing) {
      if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) return failure(422, "اختر ملف CSV صالحًا.");
      if (Number(request.headers.get("content-length")) > MAX_BODY) return failure(413, "الحد الأقصى لحجم الملف 1 ميجابايت.");
      const reader = request.body?.getReader();
      if (!reader) return failure(422, "اختر ملف CSV.");
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      let size = 0;
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > MAX_BODY) { await reader.cancel(); return failure(413, "الحد الأقصى لحجم الملف 1 ميجابايت."); }
        chunks.push(new Uint8Array(chunk.value));
      }
      try {
        body = await new Response(new Blob(chunks), { headers: { "Content-Type": request.headers.get("content-type")! } }).formData();
      } catch { return failure(422, "تعذر قراءة الملف. اختر ملف CSV صالحًا."); }
      const file = body.get("file");
      if (!file || typeof file === "string" || body.getAll("file").length !== 1 || [...body.keys()].some(key => key !== "file")) return failure(422, "اختر ملف CSV واحدًا.");
      if (file.size > MAX_FILE) return failure(413, "الحد الأقصى لحجم الملف 1 ميجابايت.");
    }
    const { API_BASE_URL, API_TIMEOUT_MS } = getServerEnv();
    const target = new URL(`${API_BASE_URL.replace(/\/+$/, "")}/admin/csv/${resource}/${operation}`);
    // Forward filters to Laravel validation; never forward host/path or cursor-page limits.
    if (!importing) target.search = new URL(request.url).search;
    const requestId = crypto.randomUUID();
    const upstream = await fetch(target, {
      method: request.method, body, cache: "no-store", redirect: "error",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      headers: { Authorization: `Bearer ${token}`, Accept: importing ? "application/json" : "text/csv", "Accept-Language": "ar", "X-Request-Id": requestId },
    });
    const headers = { ...privateHeaders, "X-Request-Id": upstream.headers.get("X-Request-Id") ?? requestId };
    if (!upstream.ok || importing) {
      let payload;
      try { payload = await upstream.json(); } catch { return failure(502, resource === "audit-logs" ? "تعذر تنزيل سجل التدقيق. أعد المحاولة لاحقًا." : "تعذر قراءة نتيجة العملية. راجع السجل قبل إعادة الاستيراد."); }
      return Response.json(payload, { status: upstream.status, headers });
    }
    if (!upstream.headers.get("content-type")?.toLowerCase().startsWith("text/csv")) return failure(502, "تعذر تنزيل CSV. لم يُحفظ ملف بديل.");
    return new Response(upstream.body, { headers: { ...headers, "Content-Type": "text/csv; charset=UTF-8", "Content-Disposition": `attachment; filename="${resource}-${operation}.csv"` } });
  } catch (error) {
    if (isApiError(error)) return failure(error.status || 502, error.message);
    return failure(502, resource === "audit-logs" ? "تعذر تنزيل سجل التدقيق. أعد المحاولة لاحقًا." : "تعذر تأكيد نتيجة العملية. راجع السجل قبل إعادة الاستيراد؛ لا تُعد المحاولة تلقائيًا.");
  }
}
