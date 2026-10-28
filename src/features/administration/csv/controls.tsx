"use client";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { safeRedirectPath } from "@/lib/navigation";
import { ConfirmationDialog } from "../components/confirmation-dialog";
import type { CsvResource } from "./resources";
type Feedback = { error: boolean; message: string; rows?: string[]; expired?: boolean };
export function CsvControls({ resource, label, canImport = false, filters = {}, disabled = false, onPendingChange, returnTo }: {
  resource: CsvResource; label: string; canImport?: boolean;
  filters?: Record<string, string | number | undefined>; disabled?: boolean; onPendingChange?: (pending: boolean) => void;
  returnTo?: string;
}) {
  const auditExport = resource === "audit-logs";
  const allowImport = canImport && !auditExport;
  const safeReturn = safeRedirectPath(returnTo, "");
  const loginHref = safeReturn ? `/auth/login?redirectTo=${encodeURIComponent(safeReturn)}&expired=1` : "/auth/login";
  const id = useId();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Feedback | null>(null);
  const updateResult = (value: Feedback) => {
    setResult(value);
    if (value.error) requestAnimationFrame(() => feedback.current?.focus());
  };
  async function run(operation: "export" | "template" | "import") {
    if (lock.current || disabled) return;
    if (auditExport && operation !== "export") return;
    if (operation === "import" && !file) return;
    lock.current = true; setPending(true); onPendingChange?.(true); setResult(null);
    try {
      const query = new URLSearchParams();
      if (operation === "export" && !auditExport) for (const [key, value] of Object.entries(filters)) {
        if (key !== "cursor" && value !== undefined && value !== "") query.set(key, String(value));
      }
      const body = operation === "import" ? new FormData() : undefined;
      if (body && file) body.append("file", file);
      const response = await fetch(`/api/admin/csv/${resource}/${operation}${query.size ? `?${query}` : ""}`, {
        method: body ? "POST" : "GET", body, cache: "no-store", credentials: "same-origin",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const rows = payload?.errors && typeof payload.errors === "object"
          ? Object.entries(payload.errors).flatMap(([key, values]) => Array.isArray(values) ? values.filter((value): value is string => typeof value === "string").map(value => `${key}: ${value}`) : []) : [];
        updateResult({ error: true, expired: response.status === 401,
          message: typeof payload?.message === "string" ? payload.message : auditExport ? "تعذر تنزيل سجل التدقيق. أعد المحاولة لاحقًا." : "تعذر تأكيد العملية. راجع السجل قبل المحاولة مجددًا.", rows });
        return;
      }
      if (operation === "import") {
        const payload = await response.json();
        const data = payload?.data;
        if (data?.resource !== resource || ![data.processed, data.created, data.updated].every(value => Number.isInteger(value) && value >= 0)) throw new Error("Invalid import result");
        updateResult({ error: false, message: `اكتمل الاستيراد: ${data.processed} سجل؛ أُنشئ ${data.created}، وحُدّث ${data.updated}.${resource.startsWith("homepage-") ? " حُفظت المسودة فقط ولم تُنشر." : ""}` });
        setFile(null); if (input.current) input.current.value = "";
        router.refresh();
      } else {
        if (!response.headers.get("content-type")?.toLowerCase().startsWith("text/csv")) throw new Error("Not CSV");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url; link.download = `${resource}-${operation}.csv`;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        updateResult({ error: false, message: operation === "template" ? "تم تنزيل القالب الفارغ." : "تم تنزيل ملف CSV." });
      }
    } catch {
      updateResult({ error: true, message: auditExport ? "تعذر تنزيل سجل التدقيق. أعد المحاولة لاحقًا." : "تعذر تأكيد نتيجة العملية. راجع السجل أو صدّره قبل إعادة الاستيراد لتجنب التكرار." });
    } finally { lock.current = false; setPending(false); onPendingChange?.(false); }
  }
  return <section className="xp-card xp-stack" aria-label={`CSV · ${label}`} aria-busy={pending}>
    <h3>{auditExport ? "تصدير" : "استيراد وتصدير"} · {label}</h3>
    <p className="xp-muted">{auditExport ? "نزّل سجل التدقيق ببياناته المسموح بعرضها، حتى 5000 سجل. إذا تجاوز السجل هذا الحد فلن يُنزّل الملف." : "التصدير يشمل كل النتائج المطابقة للمرشحات، حتى 5000 سجل. للاستيراد: CSV بترميز UTF-8، حتى 200 سجل و1 ميجابايت. قسّم الملفات الأكبر."}</p>
    <div className="xp-row">
      <button type="button" className="xp-button xp-button-outline" disabled={pending || disabled} onClick={() => void run("export")}>تصدير CSV</button>
      {allowImport && <button type="button" className="xp-button xp-button-outline" disabled={pending || disabled} onClick={() => void run("template")}>تنزيل قالب CSV</button>}
    </div>
    {allowImport && <>
      <div className="xp-field"><label htmlFor={id}>ملف CSV · {label}</label><input ref={input} id={id} type="file" accept=".csv,text/csv" disabled={pending || disabled} aria-describedby={`${id}-help`} onChange={event => {
        const selected = event.target.files?.[0] ?? null;
        setResult(null);
        if (selected && selected.size > 1048576) { setFile(null); updateResult({ error: true, message: "الحد الأقصى لحجم الملف 1 ميجابايت." }); } else setFile(selected);
      }} /></div>
      <p id={`${id}-help`} className="xp-muted">استخدم أسماء الأعمدة من القالب. جميع الصفوف تُحفظ معًا أو تُرفض معًا. {resource.startsWith("homepage-") ? "يستبدل الاستيراد المسودة ولا ينشرها. احفظ تعديلات الصفحة أولًا." : resource === "users" ? "يعدّل حالة وأدوار الحسابات الموجودة فقط؛ لا ينشئ حسابات." : resource === "roles" ? "يعدّل صلاحيات الأدوار الموجودة وقد يؤثر في جلسات المستخدمين." : "المعرّف الفارغ ينشئ سجلًا جديدًا؛ لا يغيّر الاستيراد حالة النشر."} لا تُعد الاستيراد عند انقطاع الاتصال قبل مراجعة السجل.</p>
      <ConfirmationDialog title={`استيراد ${label}`} description={`سيُطبّق الملف «${file?.name ?? ""}» ضمن صلاحياتك. ${resource.startsWith("homepage-") ? "ستُستبدل المسودة دون نشرها." : resource === "users" ? "ستُحدّث حالات أو أدوار الحسابات الموجودة فقط، وقد تُلغى جلسات المستخدمين." : resource === "roles" ? "ستُحدّث صلاحيات الأدوار الموجودة، وقد تُلغى جلسات المستخدمين." : "قد تتغير السجلات الموجودة أو تُنشأ سجلات حسب القالب."} إذا فشل أي صف فلن يُحفظ أي صف. راجع الملف قبل التأكيد.`} confirmLabel="تأكيد الاستيراد" pending={pending} disabled={disabled || !file} onConfirm={() => void run("import")}>استيراد CSV</ConfirmationDialog>
    </>}
    {pending && <p role="status">جارٍ تنفيذ العملية…</p>}
    {result && <div ref={feedback} tabIndex={-1} role={result.error ? "alert" : "status"} className={result.error ? "xp-error" : ""}>
      <p>{result.message}</p>{result.rows?.length ? <ul dir="auto">{result.rows.map((row, index) => <li key={index}>{row}</li>)}</ul> : null}
      {result.expired && <Link href={loginHref}>تسجيل الدخول مجددًا</Link>}
    </div>}
  </section>;
}
