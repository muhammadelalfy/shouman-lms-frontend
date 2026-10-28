import { describe, expect, it } from "vitest";
import { marketingHref, marketingRoutes, resolveMarketingRoute, marketingNavigation, marketingAudience, marketingAudienceHref } from "./routes";
describe("marketing route boundaries", () => {
  it("resolves every explicit page without inventing nested records", () => {
    for (const route of marketingRoutes) {
      expect(resolveMarketingRoute(route.segment ? [route.segment] : [])?.id).toBe(route.id);
      expect(marketingHref(route.id)).toBe(`/preview/marketing${route.segment ? `/${route.segment}` : ""}`);
      expect(resolveMarketingRoute([route.segment, "unknown"])).toBeUndefined();
    }
    expect(resolveMarketingRoute(["institutional-subscriptions"])).toBeUndefined();
    expect(resolveMarketingRoute(["not-a-page"])).toBeUndefined();
  });
  it("keeps the certificate verification destination inside the explicit preview namespace", () => {
    expect(marketingHref("verify")).toBe("/preview/marketing/verify");
    expect(marketingRoutes.filter(route => route.id === "verify")).toHaveLength(1);
  });
});

describe("marketing audience placement", () => {
  it("keeps learner discovery and personal benefits out of staff navigation", () => {
    expect(marketingNavigation("student").map(route => route.id)).toContain("family");
    expect(marketingNavigation("student").map(route => route.id)).toContain("certificate");
    expect(marketingNavigation("student").map(route => route.id)).not.toContain("notifications");
    expect(marketingNavigation("student").map(route => route.id)).not.toContain("track-editor");
    expect(marketingNavigation("teacher").map(route => route.id)).toEqual(["notifications", "meeting"]);
    expect(marketingNavigation("admin").map(route => route.id)).toEqual(["track-editor"]);
  });
  it("allows teacher context for meetings only and preserves preview URLs", () => {
    expect(marketingAudience("notifications")).toBe("teacher");
    expect(marketingAudience("track-editor")).toBe("admin");
    expect(marketingAudience("family", "teacher")).toBe("student");
    expect(marketingAudience("meeting", "teacher")).toBe("teacher");
    expect(marketingAudienceHref("meeting", "teacher")).toBe("/preview/marketing/meeting?audience=teacher");
    expect(marketingAudienceHref("certificate", "student")).toBe(marketingHref("certificate"));
  });
});
