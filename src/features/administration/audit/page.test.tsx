// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { ApiError } from "@/lib/api/errors";
import type { CurrentUser } from "@/features/auth/types";
const deps = vi.hoisted(() => ({ token: vi.fn(), me: vi.fn(), list: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getSessionToken: deps.token }));
vi.mock("@/features/account/api", () => ({ getCurrentUser: deps.me }));
vi.mock("./api", () => ({ listAuditLogs: deps.list }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }), redirect: (href: string) => { throw new Error(`REDIRECT:${href}`); } }));
import { AuditLogPage } from "./page";
const user: CurrentUser = { id: 42, name: "مدير", email: "admin@example.invalid", phone: null, status: "active", roles: ["system-administrator"], permissions: ["audit.view"], email_verified_at: null, last_login_at: null, created_at: null };
const row = { id: 8, actor_id: 2, action: "identity.user.status_changed", subject_type: "user", subject_id: "3", request_id: "audit-request-8", created_at: "2026-10-28T12:30:00.000000Z" };
const result = () => ({ data: [row], links: { first: "https://hostile.invalid", last: null, next: "https://hostile.invalid", prev: null }, meta: { path: "https://hostile.invalid", per_page: 25, next_cursor: "next_opaque", prev_cursor: "prev_opaque" } });
beforeEach(() => { vi.resetAllMocks(); deps.token.mockResolvedValue("private-token"); deps.me.mockResolvedValue(user); deps.list.mockResolvedValue(result()); });
afterEach(cleanup);
it("authenticates before inspecting an invalid query", async () => {
  deps.token.mockResolvedValue(null);
  await expect(AuditLogPage({ query: { per_page: ["1", "100"] } })).rejects.toThrow("REDIRECT:/auth/login?redirectTo=%2Fadmin%2Faudit-logs");
  expect(deps.me).not.toHaveBeenCalled(); expect(deps.list).not.toHaveBeenCalled();
});
it.each([
  { roles: ["system-administrator"], permissions: [] },
  { roles: ["student"], permissions: ["audit.view"] },
  { roles: ["academy-manager"], permissions: ["audit.view"] },
  { roles: ["system-administrator"], permissions: ["audit.view"], status: "disabled" },
])("denies incomplete current access %j before query/data", async access => {
  deps.me.mockResolvedValue({ ...user, ...access });
  render(await AuditLogPage({ query: { search: "invalid" } }));
  expect(screen.getByRole("heading", { name: "ليس لديك صلاحية لعرض سجل التدقيق" })).toBeTruthy();
  expect(screen.queryByRole("table")).toBeNull(); expect(deps.list).not.toHaveBeenCalled();
});
it("rechecks current access on every render after a grant is revoked", async () => {
  await AuditLogPage({ query: {} });
  deps.me.mockResolvedValue({ ...user, roles: ["student"] });
  render(await AuditLogPage({ query: {} }));
  expect(deps.me).toHaveBeenCalledTimes(2); expect(deps.list).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("heading", { name: "ليس لديك صلاحية لعرض سجل التدقيق" })).toBeTruthy();
});
it.each(["me", "list"] as const)("preserves framework redirects and the audit return on %s expiry", async stage => {
  deps[stage].mockRejectedValue(new ApiError(401, "SECRET"));
  await expect(AuditLogPage({ query: {} })).rejects.toThrow("REDIRECT:/auth/login?redirectTo=%2Fadmin%2Faudit-logs&expired=1");
});
it.each(["me", "list"] as const)("shows revoked/disabled %s access as forbidden", async stage => {
  deps[stage].mockRejectedValue(new ApiError(403, "SECRET"));
  const { container } = render(await AuditLogPage({ query: {} }));
  expect(screen.getByRole("heading", { name: "ليس لديك صلاحية لعرض سجل التدقيق" })).toBeTruthy();
  expect(container.textContent).not.toContain("SECRET"); expect(screen.queryByRole("table")).toBeNull();
});
it("does not swallow non-API framework control flow", async () => {
  deps.list.mockRejectedValue(new Error("NEXT_REDIRECT"));
  await expect(AuditLogPage({ query: {} })).rejects.toThrow("NEXT_REDIRECT");
});
it("renders exactly seven metadata columns and fixed local cursor navigation", async () => {
  const { container } = render(await AuditLogPage({ query: { per_page: "100", cursor: "current_opaque" } }));
  expect(deps.list).toHaveBeenCalledWith("private-token", { per_page: "100", cursor: "current_opaque" });
  const region = screen.getByRole("region", { name: "جدول سجل التدقيق" });
  expect(region.tabIndex).toBe(0);
  const table = within(region).getByRole("table");
  expect(table.getAttribute("dir")).toBe("rtl");
  expect(within(table).getAllByRole("columnheader").map(el => el.textContent)).toEqual(["معرّف السجل", "معرّف المنفذ", "الإجراء", "نوع السجل", "معرّف السجل المعني", "معرّف الطلب", "الوقت (UTC)"]);
  expect(within(table).getByText("تغيير حالة المستخدم")).toBeTruthy();
  expect(within(table).queryByRole("link")).toBeNull();
  expect(table.querySelector("time")?.getAttribute("datetime")).toBe(row.created_at);
  expect(table.textContent).toContain("2026-10-28T12:30:00.000000Z UTC");
  expect(screen.getByRole("link", { name: "المزيد من النتائج" }).getAttribute("href")).toBe("/admin/audit-logs?per_page=100&cursor=next_opaque");
  expect(screen.getByRole("link", { name: "النتائج السابقة" }).getAttribute("href")).toBe("/admin/audit-logs?per_page=100&cursor=prev_opaque");
  expect(container.innerHTML).not.toMatch(/hostile|private-token|ملف CSV|قالب CSV/);
  expect(screen.getByRole("button", { name: "تصدير CSV" })).toBeTruthy();
});
it("uses neutral unknown/null metadata and preserves API row order", async () => {
  deps.list.mockResolvedValue({ ...result(), data: [{ ...row, id: 9, actor_id: null, action: "SECRET_ACTION", subject_type: "SECRET_TYPE", subject_id: null, request_id: null }, row] });
  render(await AuditLogPage({ query: {} }));
  const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
  expect(rows.map(el => within(el).getAllByRole("cell")[0].textContent)).toEqual(["9", "8"]);
  expect(rows[0].textContent).not.toMatch(/SECRET|النظام/);
  expect(within(rows[0]).getAllByText("غير متاح")).toHaveLength(5);
});
it.each([
  ["identity.user.roles_changed", "user", "تغيير أدوار المستخدم", "مستخدم"],
  ["identity.role.permissions_changed", "role", "تغيير صلاحيات الدور", "دور"],
  ["course.offering.status_changed", "offering", "تغيير حالة المحتوى التعليمي", "محتوى تعليمي"],
  ["course.offering.pricing_changed", "offering", "تغيير تسعير المحتوى التعليمي", "محتوى تعليمي"],
])("labels the known action %s truthfully", async (action, subject_type, label, typeLabel) => {
  deps.list.mockResolvedValue({ ...result(), data: [{ ...row, action, subject_type }] });
  render(await AuditLogPage({ query: {} }));
  expect(within(screen.getByRole("table")).getByText(label)).toBeTruthy();
  expect(within(screen.getByRole("table")).getByText(typeLabel)).toBeTruthy();
});
it("distinguishes a genuine empty cursor page and offers a clean first-page reset", async () => {
  deps.list.mockResolvedValue({ ...result(), data: [] });
  render(await AuditLogPage({ query: { cursor: "boundary" } }));
  expect(screen.getByRole("heading", { name: "لا توجد سجلات تدقيق للعرض" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "العودة إلى بداية السجل" }).getAttribute("href")).toBe("/admin/audit-logs");
  expect(screen.queryByRole("alert")).toBeNull();
});
it.each([{ per_page: ["25", "100"] }, { search: "SECRET" }, { cursor: "x".repeat(2049) }])("rejects invalid page input %j without a private collection request", async query => {
  render(await AuditLogPage({ query }));
  expect(screen.getByRole("heading", { name: "تعذر تطبيق رابط سجل التدقيق" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "إعادة ضبط الرابط" }).getAttribute("href")).toBe("/admin/audit-logs");
  expect(deps.list).not.toHaveBeenCalled();
});
it("maps a backend invalid cursor to the same resettable query state", async () => {
  deps.list.mockRejectedValue(new ApiError(422, "SECRET"));
  render(await AuditLogPage({ query: { cursor: "invalid_boundary" } }));
  expect(screen.getByRole("heading", { name: "تعذر تطبيق رابط سجل التدقيق" })).toBeTruthy();
});
it.each([0, 429, 500, 503])("shows genuine unavailable %s without raw error/fixtures and retries the validated local query", async status => {
  deps.list.mockRejectedValue(new ApiError(status, "SECRET_SQL"));
  const { container } = render(await AuditLogPage({ query: { per_page: "100", cursor: "retry_boundary" } }));
  expect(screen.getByRole("heading", { name: "تعذر تحميل سجل التدقيق" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "إعادة المحاولة" }).getAttribute("href")).toBe("/admin/audit-logs?per_page=100&cursor=retry_boundary");
  expect(container.textContent).not.toContain("SECRET_SQL"); expect(screen.queryByRole("table")).toBeNull();
  expect(screen.queryByText("لا توجد سجلات تدقيق للعرض")).toBeNull();
});
