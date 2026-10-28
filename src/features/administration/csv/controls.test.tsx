// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
const mocks = vi.hoisted(() => ({ refresh: vi.fn(), fetch: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mocks.refresh }) }));
import { CsvControls } from "./controls";
beforeEach(() => {
  mocks.fetch.mockReset(); mocks.refresh.mockReset(); vi.stubGlobal("fetch", mocks.fetch);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(cleanup);
function selectAndConfirm() {
  fireEvent.change(screen.getByLabelText("ملف CSV · المستخدمون"), { target: { files: [new File(["id,status,roles\r\n2,active,[]"], "users.csv")] } });
  fireEvent.click(screen.getByRole("button", { name: "استيراد CSV" }));
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "تأكيد الاستيراد" }));
}
it("hides mutation/file controls for readers", () => {
  render(<CsvControls resource="users" label="المستخدمون" />);
  expect(screen.getByRole("button", { name: "تصدير CSV" })).toBeTruthy();
  expect(screen.queryByLabelText("ملف CSV · المستخدمون")).toBeNull();
});
it("requires explicit confirmation and reports actual row validation without success", async () => {
  mocks.fetch.mockResolvedValue(Response.json({ message: "لم يُحفظ الملف", errors: { "rows.2.roles": ["دور غير مسموح"] } }, { status: 422 }));
  render(<CsvControls resource="users" label="المستخدمون" canImport />);
  fireEvent.change(screen.getByLabelText("ملف CSV · المستخدمون"), { target: { files: [new File(["csv"], "users.csv")] } });
  fireEvent.click(screen.getByRole("button", { name: "استيراد CSV" }));
  expect(mocks.fetch).not.toHaveBeenCalled();
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "تأكيد الاستيراد" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("rows.2.roles: دور غير مسموح"));
  expect(screen.queryByText(/اكتمل الاستيراد:/)).toBeNull(); expect(mocks.refresh).not.toHaveBeenCalled();
});
it("blocks duplicate operations while pending and refreshes only after confirmed actual counts", async () => {
  let resolve!: (response: Response) => void;
  mocks.fetch.mockImplementation(() => new Promise<Response>(release => { resolve = release; }));
  render(<CsvControls resource="users" label="المستخدمون" canImport />);
  selectAndConfirm();
  expect((screen.getByRole("button", { name: "تصدير CSV" }) as HTMLButtonElement).disabled).toBe(true);
  expect(mocks.fetch).toHaveBeenCalledTimes(1);
  await act(async () => resolve(Response.json({ data: { resource: "users", processed: 2, created: 0, updated: 1 } })));
  expect(screen.getByRole("status").textContent).toContain("2 سجل؛ أُنشئ 0، وحُدّث 1");
  expect(mocks.refresh).toHaveBeenCalledTimes(1);
});
it("never saves JSON as a CSV download", async () => {
  mocks.fetch.mockResolvedValue(Response.json({ data: [] }));
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  render(<CsvControls resource="offerings" label="المحتوى" filters={{ kind: "course", cursor: "old-page" }} />);
  fireEvent.click(screen.getByRole("button", { name: "تصدير CSV" }));
  await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
  expect(click).not.toHaveBeenCalled();
  expect(mocks.fetch.mock.calls[0][0]).toBe("/api/admin/csv/offerings/export?kind=course");
});
it("downloads CSV only after correct response content type", async () => {
  mocks.fetch.mockResolvedValue(new Response("id,title\r\n1,علم", { headers: { "content-type": "text/csv" } }));
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  URL.createObjectURL = vi.fn(() => "blob:csv"); URL.revokeObjectURL = vi.fn();
  render(<CsvControls resource="subjects" label="المواد" filters={{ offering_id: 7 }} />);
  fireEvent.click(screen.getByRole("button", { name: "تصدير CSV" }));
  await waitFor(() => expect(click).toHaveBeenCalledOnce());
  expect(screen.getByRole("status").textContent).toContain("تم تنزيل ملف CSV");
  expect(mocks.fetch.mock.calls[0][0]).toContain("offering_id=7");
});
it("reports an expired session and never claims success", async () => {
  mocks.fetch.mockResolvedValue(Response.json({ message: "انتهت جلستك" }, { status: 401 }));
  render(<CsvControls resource="users" label="المستخدمون" canImport />);
  selectAndConfirm();
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("انتهت جلستك"));
  expect(screen.getByRole("link", { name: "تسجيل الدخول مجددًا" })).toBeTruthy();
  expect(mocks.refresh).not.toHaveBeenCalled();
});
it("explains homepage import is draft-only and prevents unsaved editor imports", () => {
  render(<CsvControls resource="homepage-faq" label="الأسئلة الشائعة" canImport disabled />);
  expect((screen.getByLabelText("ملف CSV · الأسئلة الشائعة") as HTMLInputElement).disabled).toBe(true);
  expect((screen.getByRole("button", { name: "استيراد CSV" }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByText(/يستبدل الاستيراد المسودة ولا ينشرها/)).toBeTruthy();
});

it("keeps audit CSV export-only even if import capability is passed accidentally", () => {
  render(<CsvControls resource="audit-logs" label="سجل التدقيق" canImport />);
  const control = screen.getByRole("region", { name: "CSV · سجل التدقيق" });
  expect(within(control).getByRole("heading", { name: "تصدير · سجل التدقيق" })).toBeTruthy();
  expect(within(control).getAllByRole("button")).toHaveLength(1);
  expect(within(control).queryByLabelText(/ملف CSV/)).toBeNull();
  expect(control.textContent).toContain("5000");
  expect(control.textContent).not.toMatch(/استيراد|مرشحات|قالب/);
});

it("downloads the unfiltered audit CSV once while reporting pending and actual success", async () => {
  let resolve!: (response: Response) => void;
  mocks.fetch.mockImplementation(() => new Promise<Response>(release => { resolve = release; }));
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  URL.createObjectURL = vi.fn(() => "blob:audit-csv"); URL.revokeObjectURL = vi.fn();
  render(<CsvControls resource="audit-logs" label="سجل التدقيق" filters={{ cursor: "old-page", action: "unsupported" }} />);
  const button = screen.getByRole("button", { name: "تصدير CSV" });
  fireEvent.click(button);
  expect((button as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByRole("region").getAttribute("aria-busy")).toBe("true");
  expect(screen.getByRole("status").textContent).toContain("جارٍ");
  fireEvent.click(button);
  expect(mocks.fetch).toHaveBeenCalledTimes(1);
  expect(mocks.fetch.mock.calls[0][0]).toBe("/api/admin/csv/audit-logs/export");
  await act(async () => resolve(new Response("id,actor_id,action,subject_type,subject_id,request_id,created_at\r\n", { headers: { "content-type": "text/csv" } })));
  await waitFor(() => expect(click).toHaveBeenCalledOnce());
  expect(screen.getByRole("status").textContent).toContain("تم تنزيل ملف CSV");
  expect((button as HTMLButtonElement).disabled).toBe(false);
  expect(mocks.refresh).not.toHaveBeenCalled();
});

it.each([401, 403, 422, 503])("keeps audit %s failures visible without downloading or suggesting import", async status => {
  mocks.fetch.mockResolvedValue(Response.json({ message: "تعذر تنزيل سجل التدقيق." }, { status }));
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  render(<CsvControls resource="audit-logs" label="سجل التدقيق" />);
  fireEvent.click(screen.getByRole("button", { name: "تصدير CSV" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("تعذر تنزيل سجل التدقيق."));
  expect(click).not.toHaveBeenCalled();
  expect(screen.getByRole("region").textContent).not.toContain("استيراد");
  expect(Boolean(screen.queryByRole("link", { name: "تسجيل الدخول مجددًا" }))).toBe(status === 401);
});

it("reports an interrupted audit download with a manual retry and focuses the error", async () => {
  mocks.fetch.mockRejectedValue(new TypeError("offline"));
  render(<CsvControls resource="audit-logs" label="سجل التدقيق" />);
  fireEvent.click(screen.getByRole("button", { name: "تصدير CSV" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("أعد المحاولة"));
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("alert")));
  expect(screen.getByRole("region").textContent).not.toContain("استيراد");
  expect(mocks.fetch).toHaveBeenCalledTimes(1);
  expect((screen.getByRole("button", { name: "تصدير CSV" }) as HTMLButtonElement).disabled).toBe(false);
});

it("returns an expired audit export session to the safe audit destination", async () => {
  mocks.fetch.mockResolvedValue(Response.json({ message: "انتهت جلستك" }, { status: 401 }));
  render(<CsvControls resource="audit-logs" label="سجل التدقيق" returnTo="/admin/audit-logs" filters={{ per_page: "100", cursor: "opaque" }} />);
  fireEvent.click(screen.getByRole("button", { name: "تصدير CSV" }));
  await waitFor(() => expect(screen.getByRole("link", { name: "تسجيل الدخول مجددًا" }).getAttribute("href")).toBe("/auth/login?redirectTo=%2Fadmin%2Faudit-logs&expired=1"));
  expect(mocks.fetch.mock.calls[0][0]).toBe("/api/admin/csv/audit-logs/export");
});
it.each(["https://hostile.invalid", "//hostile.invalid", "/\\hostile.invalid", "/admin/audit-logs\n"])("rejects unsafe CSV return destination %j", async returnTo => {
  mocks.fetch.mockResolvedValue(Response.json({ message: "انتهت جلستك" }, { status: 401 }));
  render(<CsvControls resource="audit-logs" label="سجل التدقيق" returnTo={returnTo} />);
  fireEvent.click(screen.getByRole("button", { name: "تصدير CSV" }));
  await waitFor(() => expect(screen.getByRole("link", { name: "تسجيل الدخول مجددًا" }).getAttribute("href")).toBe("/auth/login"));
});
