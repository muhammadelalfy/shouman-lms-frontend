import type { CatalogFilters, OfferingKind, PricingModel } from "./types";

/** Unicode White_Space, deliberately excluding U+FEFF (unlike String.trim). */
export function normalizeCatalogQuery(value: string): string {
  return value.replace(/^\p{White_Space}+|\p{White_Space}+$/gu, "");
}

export function catalogQueryError(value: string): string | undefined {
  return Array.from(normalizeCatalogQuery(value)).length > 120
    ? "استخدم ١٢٠ حرفًا أو أقل للبحث."
    : undefined;
}

export const catalogQueryFields = ["q", "kind", "pricing", "featured", "per_page", "cursor"] as const;
export type CatalogQueryValues = Partial<Record<typeof catalogQueryFields[number], string>>;

export function catalogQueryValues(query: Record<string, string | string[] | undefined>): CatalogQueryValues {
  return Object.fromEntries(catalogQueryFields.flatMap((key) => {
    const value = Array.isArray(query[key]) ? query[key][0] : query[key];
    return value === undefined ? [] : [[key, key === "q" ? normalizeCatalogQuery(value) : value]];
  }));
}

/** Rebuild only same-origin links; opaque API cursor URLs are never followed. */
export function catalogListingHref(basePath: string, values: CatalogQueryValues): string {
  const query = new URLSearchParams();
  for (const key of catalogQueryFields) {
    const value = values[key];
    if (value !== undefined && value !== "") query.set(key, value);
  }
  return query.size ? `${basePath}?${query}` : basePath;
}

export function parseCatalogQuery(query: Record<string, string | string[] | undefined>, fixedKind?: OfferingKind) {
  const values = catalogQueryValues(query);
  const fieldErrors: Record<string, string> = {};
  const kinds = ["track", "initiative", "intensive_program", "seasonal_program", "course"];
  if (values.kind && (!kinds.includes(values.kind) || (fixedKind && values.kind !== fixedKind))) fieldErrors.kind = "اختر نوع محتوى صالحًا لهذه الصفحة.";
  if (values.pricing && !["free", "paid"].includes(values.pricing)) fieldErrors.pricing = "اختر نوع سعر صالحًا.";
  if (values.featured && !["0", "1"].includes(values.featured)) fieldErrors.featured = "قيمة المحتوى المميز غير صالحة؛ استخدم ٠ أو ١.";
  if (values.per_page && (!/^\d+$/.test(values.per_page) || Number(values.per_page) < 1 || Number(values.per_page) > 50)) fieldErrors.per_page = "عدد النتائج يجب أن يكون من ١ إلى ٥٠.";
  const filters: CatalogFilters = {
    q: values.q || undefined,
    kind: fixedKind ?? (values.kind && !fieldErrors.kind ? values.kind as OfferingKind : undefined),
    pricing: values.pricing && !fieldErrors.pricing ? values.pricing as PricingModel : undefined,
    featured: values.featured && !fieldErrors.featured ? values.featured === "1" : undefined,
    perPage: values.per_page && !fieldErrors.per_page ? Number(values.per_page) : undefined,
    cursor: values.cursor || null,
  };
  return { values, filters, fieldErrors, queryError: catalogQueryError(values.q ?? "") };
}
