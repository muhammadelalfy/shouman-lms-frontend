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
it("shows actual account context with no synthetic progress or private token", async () => {
  const { container } = render(await WorkspacePage({ route: "dashboard" }));
  expect(
    screen.getByRole("heading", { name: "مرحبًا، متعلم حقيقي" }),
  ).toBeTruthy();
  expect(
    screen.getByRole("link", { name: /استكشف المحتوى/ }).getAttribute("href"),
  ).toBe("/catalog");
  expect(container.textContent).not.toContain("private-token");
  expect(screen.queryByRole("link", { name: /افتح لوحة الإدارة/ })).toBeNull();
  expect(deps.users).not.toHaveBeenCalled();
});
it("keeps learning availability honest without made-up enrolled courses", async () => {
  render(await WorkspacePage({ route: "learning" }));
  expect(
    screen.getByRole("heading", { name: "مساحتك التعليمية قيد التجهيز" }),
  ).toBeTruthy();
  expect(
    screen
      .getByRole("link", { name: /استعرض نموذج التعلم/ })
      .getAttribute("href"),
  ).toBe("/preview/my-learning");
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
