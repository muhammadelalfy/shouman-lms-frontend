import { expect, it } from "vitest";
import { resolveWorkspaceRoute } from "./routes";
import { resolveExperienceRoute } from "@/features/experience/route-registry";
it("assigns operational landing routes before previews", () => {
  for (const [path, route] of [
    ["admin", "admin"],
    ["admin/dashboard", "admin"],
    ["dashboard", "dashboard"],
    ["my-learning", "learning"],
    ["learning", "learning"],
  ])
    expect(resolveWorkspaceRoute(path.split("/"))).toBe(route);
  for (const path of [
    "admin/dashboard/extra",
    "admin/users",
    "preview/admin/dashboard",
    "preview/dashboard",
  ])
    expect(resolveWorkspaceRoute(path.split("/"))).toBeNull();
});
it("preserves synthetic dashboard and learning designs only at explicit preview routes", () => {
  for (const path of [
    "admin",
    "admin/dashboard",
    "dashboard",
    "my-learning",
    "learning",
  ])
    expect(resolveExperienceRoute(path.split("/"))).toBeNull();
  expect(resolveExperienceRoute(["preview", "dashboard"])).toMatchObject({
    area: "learner",
    path: ["dashboard"],
  });
  expect(resolveExperienceRoute(["preview", "my-learning"])).toMatchObject({
    area: "learner",
    path: ["my-learning"],
  });
});
