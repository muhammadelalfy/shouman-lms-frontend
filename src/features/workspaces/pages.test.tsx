// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ApiError } from "@/lib/api/errors";
const deps = vi.hoisted(() => ({
  token: vi.fn(),
  me: vi.fn(),
  users: vi.fn(),
  offerings: vi.fn(),
}));
vi.mock("@/lib/auth/session", () => ({ getSessionToken: deps.token }));
vi.mock("@/features/account/api", () => ({ getCurrentUser: deps.me }));
vi.mock("@/features/administration/identity/api", () => ({
  listUsers: deps.users,
}));
vi.mock("@/features/administration/courses/api", () => ({
  listOfferings: deps.offerings,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  redirect: (href: string) => {
    throw new Error(`REDIRECT:${href}`);
  },
}));
import { WorkspacePage } from "./pages";
const user = {
  id: 42,
  name: "متعلم حقيقي",
  email: "learner@example.invalid",
  permissions: [],
  roles: ["student"],
};
beforeEach(() => {
  vi.resetAllMocks();
  deps.token.mockResolvedValue("private-token");
  deps.me.mockResolvedValue(user);
  deps.users.mockResolvedValue({ data: [] });
  deps.offerings.mockResolvedValue({ data: [] });
});
afterEach(cleanup);
it("requires sign-in before requesting user or private data", async () => {
  deps.token.mockResolvedValue(null);
  await expect(WorkspacePage({ route: "dashboard" })).rejects.toThrow(
    "REDIRECT:/auth/login?redirectTo=%2Fdashboard",
  );
  expect(deps.me).not.toHaveBeenCalled();
  expect(deps.users).not.toHaveBeenCalled();
});
it("redirects expired sessions to the requested page without rendering fixtures", async () => {
  deps.me.mockRejectedValue(new ApiError(401, "PRIVATE", null, {}));
  await expect(WorkspacePage({ route: "admin" })).rejects.toThrow(
    "REDIRECT:/auth/login?redirectTo=%2Fadmin%2Fdashboard&expired=1",
  );
});
it("denies a learner admin access before any private list call", async () => {
  render(await WorkspacePage({ route: "admin" }));
  expect(
    screen.getByRole("heading", { name: "ليست لديك صلاحية الوصول" }),
  ).toBeTruthy();
  expect(deps.users).not.toHaveBeenCalled();
  expect(deps.offerings).not.toHaveBeenCalled();
});
it("shows the student dashboard with real account context and clearly labeled samples", async () => {
  const { container } = render(await WorkspacePage({ route: "dashboard" }));
  expect(
    screen.getByRole("heading", { name: "مرحبًا، متعلم حقيقي" }),
  ).toBeTruthy();
  expect(screen.getByRole("heading", { name: "خطوة جديدة في رحلة التعلّم" })).toBeTruthy();
  expect(screen.getByRole("navigation", { name: "أقسام المتعلم" })).toBeTruthy();
  for (const link of screen.getAllByRole("link", { name: "لوحتي" })) expect(link.getAttribute("href")).toBe("/dashboard");
  expect(container.textContent).not.toContain("private-token");
  expect(screen.queryByRole("link", { name: /افتح لوحة الإدارة/ })).toBeNull();
  expect(deps.users).not.toHaveBeenCalled();
});
it("labels activity examples and opens ongoing work by default", async () => {
  render(await WorkspacePage({ route: "learning" }));
  expect(screen.getByRole("heading", { level: 1, name: "تعلّمي" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "قيد التعلم" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.queryByRole("heading", { name: "محطات من السيرة النبوية" })).toBeNull();
  expect(screen.getByText(/معاينة الواجهة · بيانات تجريبية/)).toBeTruthy();
  expect(deps.offerings).not.toHaveBeenCalled();
});
it("omits unauthorized panels and requests for a content-only operator", async () => {
  deps.me.mockResolvedValue({ ...user, permissions: ["offerings.view"] });
  deps.offerings.mockResolvedValue({
    data: [{ id: 7, title: "محتوى فعلي", status: "draft" }],
  });
  render(await WorkspacePage({ route: "admin" }));
  expect(deps.offerings).toHaveBeenCalledWith("private-token");
  expect(deps.users).not.toHaveBeenCalled();
  expect(
    screen.getByRole("link", { name: "محتوى فعلي" }).getAttribute("href"),
  ).toBe("/admin/offerings/7");
  expect(screen.queryByRole("heading", { name: "المستخدمون" })).toBeNull();
});
it("preserves successful panels and sanitizes a partial dependency failure", async () => {
  deps.me.mockResolvedValue({
    ...user,
    permissions: ["users.view", "offerings.view"],
  });
  deps.users.mockResolvedValue({
    data: [{ id: 2, name: "اسم فعلي", status: "active" }],
  });
  deps.offerings.mockRejectedValue(
    new ApiError(503, "PRIVATE SQL CONNECTION", null, {}),
  );
  const { container } = render(await WorkspacePage({ route: "admin" }));
  expect(screen.getByRole("link", { name: "اسم فعلي" })).toBeTruthy();
  expect(screen.getByText("تعذر تحميل المحتوى التعليمي الآن.")).toBeTruthy();
  expect(container.textContent).not.toContain("PRIVATE SQL CONNECTION");
});
it("redirects when session expires during an admin panel request", async () => {
  deps.me.mockResolvedValue({ ...user, permissions: ["offerings.view"] });
  deps.offerings.mockRejectedValue(new ApiError(401, "PRIVATE", null, {}));
  await expect(WorkspacePage({ route: "admin" })).rejects.toThrow(
    "REDIRECT:/auth/login?redirectTo=%2Fadmin%2Fdashboard&expired=1",
  );
});
it("renders safe recovery for /me outage with no account details", async () => {
  deps.me.mockRejectedValue(new ApiError(503, "PRIVATE", null, {}));
  render(await WorkspacePage({ route: "dashboard" }));
  expect(
    screen.getByRole("heading", { name: "تعذر فتح المساحة الآن" }),
  ).toBeTruthy();
  expect(screen.queryByText(user.name)).toBeNull();
  expect(
    screen.getByRole("link", { name: "إعادة المحاولة" }).getAttribute("href"),
  ).toBe("/dashboard");
});
it("offers real empty-list next actions only when permitted", async () => {
  deps.me.mockResolvedValue({
    ...user,
    permissions: ["offerings.view", "offerings.manage"],
  });
  render(await WorkspacePage({ route: "admin" }));
  expect(screen.getByText("لم يُضف محتوى تعليمي بعد.")).toBeTruthy();
  expect(
    screen.getByRole("link", { name: /أنشئ محتوى/ }).getAttribute("href"),
  ).toBe("/admin/offerings/new");
});
it("renders /me forbidden response without private summaries", async () => {
  deps.me.mockRejectedValue(new ApiError(403, "PRIVATE", null, {}));
  render(await WorkspacePage({ route: "admin" }));
  expect(
    screen.getByRole("heading", { name: "ليست لديك صلاحية الوصول" }),
  ).toBeTruthy();
  expect(deps.users).not.toHaveBeenCalled();
});
it("handles revoked panel permissions without exposing rejected records", async () => {
  deps.me.mockResolvedValue({ ...user, permissions: ["users.view"] });
  deps.users.mockRejectedValue(new ApiError(403, "PRIVATE", null, {}));
  render(await WorkspacePage({ route: "admin" }));
  expect(screen.getByText("لم تعد لديك صلاحية لعرض هذه السجلات.")).toBeTruthy();
  expect(screen.queryByText("PRIVATE")).toBeNull();
});

it("opens the design directory after verified administrator access while retaining live tools",async()=>{
 deps.me.mockResolvedValue({...user,roles:["system-administrator"],permissions:["homepage.manage","offerings.view"]});
 render(await WorkspacePage({route:"admin"}));
 expect(screen.getByRole("heading",{level:1,name:"كل أبواب المركز، في مكان واحد."})).toBeTruthy();
 expect(screen.getByRole("link",{name:"إدارة قسم الاهتمامات"}).getAttribute("href")).toBe("/admin/homepage/needs");
 expect(screen.getByRole("link",{name:"إدارة المحتوى التعليمي"}).getAttribute("href")).toBe("/admin/offerings");
});
it("routes an administrator's generic dashboard link to the admin landing",async()=>{
 deps.me.mockResolvedValue({...user,roles:["academy-manager"],permissions:["offerings.view"]});
 await expect(WorkspacePage({route:"dashboard"})).rejects.toThrow("REDIRECT:/admin/dashboard");
});

it("shows audit CSV as export-only only to system administrators with audit permission", async () => {
  deps.me.mockResolvedValue({ ...user, roles: ["system-administrator"], permissions: ["audit.view"] });
  render(await WorkspacePage({ route: "admin" }));
  const toolbar = screen.getByRole("region", { name: "CSV · سجل التدقيق" });
  expect(toolbar.querySelectorAll("button").length).toBe(1);
  expect(toolbar.textContent).toContain("تصدير CSV");
  expect(toolbar.querySelector('input[type="file"]')).toBeNull();
  expect(deps.users).not.toHaveBeenCalled();
  expect(deps.offerings).not.toHaveBeenCalled();
});
it.each([
  { roles: ["academy-manager"], permissions: ["audit.view"] },
  { roles: ["system-administrator"], permissions: ["users.view"] },
])("omits audit CSV without both required role and permission: %j", async account => {
  deps.me.mockResolvedValue({ ...user, ...account });
  render(await WorkspacePage({ route: "admin" }));
  expect(screen.queryByRole("region", { name: "CSV · سجل التدقيق" })).toBeNull();
});
