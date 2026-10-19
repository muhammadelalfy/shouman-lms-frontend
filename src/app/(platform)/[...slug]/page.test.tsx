// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { listCatalogOfferings } from "@/features/catalog/api";
import PlatformRoute from "./page";
vi.mock("@/features/catalog/api", () => ({ listCatalogOfferings: vi.fn(), getCatalogOffering: vi.fn() }));
vi.mock("@/features/pages/page-shell", () => ({ PlatformFrame: ({ children }: { children: React.ReactNode }) => <>{children}</>, PlatformPage: () => null }));
vi.mock("@/features/administration/pages", () => ({ AdministrationPage: () => null }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); }, notFound: () => { throw new Error("NOT_FOUND"); } }));
const list = vi.mocked(listCatalogOfferings);
const response = { data: [], links: { first: null, last: null, prev: null, next: null }, meta: { path: "", per_page: 12, next_cursor: null, prev_cursor: null } };
function page(query: Record<string, string | string[] | undefined> = {}, slug = ["search"]) {
  return PlatformRoute({ params: Promise.resolve({ slug }), searchParams: Promise.resolve(query) });
}
afterEach(cleanup);
beforeEach(() => { list.mockReset(); list.mockResolvedValue(response); });
describe("operational catalog search orchestration", () => {
  it("makes one API call using first values and the full normalized tuple", async () => {
    render(await page({ q: ["\u0085 علم \u00a0", "ignored"], kind: "track", pricing: "free", featured: "0", per_page: "5", cursor: "opaque" }));
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith({ q: "علم", kind: "track", pricing: "free", featured: false, perPage: 5, cursor: "opaque" });
    expect((screen.getByLabelText("البحث في المحتوى") as HTMLInputElement).value).toBe("علم");
    expect(screen.getByText("لا توجد نتائج مطابقة لبحثك")).toBeDefined();
  });
  it("removes an empty committed query from the canonical URL", async () => {
    await expect(page({ q: "\u0085\u00a0", kind: "course", pricing: "free" })).rejects.toThrow("REDIRECT:/search?kind=course&pricing=free");
    expect(list).not.toHaveBeenCalled();
  });
  it("accepts 120 supplementary codepoints and rejects 121 without a broadened API call", async () => {
    render(await page({ q: "😀".repeat(120) }));
    expect(list).toHaveBeenCalledTimes(1);
    cleanup(); list.mockClear();
    render(await page({ q: "😀".repeat(121) }));
    expect(list).not.toHaveBeenCalled();
    expect(screen.getByLabelText("البحث في المحتوى").getAttribute("aria-invalid")).toBe("true");
    expect((screen.getByLabelText("البحث في المحتوى") as HTMLInputElement).value).toBe("😀".repeat(121));
  });
  it("keeps invalid filter values visible and avoids an unfiltered request", async () => {
    render(await page({ q: "علم", pricing: "invalid", featured: "yes", per_page: "99" }));
    expect(list).not.toHaveBeenCalled();
    expect((screen.getByLabelText("نوع السعر") as HTMLSelectElement).value).toBe("invalid");
    expect(screen.getByText(/عدد النتائج يجب/)).toBeDefined();
    expect(screen.queryByText("لا توجد نتائج مطابقة لبحثك")).toBeNull();
  });
  it("redirects alias before any catalog call and keeps supported first values", async () => {
    await expect(page({ q: ["علم", "ignored"], kind: "course", cursor: "x", unknown: "drop" }, ["catalog", "search"])).rejects.toThrow("REDIRECT:/search?q=%D8%B9%D9%84%D9%85&kind=course&cursor=x");
    expect(list).not.toHaveBeenCalled();
  });
  it.each([422, 429, 0, 500, 401, 403])("shows safe distinct failure for status %s, preserves q, and never sample results", async (status) => {
    list.mockRejectedValue(new ApiError(status, "PRIVATE ERROR DETAILS", null, status === 422 ? { q: ["PRIVATE VALIDATION"] } : {}));
    render(await page({ q: "علم" }));
    expect((screen.getByLabelText("البحث في المحتوى") as HTMLInputElement).value).toBe("علم");
    expect(screen.queryByText(/PRIVATE/)).toBeNull();
    expect(screen.queryByText("لا توجد نتائج مطابقة لبحثك")).toBeNull();
    expect(screen.queryByText(/تجريبية/)).toBeNull();
    if (status === 422) expect(screen.getByLabelText("البحث في المحتوى").getAttribute("aria-invalid")).toBe("true");
    else {
      expect(screen.getByRole("link", { name: "إعادة المحاولة" }).getAttribute("href")).toBe("/search?q=%D8%B9%D9%84%D9%85");
      if (status === 429) expect(screen.getByText(/طلبات البحث كثيرة/)).toBeDefined();
      if (status === 0 || status === 500) expect(screen.getByText(/تعذر الاتصال بالفهرس مؤقتًا/)).toBeDefined();
    }
  });
});
