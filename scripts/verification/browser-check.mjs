const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? "playwright"
);
const base = process.env.PLATFORM_BASE_URL ?? "http://127.0.0.1:3112";
import { mkdir, writeFile } from "node:fs/promises";
const out = process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE ?? "/opt/google/chrome/chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({ reducedMotion: "reduce" });
await context.addCookies([
  { name: "lms_session", value: "browser-test", url: base, httpOnly: true },
]);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const results = [];
const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};
const routes = [
  "/",
  "/catalog",
  "/catalog/test-course",
  "/auth/login",
  "/account",
  "/dashboard",
  "/my-learning",
  "/learning/lessons/demo-lesson",
  "/quizzes/demo-quiz",
  "/certificates",
  "/projects",
  "/notifications",
  "/instructor",
  "/supervisor",
  "/evaluator",
  "/community",
  "/events",
  "/faq",
  "/contact",
  "/preview/admin/dashboard",
  "/admin/users",
  "/admin/users/42",
  "/admin/roles",
  "/admin/offerings",
  "/admin/offerings/new",
  "/admin/offerings/4",
  "/admin/offerings/4/edit",
  "/admin/offerings/4/subjects/5",
  "/admin/offerings/4/subjects/5/lessons/3",
];
try {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "domcontentloaded" });
      await page.locator("h1").first().waitFor();
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      const state = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("h1").length,
        text: document.querySelector("h1")?.textContent,
      }));
      results.push({
        width,
        route,
        ...state,
        ok: state.scroll <= width + 1 && state.h1 === 1,
      });
      if (
        (route === "/admin/offerings/4" ||
          route === "/dashboard" ||
          route === "/") &&
        [390, 1440].includes(width)
      )
        await page.screenshot({
          path: `${out}/${route === "/" ? "home" : route === "/dashboard" ? "learner" : "admin"}-${width}.png`,
          fullPage: true,
        });
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${base}/dashboard`, {
    waitUntil: "domcontentloaded",
  });
  const menu = page.getByRole("button", { name: "فتح قائمة المساحة" });
  await menu.click();
  await page.keyboard.press("Escape");
  expect(
    (await menu.getAttribute("aria-expanded")) === "false",
    "mobile menu did not close",
  );
  expect(
    await menu.evaluate((el) => document.activeElement === el),
    "menu focus not restored",
  );
  await page.goto(`${base}/admin/offerings/4/edit`, {
    waitUntil: "domcontentloaded",
  });
  const title = page.locator("input[name=title]");
  await title.fill("رفض من الخادم");
  await page.getByRole("button", { name: "حفظ المحتوى", exact: true }).click();
  await page.getByRole("alert").waitFor();
  expect(
    (await title.inputValue()) === "رفض من الخادم",
    "draft lost after rejected save",
  );
  await page.waitForFunction(
    () =>
      document
        .querySelector("input[name=title]")
        ?.getAttribute("aria-invalid") === "true",
  );
  await title.fill("عنوان معدل لاختبار المتصفح");
  await page.getByRole("button", { name: "حفظ المحتوى", exact: true }).click();
  await page.getByRole("status").waitFor();
  await page.goto(`${base}/admin/users/42`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("select[name=status]").selectOption("disabled");
  await page
    .getByRole("button", { name: "تغيير حالة الحساب", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  expect(
    await dialog
      .getByRole("button", { name: "إلغاء" })
      .evaluate((el) => document.activeElement === el),
    "dialog initial focus",
  );
  await page.keyboard.press("Tab");
  expect(
    await dialog
      .getByRole("button", { name: "تغيير حالة الحساب", exact: true })
      .evaluate((el) => document.activeElement === el),
    "dialog keyboard order",
  );
  await page.keyboard.press("Escape");
  expect((await dialog.count()) === 0, "Escape did not close dialog");
  await page
    .getByRole("button", { name: "تغيير حالة الحساب", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "تغيير حالة الحساب", exact: true })
    .click();
  await page.getByRole("status").waitFor();
  await context.addCookies([
    { name: "lms_session", value: "forbidden", url: base, httpOnly: true },
  ]);
  await page.goto(`${base}/admin/users`, {
    waitUntil: "domcontentloaded",
  });
  expect(
    (await page
      .getByRole("heading", { name: "ليس لديك صلاحية لعرض هذه الصفحة" })
      .count()) === 1,
    "forbidden not rendered",
  );
  await context.addCookies([
    { name: "lms_session", value: "expired", url: base, httpOnly: true },
  ]);
  await page.goto(`${base}/admin/users`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForURL("**/auth/login?**");
  expect(page.url().includes("/auth/login"), "expired session not redirected");
  const summary = {
    browser: await browser.version(),
    api: "Disposable HTTP fixture, not live Laravel",
    matrix: results.length,
    failed: results.filter((r) => !r.ok),
    pageErrors: errors,
    interactions: "passed",
  };
  await writeFile(
    out + "/browser-results.json",
    JSON.stringify({ summary, results }, null, 2),
  );
  console.log(JSON.stringify(summary, null, 2));
  if (summary.failed.length || errors.length) process.exitCode = 1;
} catch (error) {
  await writeFile(
    out + "/browser-results.json",
    JSON.stringify({ error: String(error), results, errors }, null, 2),
  );
  await page.screenshot({ path: out + "/browser-failure.png", fullPage: true });
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
