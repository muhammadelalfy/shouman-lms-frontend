import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const base = process.env.PLATFORM_BASE_URL ?? "http://127.0.0.1:3114";
const apiBase = process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8130/api/v1";
const scope = process.env.SEARCH_SCOPE ?? "wide";
assert(["title", "wide"].includes(scope), "SEARCH_SCOPE must be title or wide");
for (const address of [base, apiBase]) {
  assert(["127.0.0.1", "localhost"].includes(new URL(address).hostname), "Loopback only");
}
const fixture = JSON.parse(await readFile(process.env.SEARCH_INTEGRATION_FIXTURE ?? "/tmp/shouman-search-credentials.json", "utf8"));
assert(fixture.users.admin.email.endsWith("@integration.example.invalid"));
const out = process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence/search";
await mkdir(out, { recursive: true });
const results = [];
const record = (name) => { results.push({ name, ok: true }); console.log(`PASS ${name}`); };
async function api(path, { status = 200, method = "GET", body, token } = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    method, headers: { Accept: "application/json", "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.equal(response.status, status, `${method} ${path.split("?")[0]} status`);
  return status === 204 ? null : response.json();
}
const query = (values) => `/catalog/offerings?${new URLSearchParams(values)}`;
const ids = (response) => response.data.map((item) => item.id);
const expectedKeys = ["page1", "page2", "page3", "page4", "page5", "page6", "page7", "latin", "literal", "paid", "track", "ordinary", ...(scope === "wide" ? ["summary", "description"] : [])];
const expected = expectedKeys.map((key) => fixture.rows[key].id).sort((a, b) => b - a);
const browser = await chromium.launch({ executablePath: process.env.CHROME_EXECUTABLE ?? "/opt/google/chrome/chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
const searchUrl = (values) => `${base}/search?${new URLSearchParams(values)}`;
const cards = () => page.locator(".public-catalog__grid-item");
try {
  const response = await api(query({ q: fixture.prefix, per_page: "50" }));
  assert.deepEqual(ids(response), expected);
  const publicKeys = ["id", "kind", "title", "slug", "summary", "is_featured", "season_name", "estimated_duration_minutes", "starts_at", "ends_at", "pricing", "lesson_count"];
  for (const row of response.data) assert.deepEqual(Object.keys(row).sort(), publicKeys.toSorted());
  for (const key of ["draft", "hidden", "future", "expired"]) await api(`/catalog/offerings/${fixture.rows[key].slug}`, { status: 404 });
  record(`real Laravel ${scope} matching, visibility and exact public resource fields`);
  for (const [text, expectedIds] of [[`${fixture.prefix} mixed`, [fixture.rows.latin.id]], [`${fixture.prefix} %_\\ & +`, [fixture.rows.literal.id]]]) {
    assert.deepEqual(ids(await api(query({ q: text }))), expectedIds);
  }
  assert.deepEqual(ids(await api(query({ q: `\u00a0${fixture.prefix}\u00a0`, per_page: "50" }))), expected);
  await api(query({ q: "😀".repeat(121) }), { status: 422 });
  await api(query({ q: "😀".repeat(120) }));
  await api("/catalog/offerings?q[]=invalid", { status: 422 });
  record("literal wildcard/encoding, case and Unicode validation through real API");
  const seen = [];
  let cursor;
  let pages = 0;
  do {
    const chunk = await api(query({ q: fixture.prefix, kind: "course", pricing: "free", featured: "1", per_page: "2", ...(cursor ? { cursor } : {}) }));
    seen.push(...ids(chunk));
    cursor = chunk.meta.next_cursor;
    pages++;
    assert(pages < 30, "Cursor must terminate");
  } while (cursor);
  const filtered = expectedKeys.filter((key) => !["paid", "track", "ordinary"].includes(key)).map((key) => fixture.rows[key].id).sort((a, b) => b - a);
  assert.deepEqual(seen, filtered);
  assert(pages >= 3);
  record("real API AND filters and duplicate-free descending cursor pages");
  await page.goto(searchUrl({ q: fixture.prefix, kind: "course", pricing: "free", featured: "1", per_page: "2" }));
  assert.equal(await page.locator('input[name="q"]').inputValue(), fixture.prefix);
  assert.equal(await cards().count(), 2);
  const pagination = page.locator('a[href*="cursor="]');
  assert(await pagination.count() > 0);
  const nextHref = await pagination.first().getAttribute("href");
  const nextParams = new URL(nextHref, base).searchParams;
  for (const [key, value] of Object.entries({ q: fixture.prefix, kind: "course", pricing: "free", featured: "1", per_page: "2" })) assert.equal(nextParams.get(key), value);
  await Promise.all([page.waitForURL((url) => url.searchParams.has("cursor")), pagination.first().click()]);
  assert(new URL(page.url()).searchParams.has("cursor"));
  const input = page.locator('input[name="q"]');
  await input.fill(`${fixture.prefix} %_\\ & +`);
  await input.press("Enter");
  await page.waitForURL((url) => url.searchParams.get("q") === `${fixture.prefix} %_\\ & +` && !url.searchParams.has("cursor"));
  assert.equal(await cards().count(), 1);
  await page.reload();
  assert.equal(await page.locator('input[name="q"]').inputValue(), `${fixture.prefix} %_\\ & +`);
  await page.goBack();
  await page.goForward();
  assert.equal(await page.locator('input[name="q"]').inputValue(), `${fixture.prefix} %_\\ & +`);
  const detail = cards().first().locator('a[href]').first();
  assert((await detail.getAttribute("href")).includes(fixture.rows.literal.slug));
  await Promise.all([page.waitForURL((url) => url.pathname.includes(fixture.rows.literal.slug)), detail.click()]);
  assert((await page.locator("h1").innerText()).includes(fixture.prefix));
  record("browser keyboard submit, filter retention, cursor reset, encoding, history/reload and actual detail");
  await page.goto(`${base}/catalog/search?${new URLSearchParams({ q: fixture.prefix, pricing: "free" })}`);
  await page.waitForURL((url) => url.pathname === "/search");
  assert.equal(new URL(page.url()).pathname, "/search");
  assert.equal(new URL(page.url()).searchParams.get("q"), fixture.prefix);
  record("search alias redirects before slug matching and preserves query");
  if (scope === "wide") {
    await page.goto(searchUrl({ q: "\u00a0 ", pricing: "free", cursor: nextParams.get("cursor") }));
    await page.waitForURL((url) => !url.searchParams.has("q") && !url.searchParams.has("cursor"));
    assert.equal(new URL(page.url()).searchParams.get("pricing"), "free");
    record("whitespace query canonicalization preserves filters and drops stale cursor");
    const retained = { kind: "course", pricing: "free", featured: "1", per_page: "2" };
    for (const empty of ["", "\u00a0 "]) {
      await page.goto(`${base}/catalog/search?${new URLSearchParams({ ...retained, q: empty, cursor: nextParams.get("cursor") })}`);
      await page.waitForURL((url) => url.pathname === "/search" && !url.searchParams.has("q") && !url.searchParams.has("cursor"));
      assert.deepEqual(Object.fromEntries(new URL(page.url()).searchParams), retained);
    }
    record("alias empty/whitespace query drops q/cursor and preserves complete filters");
    await page.goto(`${base}/catalog/search?${new URLSearchParams({ ...retained, cursor: nextParams.get("cursor") })}`);
    await page.waitForURL((url) => url.pathname === "/search");
    assert.deepEqual(Object.fromEntries(new URL(page.url()).searchParams), { ...retained, cursor: nextParams.get("cursor") });
    record("alias with absent query preserves valid cursor and complete filters");

  }

  await page.goto(searchUrl({ q: fixture.prefix, kind: "course", pricing: "free", featured: "1", per_page: "2" }));
  const clearSearchHref = await page.locator("main a[href]").evaluateAll((nodes) => {
    const match = nodes.find((node) => {
      const url = new URL(node.href);
      return url.pathname === "/search" && !url.searchParams.has("q") && !url.searchParams.has("cursor") && url.searchParams.get("pricing") === "free";
    });
    return match?.href;
  });
  assert(clearSearchHref, "Clear search link preserves filters");
  const clearParams = new URL(clearSearchHref).searchParams;
  for (const [key, value] of Object.entries({ kind: "course", pricing: "free", featured: "1", per_page: "2" })) assert.equal(clearParams.get(key), value);
  await page.goto(clearSearchHref);
  assert.equal(await page.locator('input[name="q"]').inputValue(), "");
  const clearAllHref = await page.locator("main a[href]").evaluateAll((nodes) => nodes.map((node) => new URL(node.href)).find((url) => url.pathname === "/search" && !url.search)?.href);
  assert(clearAllHref, "Clear all link removes query and filters");
  await page.goto(clearAllHref);
  assert.equal(new URL(page.url()).search, "");
  record("clear-search retains complete filter tuple; clear-all removes query state");

  await page.goto(searchUrl({ q: `${fixture.prefix} absent` }));
  await page.locator(".public-catalog__empty").waitFor();
  assert.equal(await cards().count(), 0);
  assert(await page.locator(".public-catalog__empty").isVisible());
  record("real no-match state without fixture cards");
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(searchUrl({ q: fixture.prefix }));
    assert.equal(await page.locator("html").getAttribute("lang"), "ar");
    assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `overflow at ${width}`);
    const field = page.locator('input[name="q"]');
    assert(await field.evaluate((node) => node.labels.length > 0));
    await field.focus();
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => document.activeElement !== document.body));
    assert(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches));
    await page.screenshot({ path: `${out}/search-${width}.png`, fullPage: true });
    record(`RTL/overflow/label/keyboard and reduced-motion preference at ${width}px`);
  }
  // A deterministic visibility interleaving, not a snapshot-pagination guarantee.
  const login = await api("/auth/login", { method: "POST", body: { email: fixture.users.admin.email, password: fixture.password, device_name: "isolated-search" } });
  const first = await api(query({ q: fixture.prefix, per_page: "2" }));
  const target = fixture.rows.page1;
  assert(!ids(first).includes(target.id));
  await api(`/admin/offerings/${target.id}/status`, { method: "PUT", token: login.data.token, body: { status: "hidden" } });
  const after = await api(query({ q: fixture.prefix, per_page: "50", cursor: first.meta.next_cursor }));
  assert(!ids(after).includes(target.id));
  await api(`/catalog/offerings/${target.slug}`, { status: 404 });
  record("visibility change between cursor requests never exposes newly hidden offering");
  assert.deepEqual(errors, []);
  await writeFile(`${out}/live-catalog-search-results.json`, JSON.stringify({ api: "Real Laravel/PostgreSQL/Redis", scope, results, limitations: ["No injected failure checks in this real API harness", "200% zoom, visual focus contrast and motion inspection require separate review", "Original17+8 regression matrices require independent fresh fixtures"] }, null, 2));
} catch (error) {
  await page.screenshot({ path: `${out}/live-catalog-search-failure.png`, fullPage: true }).catch(() => {});
  await writeFile(`${out}/live-catalog-search-results.json`, JSON.stringify({ scope, results, failure: String(error) }, null, 2));
  throw error;
} finally {
  await context.close();
  await browser.close();
}
