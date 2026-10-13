import { describe, expect, it } from "vitest";
import { getPageDefinition } from "./page-content";

describe("platform page inventory", () => {
  it("returns a public catalog preview with related navigation", () => {
    const page = getPageDefinition(["catalog"]);
    expect(page.kind).toBe("preview");
    expect(page.title).toBe("الفهرس التعليمي");
    expect(page.links?.some((link) => link.href === "/tracks")).toBe(true);
  });

  it("keeps policy-dependent learner features truthful", () => {
    expect(getPageDefinition(["quizzes"]).kind).toBe("coming-soon");
    expect(getPageDefinition(["projects"]).kind).toBe("coming-soon");
    expect(getPageDefinition(["certificates", "verify"]).kind).toBe("coming-soon");
  });

  it("provides a safe shell for an unlisted route", () => {
    const page = getPageDefinition(["admin", "analytics"]);
    expect(page.kind).toBe("coming-soon");
    expect(page.description).toContain("متطلباته");
  });
});


