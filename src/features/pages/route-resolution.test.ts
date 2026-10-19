import { describe, expect, it } from "vitest";
import { catalogRouteAcceptsKind, isOfferingKind, isPricingModel, resolveCatalogRoute, resolveAuthAlias, resolveCatalogSearchAlias } from "./route-resolution";

describe("catalog route resolution", () => {
  it("assigns canonical search to the operational listing", () => {
    expect(resolveCatalogRoute(["search"])).toMatchObject({ type: "listing", basePath: "/search", kinds: [] });
  });
  it("redirects the search alias with only supported fields and first repeated scalar", () => {
    expect(resolveCatalogSearchAlias(["catalog", "search"], { q: ["علم % &", "ignored"], kind: "track", featured: "0", per_page: "5", cursor: "token", unknown: "drop" })).toBe("/search?q=%D8%B9%D9%84%D9%85+%25+%26&kind=track&featured=0&per_page=5&cursor=token");
    expect(resolveCatalogSearchAlias(["courses", "search"], {})).toBeNull();
  });
  it("maps public list routes to only their supported kinds", () => {
    expect(resolveCatalogRoute(["tracks"])).toMatchObject({ type: "listing", kinds: ["track"] });
    expect(resolveCatalogRoute(["courses"])).toMatchObject({ type: "listing", kinds: ["course"] });
  });

  it("maps intensive and seasonal program details to their matching routes", () => {
    const route = resolveCatalogRoute(["programs", "summer-course"]);
    expect(route?.type).toBe("detail");
    if (route?.type !== "detail") throw new Error("Expected catalog detail route");
    expect(catalogRouteAcceptsKind(route, "intensive_program")).toBe(true);
    const seasonalRoute = resolveCatalogRoute(["seasonal-programs", "summer-course"]);
    expect(seasonalRoute?.type).toBe("detail");
    if (seasonalRoute?.type !== "detail") throw new Error("Expected seasonal program detail route");
    expect(catalogRouteAcceptsKind(seasonalRoute, "seasonal_program")).toBe(true);
    expect(catalogRouteAcceptsKind(route, "course")).toBe(false);
  });

  it("rejects unknown routes and unsupported filter values", () => {
    expect(resolveCatalogRoute(["payments"])).toBeNull();
    expect(isOfferingKind("course")).toBe(true);
    expect(isOfferingKind("payment")).toBe(false);
    expect(isPricingModel("paid")).toBe(true);
    expect(isPricingModel("discount")).toBe(false);
  });
  it("rejects object-prototype keys instead of treating them as auth or catalog routes", () => {
    for (const key of ["constructor", "toString", "__proto__"]) {
      expect(resolveCatalogRoute([key])).toBeNull();
      expect(resolveCatalogRoute([key, "demo"])).toBeNull();
      expect(resolveAuthAlias([key])).toBeNull();
    }
    expect(resolveAuthAlias(["login"])).toBe("/auth/login");
  });
});
