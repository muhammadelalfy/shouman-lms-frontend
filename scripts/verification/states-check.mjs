import { writeFile, mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? "playwright"
);
const base = process.env.PLATFORM_BASE_URL ?? "http://127.0.0.1:3113";
const fixture = process.env.FRONTEND_FIXTURE_URL ?? "http://127.0.0.1:8112";
const out = process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE ?? "/opt/google/chrome/chrome",
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 390, height: 900 },
});
await context.addCookies([
  { name: "lms_session", value: "browser-test", url: base, httpOnly: true },
]);
const page = await context.newPage();
const results = [];
try {
  for (const [mode, heading] of [
    ["empty", "لا يوجد مستخدمون للعرض"],
    ["failure", "تعذر تحميل السجل"],
  ]) {
    await fetch(`${fixture}/api/v1/__fixture?mode=${mode}`);
    await page.goto(`${base}/admin/users`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: heading, exact: true }).waitFor();
    if (await page.getByRole("table").count())
      throw new Error("Failure/empty state showed records");
    results.push({ mode, ok: true });
  }
  await fetch(`${fixture}/api/v1/__fixture?mode=normal`);
  await page.goto(`${base}/catalog/missing`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "لم نعثر على هذه الصفحة" }).waitFor();
  results.push({ mode: "missing-public-resource", ok: true });
  await mkdir(out, { recursive: true });
  await writeFile(
    `${out}/states-results.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await fetch(`${fixture}/api/v1/__fixture?mode=normal`);
  await browser.close();
}
