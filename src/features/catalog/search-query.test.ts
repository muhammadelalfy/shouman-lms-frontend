import { describe, expect, it } from "vitest";
import { normalizeCatalogQuery, catalogQueryError, parseCatalogQuery } from "./search-query";
describe("catalog query", () => {
  it("trims exact Unicode White_Space and preserves BOM/interior text", () => {
    expect(normalizeCatalogQuery("\u0085\u00a0 علم  نافع \u3000")).toBe("علم  نافع");
    expect(normalizeCatalogQuery("\ufeffعلم\ufeff")).toBe("\ufeffعلم\ufeff");
  });
  it("retains rejected supported values and parses first scalars without silently broadening", () => {
    const parsed = parseCatalogQuery({ q: [" علم ", "other"], kind: "bogus", pricing: "donation", featured: "yes", per_page: "51", cursor: "opaque" });
    expect(parsed.values).toMatchObject({ q: "علم", kind: "bogus", pricing: "donation", featured: "yes", per_page: "51" });
    expect(Object.keys(parsed.fieldErrors).sort()).toEqual(["featured", "kind", "per_page", "pricing"]);
    expect(parsed.filters).toMatchObject({ q: "علم", cursor: "opaque" });
  });
  it("counts supplementary code points after normalization", () => {
    expect(catalogQueryError(" 😀".slice(1).repeat(120))).toBeUndefined();
    expect(catalogQueryError("😀".repeat(121))).toBeTruthy();
  });
});
