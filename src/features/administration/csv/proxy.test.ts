import { beforeEach, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
const mocks = vi.hoisted(() => ({ token: vi.fn(), user: vi.fn(), fetch: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getSessionToken: mocks.token }));
vi.mock("@/features/account/api", () => ({ getCurrentUser: mocks.user }));
vi.mock("@/config/server-env", () => ({ getServerEnv: () => ({ API_BASE_URL: "http://backend.test/api/v1", API_TIMEOUT_MS: 10000 }) }));
import { proxyCsv } from "./proxy";
beforeEach(() => {
  mocks.token.mockResolvedValue("private-token"); mocks.user.mockResolvedValue({ permissions: ["offerings.view", "offerings.manage", "homepage.manage"] });
  vi.stubGlobal("fetch", mocks.fetch); mocks.fetch.mockReset();
});
function request(operation = "export") { return new Request(`http://site.test/api/admin/csv/offerings/${operation}`); }
it("requires session and permission before reading files or reaching transport", async () => {
  mocks.token.mockResolvedValue(null);
  expect((await proxyCsv(request(), "offerings", "export")).status).toBe(401);
  mocks.token.mockResolvedValue("secret"); mocks.user.mockResolvedValue({ permissions: [] });
  expect((await proxyCsv(request(), "offerings", "export")).status).toBe(403);
  expect(mocks.fetch).not.toHaveBeenCalled();
});
it("uses a closed resource registry and disallows cross-origin mutation", async () => {
  expect((await proxyCsv(request(), "secrets", "export")).status).toBe(404);
  const foreign = new Request("http://site.test/api/admin/csv/offerings/import", { method: "POST", headers: { origin: "http://foreign.test" } });
  expect((await proxyCsv(foreign, "offerings", "import")).status).toBe(403);
  expect(mocks.fetch).not.toHaveBeenCalled();
});
it("forwards filters and bearer server-side, returns private CSV attachment", async () => {
  mocks.fetch.mockResolvedValue(new Response("\uFEFFid,title\r\n1,العربية\r\n", { headers: { "content-type": "text/csv; charset=UTF-8", "X-Request-Id": "trace" } }));
  const response = await proxyCsv(new Request(`${request().url}?kind=course&search=علم`), "offerings", "export");
  expect(response.status).toBe(200); expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("content-disposition")).toContain("offerings-export.csv");
  const [url, options] = mocks.fetch.mock.calls[0];
  expect(url.searchParams.get("search")).toBe("علم"); expect(options.headers.Authorization).toBe("Bearer private-token");
  expect(await response.text()).toContain("العربية");
});
it("does not save successful JSON as a CSV and preserves row errors", async () => {
  mocks.fetch.mockResolvedValueOnce(Response.json({ data: [] }));
  expect((await proxyCsv(request(), "offerings", "export")).status).toBe(502);
  mocks.fetch.mockResolvedValueOnce(Response.json({ message: "خطأ", errors: { "rows.2.title": ["مطلوب"] } }, { status: 422 }));
  const result = await proxyCsv(request(), "offerings", "export");
  expect(result.status).toBe(422); expect((await result.json()).errors["rows.2.title"]).toEqual(["مطلوب"]);
});
it("forwards a real multipart file without JSON serialization or forced content-type", async () => {
  const body = new FormData(); body.append("file", new File(["id,title\r\n,علم"], "arabic.csv", { type: "text/csv" }));
  mocks.fetch.mockResolvedValueOnce(Response.json({ data: { resource: "offerings", processed: 1, created: 1, updated: 0 } }));
  const response = await proxyCsv(new Request("http://site.test/api/admin/csv/offerings/import", { method: "POST", headers: { origin: "http://site.test" }, body }), "offerings", "import");
  expect(response.status).toBe(200);
  const options = mocks.fetch.mock.calls[0][1];
  expect(options.body).toBeInstanceOf(FormData); expect(options.headers["Content-Type"]).toBeUndefined();
  expect(await options.body.get("file").text()).toContain("علم");
});
it("rejects oversized files and repeated uploads before backend IO", async () => {
  const body = new FormData(); body.append("file", new File([new Uint8Array(1048577)], "big.csv"));
  expect((await proxyCsv(new Request("http://site.test/api/admin/csv/offerings/import", { method: "POST", headers: { origin: "http://site.test" }, body }), "offerings", "import")).status).toBe(413);
  const repeated = new FormData(); repeated.append("file", new File(["id"], "one.csv")); repeated.append("file", new File(["id"], "two.csv"));
  expect((await proxyCsv(new Request("http://site.test/api/admin/csv/offerings/import", { method: "POST", headers: { origin: "http://site.test" }, body: repeated }), "offerings", "import")).status).toBe(422);
  expect(mocks.fetch).not.toHaveBeenCalled();
});
it("checks the browser Host behind an internal container URL, without trusting forwarded-host", async () => {
  const body = new FormData(); body.append("file", new File(["id"], "empty.csv"));
  mocks.fetch.mockResolvedValue(Response.json({ data: { resource: "offerings", processed: 0, created: 0, updated: 0 } }));
  const req = new Request("http://frontend:3000/api/admin/csv/offerings/import", { method: "POST", headers: { origin: "http://localhost:3118", host: "localhost:3118", "x-forwarded-host": "foreign.test" }, body });
  expect((await proxyCsv(req, "offerings", "import")).status).toBe(200);
});

it("denies audit export without a session or system administrator role and permission", async () => {
  const req = () => new Request("http://site.test/api/admin/csv/audit-logs/export");
  mocks.token.mockResolvedValue(null);
  expect((await proxyCsv(req(), "audit-logs", "export")).status).toBe(401);
  mocks.token.mockResolvedValue("private-token");
  for (const account of [
    { roles: ["academy-manager"], permissions: ["audit.view"] },
    { roles: ["system-administrator"], permissions: [] },
    { permissions: ["audit.view"] },
  ]) {
    mocks.user.mockResolvedValue(account);
    expect((await proxyCsv(req(), "audit-logs", "export")).status).toBe(403);
  }
  expect(mocks.fetch).not.toHaveBeenCalled();
});
it("downloads audit CSV privately for an authorized system administrator", async () => {
  mocks.user.mockResolvedValue({ roles: ["system-administrator"], permissions: ["audit.view"] });
  mocks.fetch.mockResolvedValue(new Response("id,action\r\n1,updated\r\n", { headers: { "content-type": "text/csv" } }));
  const result = await proxyCsv(new Request("http://site.test/api/admin/csv/audit-logs/export"), "audit-logs", "export");
  expect(result.status).toBe(200);
  expect(result.headers.get("cache-control")).toBe("no-store");
  expect(result.headers.get("content-disposition")).toContain("audit-logs-export.csv");
  expect(await result.text()).toContain("updated");
  expect(mocks.fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer private-token");
});
it("denies audit templates and imports before parsing a malformed body or calling transport", async () => {
  mocks.user.mockResolvedValue({ roles: ["system-administrator"], permissions: ["audit.view"] });
  const template = new Request("http://site.test/api/admin/csv/audit-logs/template");
  expect((await proxyCsv(template, "audit-logs", "template")).status).toBe(403);
  const upload = new Request("http://site.test/api/admin/csv/audit-logs/import", { method: "POST", headers: { origin: "http://site.test", "content-type": "multipart/form-data; boundary=invalid" }, body: "malformed" });
  expect((await proxyCsv(upload, "audit-logs", "import")).status).toBe(403);
  expect(upload.bodyUsed).toBe(false);
  expect(mocks.fetch).not.toHaveBeenCalled();
});
it("requires write permission to download a CRUD import template", async () => {
  mocks.user.mockResolvedValue({ permissions: ["offerings.view"] });
  expect((await proxyCsv(request("template"), "offerings", "template")).status).toBe(403);
  expect(mocks.fetch).not.toHaveBeenCalled();
});

it.each([
  { roles: ["academy-manager"], permissions: ["audit.view"] },
  { roles: ["system-administrator"], permissions: [] },
])("rechecks the current account after same-token audit access revocation: %j", async account => {
  mocks.user.mockResolvedValueOnce({ roles: ["system-administrator"], permissions: ["audit.view"] }).mockResolvedValueOnce(account);
  mocks.fetch.mockResolvedValue(new Response("id,actor_id,action,subject_type,subject_id,request_id,created_at\r\n", { headers: { "content-type": "text/csv" } }));
  const req = () => new Request("http://site.test/api/admin/csv/audit-logs/export");
  expect((await proxyCsv(req(), "audit-logs", "export")).status).toBe(200);
  expect((await proxyCsv(req(), "audit-logs", "export")).status).toBe(403);
  expect(mocks.user.mock.calls).toEqual([["private-token"], ["private-token"]]);
  expect(mocks.fetch).toHaveBeenCalledOnce();
});

it.each([401, 403])("preserves /me session or active-account rejection %s without reaching audit transport", async status => {
  mocks.user.mockRejectedValue(new ApiError(status, "الجلسة غير متاحة.", null, {}));
  const result = await proxyCsv(new Request("http://site.test/api/admin/csv/audit-logs/export"), "audit-logs", "export");
  expect(result.status).toBe(status);
  expect(mocks.fetch).not.toHaveBeenCalled();
});

it("leaves audit filter validation to Laravel and never turns an over-limit failure into a download", async () => {
  mocks.user.mockResolvedValue({ roles: ["system-administrator"], permissions: ["audit.view"] });
  mocks.fetch.mockResolvedValue(Response.json({ message: "تعذر تصدير أكثر من 5000 سجل." }, { status: 422, headers: { "X-Request-Id": "audit-validation" } }));
  const result = await proxyCsv(new Request("http://site.test/api/admin/csv/audit-logs/export?cursor=unsupported&action=unsupported"), "audit-logs", "export");
  expect(result.status).toBe(422);
  expect(result.headers.get("content-disposition")).toBeNull();
  expect(result.headers.get("x-request-id")).toBe("audit-validation");
  expect(mocks.fetch.mock.calls[0][0].search).toBe("?cursor=unsupported&action=unsupported");
});

it("reports audit transport failures without suggesting import or creating substitute CSV", async () => {
  mocks.user.mockResolvedValue({ roles: ["system-administrator"], permissions: ["audit.view"] });
  mocks.fetch.mockRejectedValue(new TypeError("private backend connection details"));
  const result = await proxyCsv(new Request("http://site.test/api/admin/csv/audit-logs/export"), "audit-logs", "export");
  expect(result.status).toBe(502);
  expect(result.headers.get("content-disposition")).toBeNull();
  const body = await result.text();
  expect(body).toContain("أعد المحاولة");
  expect(body).not.toMatch(/استيراد|private backend/);
});
