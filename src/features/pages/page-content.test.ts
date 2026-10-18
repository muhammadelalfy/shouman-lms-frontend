import { describe, expect, it } from "vitest";
import { getPageDefinition, isKnownPlatformRoute } from "./page-content";

describe("platform page inventory", () => {
  it("provides an explicit public search preview without fabricated results", () => {
    const page = getPageDefinition(["catalog", "search"]);
    expect(page.kind).toBe("preview");
    expect(page.previewLabel).toContain("غير متصل");
    expect(page.description).toContain("لا تتوفر");
  });

  it("keeps policy-dependent learner features labeled as previews", () => {
    for (const route of [["quizzes"], ["projects"], ["certificates", "verify"], ["admin", "analytics"], ["admin", "settings"]]) {
      expect(isKnownPlatformRoute(route)).toBe(true);
      expect(getPageDefinition(route).kind).toBe("coming-soon");
    }
  });

  it("covers the Claude route families without inventing record data", () => {
    expect(isKnownPlatformRoute(["admin", "users", "42"])).toBe(true);
    expect(isKnownPlatformRoute(["learning", "lessons", "lesson-slug"])).toBe(true);
    expect(getPageDefinition(["admin", "users", "42"]).description).toContain("لا تعرض سجلات");
  });

  it("distinguishes unknown routes from explicitly designed previews", () => {
    expect(isKnownPlatformRoute(["admin", "analytics"])).toBe(true);
    expect(isKnownPlatformRoute(["unknown", "route"])).toBe(false);
    expect(getPageDefinition(["unknown", "route"]).title).toBe("الصفحة غير موجودة");
  });
  it("does not resolve inherited object members as page definitions", () => {
    for (const key of ["constructor", "toString", "__proto__"]) {
      expect(isKnownPlatformRoute([key])).toBe(false);
      expect(getPageDefinition([key]).title).toBe("الصفحة غير موجودة");
    }
  });
});
