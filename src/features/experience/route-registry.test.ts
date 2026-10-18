import { describe, expect, it } from "vitest";
import { experienceRoutes, resolveExperienceRoute, workspaceForExperience } from "./route-registry";

describe("complete frontend route registry", () => {
  it("resolves every designed example to its dedicated surface", () => {
    expect(experienceRoutes.length).toBeGreaterThan(70);
    expect(new Set(experienceRoutes.map((route) => route.href)).size).toBe(experienceRoutes.length);
    for (const route of experienceRoutes) {
      const resolved = resolveExperienceRoute(route.href.slice(1).split("/"));
      expect(resolved?.area, route.href).toBe(route.area);
      expect(resolved?.title, route.href).toBe(route.title);
    }
  });
  it("supports design-brief aliases without intercepting live catalog or identity", () => {
    expect(resolveExperienceRoute(["learn", "track", "demo-lesson"])?.path).toEqual(["learning", "lessons", "demo-lesson"]);
    expect(resolveExperienceRoute(["community", "demo-group"])?.path).toEqual(["community", "groups", "demo-group"]);
    for (const route of [["catalog"], ["courses"], ["auth", "login"], ["account"]]) expect(resolveExperienceRoute(route)).toBeNull();
  });
  it("keeps unknown routes and malformed paths outside the registry", () => {
    for (const route of [["admin", "unknown"], ["something"], ["quizzes", "demo", "unknown"], ["events", "demo", "unknown"], ["community", "groups", "demo", "unknown"]]) expect(resolveExperienceRoute(route)).toBeNull();
    for (const route of ["learn/not-a-kind/demo-lesson", "learn/course/demo-lesson/garbage/extra", "learn/course/demo-lesson/quiz", "learn/course/demo-lesson/quiz/demo-quiz/garbage", "learn/course/demo-lesson/quiz/demo-quiz/result/extra"]) expect(resolveExperienceRoute(route.split("/"))).toBeNull();
    for (const route of ["admin/dashboard/anything", "admin/roles/anything", "admin/analytics/anything", "admin/integrations/anything", "admin/notifications/foo/questions", "admin/payments/new", "admin/settings/anything"]) expect(resolveExperienceRoute(route.split("/"))).toBeNull();
  });
  it("keeps shared community and personal meetings in learner navigation", () => {
    for (const route of [["community"], ["meetings", "mine"]]) {
      const resolved = resolveExperienceRoute(route);
      if (!resolved) throw new Error("Missing designed learner route");
      expect(workspaceForExperience(resolved)).toBe("learner");
    }
  });
  it("preserves the distinct offer and coupon workspaces", () => {
    expect(resolveExperienceRoute(["admin", "offers"])?.path).toEqual(["admin", "offers"]);
    expect(resolveExperienceRoute(["admin", "coupons"])?.path).toEqual(["admin", "coupons"]);
  });
});
