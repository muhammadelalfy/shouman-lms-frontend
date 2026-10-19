import { expect, it } from "vitest";
import { resolveAdminRoute } from "./route-resolution";
it("recognizes live users and offerings", () => {
  expect(resolveAdminRoute(["admin", "users", "42"])).toMatchObject({
    section: "users",
    id: 42,
  });
  expect(resolveAdminRoute(["admin", "offerings", "new"])).toMatchObject({
    section: "offerings",
    mode: "new",
  });
});
it("recognizes hierarchy context", () =>
  expect(
    resolveAdminRoute("admin/offerings/42/subjects/9/lessons/3".split("/")),
  ).toMatchObject({ id: 42, subjectId: 9, lessonId: 3 }));
it.each([
  "admin/users/demo-user",
  "preview/admin/users/demo-user",
  "admin/users/-1",
  "admin/roles/new",
  "admin/offerings/0",
  "admin/offerings/4/garbage",
  "admin/offerings/4/subjects/new/lessons/1",
])("rejects %s", (path) =>
  expect(resolveAdminRoute(path.split("/"))).toBeNull(),
);

it("does not allow malformed live paths to fall back to legacy previews", async () => {
  const { isLiveAdminPath } = await import("./route-resolution");
  for (const path of [
    "admin/users/new",
    "admin/users/demo-user",
    "admin/offerings/0",
    "admin/subjects/99",
  ])
    expect(isLiveAdminPath(path.split("/"))).toBe(true);
  expect(isLiveAdminPath(["preview", "admin", "users"])).toBe(false);
});
