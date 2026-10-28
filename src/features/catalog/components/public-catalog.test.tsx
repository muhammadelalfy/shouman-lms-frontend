// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format/price";
import type { CatalogOffering, CatalogOfferingDetail } from "../types";
import { PublicCatalogListing, PublicOfferingDetail, type PublicCatalogListingProps } from "./public-catalog";

afterEach(cleanup);

const track: CatalogOffering = {
  id: 12,
  kind: "track",
  title: "مسار سنة أولى علم",
  slug: "مسار-سنة-أولى-علم",
  summary: "مدخل منظم إلى طلب العلم.",
  is_featured: true,
  season_name: null,
  estimated_duration_minutes: 180,
  starts_at: null,
  ends_at: null,
  pricing: {
    model: "paid",
    price_amount: 150_000,
    discounted_price_amount: 120_000,
    final_price_amount: 120_000,
    currency: "EGP",
  },
  lesson_count: 6,
};

function listingProps(
  offerings: CatalogOffering[],
  overrides: Partial<PublicCatalogListingProps> = {},
) {
  return {
    offerings,
    title: "استكشف المحتوى",
    description: "تصفّح المواد المنشورة في المركز واختر ما يناسب رحلتك.",
    basePath: "/catalog",
    nextCursor: null,
    previousCursor: null,
    ...overrides,
  };
}

describe("public catalog listing", () => {
  it("submits URL search without cursor and retains the full tuple in pagination and clear", () => {
    const { container } = render(<PublicCatalogListing {...listingProps([track], { basePath: "/search", q: "علم % &", kind: "track", pricing: "free", featured: true, perPage: 5, nextCursor: "opaque" })} />);
    const input = screen.getByLabelText("البحث في المحتوى") as HTMLInputElement;
    expect(input.value).toBe("علم % &");
    const form = input.closest("form")!;
    expect(form.method).toBe("get");
    expect(form.action).toContain("/search");
    expect(new FormData(form).get("cursor")).toBeNull();
    expect(new FormData(form).get("featured")).toBe("1");
    expect(new FormData(form).get("per_page")).toBe("5");
    const next = new URL(screen.getByRole("link", { name: /المحتوى التالي/ }).getAttribute("href")!, "https://test.local");
    expect(Object.fromEntries(next.searchParams)).toEqual({ q: "علم % &", kind: "track", pricing: "free", featured: "1", per_page: "5", cursor: "opaque" });
    const clear = new URL(screen.getByRole("link", { name: "مسح البحث" }).getAttribute("href")!, "https://test.local");
    expect(Object.fromEntries(clear.searchParams)).toEqual({ kind: "track", pricing: "free", featured: "1", per_page: "5" });
    expect(screen.getByRole("link", { name: "مسح الكل" }).getAttribute("href")).toBe("/search");
    expect(container.textContent).not.toContain("تجريبية");
  });
  it("distinguishes no matches and associated query validation from empty success", () => {
    const { rerender } = render(<PublicCatalogListing {...listingProps([], { q: "لا تطابق" })} />);
    expect(screen.getByRole("heading", { name: "لا توجد نتائج مطابقة لبحثك" })).toBeDefined();
    rerender(<PublicCatalogListing {...listingProps([], { q: "😀".repeat(121), queryError: "استخدم ١٢٠ حرفًا أو أقل." })} />);
    const input = screen.getByLabelText("البحث في المحتوى");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toContain("catalog-query-error");
    expect(screen.queryByText("لا توجد مواد منشورة للعرض الآن")).toBeNull();
  });
  it("renders visible API cards, returned prices, selected filters, and safe cursor navigation", () => {
    const { container } = render(
      <PublicCatalogListing
        {...listingProps([track], {
          basePath: "/tracks",
          pricing: "paid",
          nextCursor: "next token",
          previousCursor: "previous token",
        })}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "استكشف المحتوى" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 2, name: track.title })).toBeDefined();
    const renderedPrices = Array.from(container.querySelectorAll("bdi"), (node) => normalizePrice(node.textContent ?? ""));
    expect(renderedPrices).toContain(normalizePrice(formatPrice(120_000, "EGP")));
    expect(renderedPrices).toContain(normalizePrice(formatPrice(150_000, "EGP")));
    expect((screen.getByLabelText("نوع السعر") as HTMLSelectElement).value).toBe("paid");

    const form = screen.getByRole("button", { name: "تطبيق التصفية" }).closest("form");
    expect(form?.getAttribute("action")).toBe("/tracks");
    expect(within(form!).getByLabelText("نوع السعر").getAttribute("name")).toBe("pricing");

    const detailsLinks = screen.getAllByRole("link", { name: /تفاصيل المحتوى|مسار سنة أولى علم/ });
    expect(detailsLinks.every((link) => link.getAttribute("href") === `/tracks/${encodeURIComponent(track.slug)}`)).toBe(true);
    expect(screen.getByRole("link", { name: /المحتوى السابق/ }).getAttribute("href"))
      .toBe("/tracks?pricing=paid&cursor=previous+token");
    expect(screen.getByRole("link", { name: /المحتوى التالي/ }).getAttribute("href"))
      .toBe("/tracks?pricing=paid&cursor=next+token");
  });

  it("shows an honest no-results state and a link that clears the current filter", () => {
    render(
      <PublicCatalogListing {...listingProps([], { basePath: "/courses", pricing: "free" })} />,
    );

    expect(screen.getByRole("heading", { name: "لا توجد مواد منشورة بهذه التصفية" })).toBeDefined();
    expect(screen.getByRole("link", { name: "عرض كل المحتوى" }).getAttribute("href"))
      .toBe("/courses");
    expect(screen.queryByRole("link", { name: /المحتوى التالي/ })).toBeNull();
  });

  it("retains a selected catalog kind across filter clearing and cursor navigation", () => {
    render(<PublicCatalogListing {...listingProps([track], { kind: "track", pricing: "paid", nextCursor: "next" })} />);
    expect((screen.getByLabelText("نوع المحتوى") as HTMLSelectElement).value).toBe("track");
    expect(screen.getByRole("link", { name: /إزالة التصفية/ }).getAttribute("href")).toBe("/catalog?kind=track");
    expect(screen.getByRole("link", { name: /المحتوى التالي/ }).getAttribute("href")).toBe("/catalog?kind=track&pricing=paid&cursor=next");
  });

  it("identifies an empty catalog without implying that a search was run", () => {
    render(<PublicCatalogListing {...listingProps([])} />);

    expect(screen.getByRole("heading", { name: "لا توجد مواد منشورة للعرض الآن" })).toBeDefined();
    expect(screen.queryByRole("search")).toBeNull();
  });

  it("shows a server-provided load failure separately from an empty catalog", () => {
    render(<PublicCatalogListing {...listingProps([], { errorMessage: "حاول تحديث الصفحة." })} />);

    expect(screen.getByRole("alert").textContent).toContain("حاول تحديث الصفحة.");
    expect(screen.queryByRole("heading", { name: "لا توجد مواد منشورة للعرض الآن" })).toBeNull();
  });
});

describe("public offering detail", () => {
  const offering: CatalogOfferingDetail = {
    ...track,
    description: "وصف تفصيلي للمسار.",
    goals: ["بناء أساس علمي", "تنظيم خطة التعلم"],
    target_audience: "لمن يبدأ رحلته في طلب العلم.",
    sequencing_mode: "after_previous_completed",
    outline_style: "subjects",
    total_lesson_minutes: 165,
    instructors: [{ id: 7, name: "د. حازم شومان" }],
    outline: [
      {
        id: 2,
        title: "مدخل إلى العلم",
        description: "المفاهيم الأساسية.",
        lessons: [
          { id: 21, title: "فضل طلب العلم", estimated_duration_minutes: 25 },
          { id: 22, title: "تنظيم الوقت", estimated_duration_minutes: null },
        ],
      },
    ],
  };

  it("renders returned detail fields and published outline without operational enrollment claims", () => {
    const { container } = render(<PublicOfferingDetail offering={offering} backHref="/tracks" />);

    expect(screen.getByRole("heading", { level: 1, name: offering.title })).toBeDefined();
    expect(screen.getByText(offering.description!)).toBeDefined();
    expect(screen.getByText("بناء أساس علمي")).toBeDefined();
    expect(screen.getByText(offering.target_audience!)).toBeDefined();
    expect(screen.getByText("د. حازم شومان")).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: "مدخل إلى العلم" })).toBeDefined();
    expect(screen.getByText("فضل طلب العلم")).toBeDefined();
    const renderedPrices = Array.from(container.querySelectorAll("bdi"), (node) => normalizePrice(node.textContent ?? ""));
    expect(renderedPrices).toContain(normalizePrice(formatPrice(120_000, "EGP")));
    expect(screen.getByText(/التسجيل أو الدفع غير متاح/)).toBeDefined();
    expect(screen.queryByRole("button", { name: /شراء|تسجيل|التحاق/ })).toBeNull();
    expect(screen.getByRole("link", { name: "المسارات" }).getAttribute("href")).toBe("/tracks");
  });

  it("flattens lessons for lesson-style offerings and gives an honest empty-outline state", () => {
    const directLessons: CatalogOfferingDetail = {
      ...offering,
      kind: "course",
      outline_style: "lessons",
      outline: [offering.outline[0]!],
    };
    const { rerender } = render(<PublicOfferingDetail offering={directLessons} backHref="/courses" />);

    expect(screen.getByRole("list", { name: "الدروس المنشورة" })).toBeDefined();
    expect(screen.getByText("فضل طلب العلم")).toBeDefined();
    expect(screen.queryByRole("heading", { level: 3, name: "مدخل إلى العلم" })).toBeNull();

    rerender(<PublicOfferingDetail offering={{ ...offering, outline: [] }} backHref="/tracks" />);
    expect(screen.getByText("لا يوجد مخطط منشور لعرضه الآن.")).toBeDefined();
  });
});

function normalizePrice(value: string): string {
  return value.replace(/[\u061c\u200e\u200f]/g, "").replace(/\u00a0/g, " ").trim();
}
