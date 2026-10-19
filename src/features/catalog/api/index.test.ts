import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCatalogOffering, listCatalogOfferings } from ".";

describe("catalog api", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", "http://api.test/api/v1");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  it("maps filters to the API query string", async () => {
    fetchMock.mockResolvedValue(Response.json({ data: [], links: {}, meta: {} }));

    await listCatalogOfferings({ kind: "track", featured: true, cursor: "abc" });

    expect(fetchMock.mock.calls[0]![0]).toBe("http://api.test/api/v1/catalog/offerings?kind=track&featured=1&cursor=abc");
  });

  it("serializes literal Arabic search and false featured with supported filters", async () => {
    fetchMock.mockResolvedValue(Response.json({ data: [], links: {}, meta: {} }));
    await listCatalogOfferings({ q: "علم % &", featured: false, perPage: 5 });
    const url = new URL(String(fetchMock.mock.calls[0]![0]));
    expect(url.searchParams.get("q")).toBe("علم % &");
    expect(url.searchParams.get("featured")).toBe("0");
    expect(url.searchParams.get("per_page")).toBe("5");
  });

  it("encodes Arabic slugs in the detail URL", async () => {
    fetchMock.mockResolvedValue(Response.json({ data: { slug: "سنة-أولى-علم" } }));

    await getCatalogOffering("سنة-أولى-علم");

    expect(fetchMock.mock.calls[0]![0]).toBe(
      `http://api.test/api/v1/catalog/offerings/${encodeURIComponent("سنة-أولى-علم")}`,
    );
  });

  it("returns null for an offering that is not visible", async () => {
    fetchMock.mockResolvedValue(Response.json({ message: "Not Found" }, { status: 404 }));

    await expect(getCatalogOffering("hidden")).resolves.toBeNull();
  });

  it("rethrows other failures", async () => {
    fetchMock.mockResolvedValue(Response.json({ message: "Server Error" }, { status: 500 }));

    await expect(getCatalogOffering("x")).rejects.toMatchObject({ status: 500 });
  });
});
