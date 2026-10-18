import "server-only";
import { apiRequest } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import type { ApiResource, CursorPaginated } from "@/lib/api/types";
import type { CatalogFilters, CatalogOffering, CatalogOfferingDetail } from "../types";

/** Public listing of visible offerings (guests allowed). */
export async function listCatalogOfferings(filters: CatalogFilters = {}): Promise<CursorPaginated<CatalogOffering>> {
  return apiRequest<CursorPaginated<CatalogOffering>>("/catalog/offerings", {
    query: {
      kind: filters.kind,
      pricing: filters.pricing,
      featured: filters.featured ? 1 : undefined,
      per_page: filters.perPage,
      cursor: filters.cursor,
    },
  });
}

/**
 * Public offering page. Returns null when the offering does not exist or is
 * not publicly visible, so the page can call notFound().
 */
export async function getCatalogOffering(slug: string): Promise<CatalogOfferingDetail | null> {
  try {
    const response = await apiRequest<ApiResource<CatalogOfferingDetail>>(`/catalog/offerings/${encodeURIComponent(slug)}`);

    return response.data;
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }

    throw error;
  }
}
