// Mocked failure UI checks only. Not Laravel authorization/integration evidence.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const base = process.env.PLATFORM_BASE_URL ?? "http://127.0.0.1:3117";
const fixture = process.env.FRONTEND_FIXTURE_URL ?? "http://127.0.0.1:8113";
const out = process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence/search-states";
for (const value of [base, fixture]) assert(["localhost", "127.0.0.1"].includes(new URL(value).hostname), "Loopback only");
assert.notEqual(new URL(base).port, "3115", "Do not target real integration runtime");
assert.notEqual(new URL(base).port, "3116", "Do not target real integration runtime");
const mode = async (name) => {
  const response = await fetch(`${fixture}/api/v1/__fixture?mode=${name}`);
  assert.equal(response.status, 200);
};
const browser = await chromium.launch({ executablePath: process.env.CHROME_EXECUTABLE ?? "/opt/google/chrome/chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: "reduce" });
const page = await context.newPage();
const results = [];
const record = (name) => { results.push({ name, ok: true }); console.log(`PASS MOCKED ${name}`); };
await mkdir(out, { recursive: true });
try {
  const q = "بحث اختبار % &";
  for (const [scenario, text] of [
    ["search-validation", "راجع بيانات البحث والتصفية"],
    ["search-throttled", "طلبات البحث كثيرة الآن. انتظر قليلًا ثم أعد المحاولة."],
    ["search-unavailable", "تعذر الاتصال بالفهرس مؤقتًا. حاول مرة أخرى لاحقًا."],
    ["search-network", "تعذر الاتصال بالفهرس مؤقتًا. حاول مرة أخرى لاحقًا."],
  ]) {
    await mode(scenario);
    await page.goto(`${base}/search?${new URLSearchParams({ q })}`);
    await page.getByText(text, { exact: true }).waitFor();
    const input = page.locator('input[name="q"]');
    assert.equal(await input.inputValue(), q);
    assert.equal(await page.locator(".public-catalog__grid-item").count(), 0);
    assert(!(await page.locator("main").innerText()).includes("fixture"), "No internal fixture error leakage");
    if (scenario === "search-validation") {
      assert.equal(await input.getAttribute("aria-invalid"), "true");
      const description = await input.getAttribute("aria-describedby");
      assert(description);
      assert(await page.locator(`[id="${description}"]`).isVisible());
    } else {
      const retry = page.getByRole("link", { name: "إعادة المحاولة", exact: true });
      assert(await retry.isVisible());
      assert.equal(new URL(await retry.getAttribute("href"), base).searchParams.get("q"), q);
    }
    await page.screenshot({ path: `${out}/${scenario}.png`, fullPage: true });
    record(`${scenario}: retained query, associated/recovery Arabic feedback, no sample fallback`);
    await mode("normal");
    if (scenario === "search-validation") {
      await input.press("Enter");
    } else {
      await page.getByRole("link", { name: "إعادة المحاولة", exact: true }).click();
    }
    await page.locator(".public-catalog__grid-item").first().waitFor();
    assert.equal(await page.locator('input[name="q"]').inputValue(), q);
    assert(await page.getByText("دورة لاختبار الواجهة", { exact: true }).isVisible());
    record(`${scenario}: retry recovers fixture-backed offering`);
  }
  await mode("search-empty");
  await page.goto(`${base}/search?${new URLSearchParams({ q })}`);
  await page.getByRole("heading", { name: "لا توجد نتائج مطابقة لبحثك", exact: true }).waitFor();
  assert.equal(await page.locator('input[name="q"]').inputValue(), q);
  assert.equal(await page.locator(".public-catalog__grid-item").count(), 0);
  await page.screenshot({ path: `${out}/search-no-match.png`, fullPage: true });
  await page.goto(`${base}/search`);
  await page.getByRole("heading", { name: "لا توجد مواد منشورة للعرض الآن", exact: true }).waitFor();
  record("empty catalog and query no-match have distinct truthful states");
  await writeFile(`${out}/search-states-results.json`, JSON.stringify({ source: "Disposable HTTP fixture; mocked dependency failures, not real Laravel security", results }, null, 2));
} catch (error) {
  await page.screenshot({ path: `${out}/search-states-failure.png`, fullPage: true }).catch(() => {});
  await writeFile(`${out}/search-states-results.json`, JSON.stringify({ source: "Mocked fixture only", results, failure: String(error) }, null, 2));
  throw error;
} finally {
  await mode("normal").catch(() => {});
  await browser.close();
}
