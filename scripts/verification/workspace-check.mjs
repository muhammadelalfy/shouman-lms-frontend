import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? "playwright"
);
const base = process.env.PLATFORM_BASE_URL ?? "http://localhost:3118";
assert(
  ["localhost", "127.0.0.1"].includes(new URL(base).hostname),
  "Local stack only",
);
assert(
  process.env.WORKSPACE_ACCOUNTS,
  "WORKSPACE_ACCOUNTS must reference a private local JSON file",
);
const accounts = JSON.parse(
  await readFile(process.env.WORKSPACE_ACCOUNTS, "utf8"),
);
for (const role of ["admin", "student"])
  assert(accounts[role].email.endsWith("@integration.example.invalid"));
const out =
  process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence/workspaces";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE ?? "/opt/google/chrome/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const results = [];
const record = (name) => {
  results.push({ name, ok: true });
  console.log(`PASS ${name}`);
};
const runtimeErrors = [];
async function context() {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  c.on("page", (page) =>
    page.on("pageerror", (e) => runtimeErrors.push(String(e))),
  );
  return c;
}
async function signIn(c, role, path) {
  const page = await c.newPage();
  await page.goto(`${base}/auth/login?redirectTo=${encodeURIComponent(path)}`);
  await page
    .getByLabel("البريد الإلكتروني", { exact: true })
    .fill(accounts[role].email);
  await page
    .getByLabel("كلمة المرور", { exact: true })
    .fill(accounts[role].password);
  await page.getByRole("button", { name: "تسجيل الدخول", exact: true }).click();
  await page.waitForURL((url) => url.pathname === path);
  await page.locator("#platform-main h1").waitFor();
  const cookie = (await c.cookies()).find((x) => x.name === "lms_session");
  assert(cookie?.httpOnly && cookie?.secure);
  return page;
}
try {
  const guest = await context();
  const gp = await guest.newPage();
  for (const path of [
    "/admin",
    "/admin/dashboard",
    "/dashboard",
    "/my-learning",
    "/learning",
  ]) {
    await gp.goto(base + path);
    await gp.waitForURL((url) => url.pathname === "/auth/login");
    assert(new URL(gp.url()).searchParams.get("redirectTo"));
  }
  record("all live workspace entry points require sign-in");
  for (const path of [
    "/preview/dashboard",
    "/preview/my-learning",
    "/preview/admin/dashboard",
  ]) {
    await gp.goto(base + path);
    await gp.locator("#platform-main h1").waitFor();
    assert(new URL(gp.url()).pathname === path);
    assert(
      await gp
        .locator("#platform-main")
        .innerText()
        .then((x) => /معاينة|تجريب/.test(x)),
    );
  }
  for (const path of ["/preview/dashboard", "/preview/my-learning"]) {
    await gp.goto(base + path);
    await gp.locator("#platform-main h1").waitFor();
    assert.equal(
      await gp.locator(`a[href="${path}"][aria-current="page"]`).count(),
      2,
    );
  }
  record("all three explicit design previews remain accessible to guests");
  await guest.close();
  const student = await context();
  const sp = await signIn(student, "student", "/dashboard");
  assert.equal(
    await sp.getByRole("heading", { name: "لوحتي", exact: true }).count(),
    1,
  );
  assert.equal(
    await sp.getByRole("link", { name: /افتح لوحة الإدارة/ }).count(),
    0,
  );
  assert(
    (await sp.locator(".workspace-account").innerText()).includes(
      accounts.student.email,
    ),
  );
  record(
    "student UI login uses secure httpOnly cookie and actual account context",
  );
  await sp.goto(base + "/my-learning");
  await sp
    .getByRole("heading", { name: "مساحتك التعليمية قيد التجهيز" })
    .waitFor();
  assert.equal(await sp.locator('a[href="/preview/my-learning"]').count(), 2);
  record(
    "learning page discloses unavailable saved progress and links explicit preview",
  );
  await sp.goto(base + "/admin/dashboard");
  await sp.getByRole("heading", { name: "ليست لديك صلاحية الوصول" }).waitFor();
  assert.equal(await sp.locator('a[href="/admin/users"]').count(), 0);
  record("student cannot see administration tools or private record summaries");
  const admin = await context();
  const ap = await signIn(admin, "admin", "/admin/dashboard");
  await ap
    .getByRole("heading", { name: "لوحة الإدارة", exact: true })
    .waitFor();
  assert.equal(await ap.locator(".workspace-record-panel").count(), 2);
  assert(
    (await ap
      .locator(".workspace-record-panel")
      .first()
      .locator("li")
      .count()) > 0 ||
      (await ap.getByText("لم يُضف محتوى تعليمي بعد.").count()) === 1,
  );
  assert(
    (await ap.locator(".workspace-record-panel").last().locator("li").count()) >
      0,
  );
  record(
    "admin UI login shows authorized user summaries and real content availability",
  );
  await ap.goto(base + "/admin");
  await ap
    .getByRole("heading", { name: "لوحة الإدارة", exact: true })
    .waitFor();
  await ap.getByRole("link", { name: "أدر المستخدمين" }).click();
  await ap.waitForURL((url) => url.pathname === "/admin/users");
  await ap
    .getByRole("heading", { name: "إدارة المستخدمين", exact: true })
    .waitFor();
  assert.equal(
    await ap.locator('a[href="/admin/users"][aria-current="page"]').count(),
    1,
  );
  record(
    "admin root opens live dashboard and list navigation retains active section",
  );
  for (const [page, path, label] of [
    [ap, "/admin/dashboard", "admin"],
    [sp, "/dashboard", "learner"],
    [sp, "/my-learning", "learning"],
    [ap, "/admin/users", "users"],
  ]) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base + path);
      await page.locator("#platform-main h1").waitFor();
      assert.equal(await page.locator("h1").count(), 1);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${label} overflow at ${width}`,
      );
      assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
      await page.screenshot({
        path: `${out}/${label}-${width}.png`,
        fullPage: true,
      });
      record(`${label} RTL layout and no viewport overflow at ${width}px`);
    }
  }
  await sp.setViewportSize({ width: 390, height: 844 });
  await sp.goto(base + "/dashboard", {waitUntil:"networkidle"});
  await sp.getByRole("button", { name: /القائمة/ }).click();
  await sp
    .getByRole("navigation", { name: "قائمة التنقل للجوال" })
    .getByRole("link", { name: "لوحتي", exact: true })
    .waitFor();
  await sp.keyboard.press("Escape");
  assert.equal(
    await sp
      .getByRole("button", { name: /القائمة/ })
      .getAttribute("aria-expanded"),
    "false",
  );
  record(
    "signed-in mobile menu exposes live workspace and Escape dismisses it",
  );
  await ap.setViewportSize({ width: 720, height: 500 });
  await ap.goto(base + "/admin/dashboard");
  assert(
    await ap.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
  await ap.keyboard.press("Tab");
  assert.equal(await ap.evaluate(() => document.activeElement?.tagName), "A");
  record("compact zoom-equivalent viewport and keyboard entry remain usable");
  const expired = await context();
  await expired.addCookies([
    {
      name: "lms_session",
      value: "invalid-verification-token",
      url: base,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    },
  ]);
  const ep = await expired.newPage();
  await ep.goto(base + "/dashboard");
  await ep.waitForURL(
    (url) =>
      url.pathname === "/auth/login" && url.searchParams.get("expired") === "1",
  );
  record(
    "invalid/revoked session redirects to sign-in without sample fallback",
  );
  await expired.close();
  assert.deepEqual(runtimeErrors, []);
  record("no browser runtime errors");
  for (const c of [student, admin]) {
    const page = await c.newPage();
    await page.goto(base + "/dashboard");
    await page
      .getByRole("button", { name: "تسجيل الخروج", exact: true })
      .click();
    await page.waitForURL((url) => url.pathname === "/");
    await c.close();
  }
  record("verification sessions signed out without changing account data");
} catch (error) {
  results.push({ name: String(error), ok: false });
  throw error;
} finally {
  await writeFile(
    `${out}/workspace-results.json`,
    JSON.stringify(
      {
        environment:
          "real Docker Next/Laravel/PostgreSQL/Redis; no fixture resets or account edits",
        results,
      },
      null,
      2,
    ),
  );
  await browser.close();
}
