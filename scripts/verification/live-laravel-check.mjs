import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? "playwright"
);
const base = process.env.PLATFORM_BASE_URL ?? "http://127.0.0.1:3114";
const apiBase = process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8130/api/v1";
const fixture = JSON.parse(
  await readFile(
    process.env.LIVE_INTEGRATION_FIXTURE ??
      "/tmp/shouman-live-credentials.json",
    "utf8",
  ),
);
const out = process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence";
for (const url of [base, apiBase])
  assert(
    ["127.0.0.1", "localhost"].includes(new URL(url).hostname),
    "Only disposable local services are supported",
  );
for (const user of Object.values(fixture.users))
  assert(
    user.email.endsWith("@integration.example.invalid"),
    "Synthetic integration users required",
  );
const results = [];
const record = (name) => {
  results.push({ name, ok: true });
  console.log(`PASS ${name}`);
};
async function api(path, { method = "GET", body, token, status = 200 } = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.equal(response.status, status, `${method} ${path} status`);
  return status === 204 ? undefined : response.json();
}
async function login(role) {
  return (
    await api("/auth/login", {
      method: "POST",
      body: {
        email: fixture.users[role].email,
        password: fixture.password,
        device_name: "isolated-integration",
      },
    })
  ).data.token;
}
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE ?? "/opt/google/chrome/chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(String(error)));
const offeringId = fixture.offering_id;
const subjectId = fixture.subjects[0].id;
const lessonId = fixture.subjects[0].lessons[0];
try {
  const ready = await fetch(new URL("/ready", apiBase));
  assert.equal(ready.status, 200);
  record("real readiness: PostgreSQL and Redis");
  const adminToken = await login("admin");
  const originalStart = (
    await api(`/admin/offerings/${offeringId}`, { token: adminToken })
  ).data.starts_at;
  let studentToken = await login("student");
  const managerToken = await login("manager");
  await api("/admin/users", { token: studentToken, status: 403 });
  record("Laravel rejects student admin access");
  await page.goto(`${base}/auth/login?redirectTo=%2Fadmin%2Fofferings`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("input[name=email]").fill(fixture.users.admin.email);
  await page.locator("input[name=password]").fill(fixture.password);
  await page.locator("form button[type=submit]").click();
  await page.waitForURL("**/admin/offerings");
  await page
    .getByRole("heading", { name: "إدارة المحتوى التعليمي", exact: true })
    .waitFor();
  const cookies = await context.cookies();
  assert(cookies.some((c) => c.name === "lms_session" && c.httpOnly));
  assert(!(await page.evaluate(() => document.cookie)).includes("lms_session"));
  record(
    "browser login sets httpOnly session and renders actual offering list",
  );
  await page.goto(`${base}/admin/offerings/${offeringId}/edit`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("input[name=title]").fill("a");
  await page.getByRole("button", { name: "حفظ المحتوى", exact: true }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector("input[name=title]")
        ?.getAttribute("aria-invalid") === "true",
  );
  assert.equal(await page.locator("input[name=title]").inputValue(), "a");
  record("invalid edit retains draft and exposes field error");
  await page.locator("input[name=title]").fill("دورة اختبار محفوظة من المتصفح");
  await page.locator("textarea[name=goals]").fill("هدف أول\nهدف ثان");
  await page.locator("select[name=pricing]").selectOption("paid");
  await page.locator("input[name=price_amount]").fill("12345");
  await page.locator("input[name=discounted_price_amount]").fill("12000");
  await page.getByRole("button", { name: "حفظ المحتوى", exact: true }).click();
  await page.getByRole("status").waitFor();
  let offering = (
    await api(`/admin/offerings/${offeringId}`, { token: adminToken })
  ).data;
  assert.equal(offering.title, "دورة اختبار محفوظة من المتصفح");
  assert.equal(offering.pricing.price_amount, 12345);
  assert.equal(offering.pricing.discounted_price_amount, 12000);
  assert.deepEqual(offering.goals, ["هدف أول", "هدف ثان"]);
  assert.equal(Date.parse(offering.starts_at), Date.parse(originalStart));
  record(
    "browser offering update persists fields, prices and existing timestamp instant",
  );
  await page.locator("input[name=starts_at]").fill("2026-10-20T10:00:00+03:00");
  await page.getByRole("button", { name: "حفظ المحتوى", exact: true }).click();
  await page.getByRole("status").waitFor();
  await page.waitForFunction(
    () => document.querySelector("form[aria-busy=true]") === null,
  );
  offering = (
    await api(`/admin/offerings/${offeringId}`, { token: adminToken })
  ).data;
  const offsetCheck = {
    name: "new explicit timestamp offset preserves instant",
    ok:
      Date.parse(offering.starts_at) ===
      Date.parse("2026-10-20T10:00:00+03:00"),
    submitted: "2026-10-20T10:00:00+03:00",
    received: offering.starts_at,
  };
  results.push(offsetCheck);
  console.log(`${offsetCheck.ok ? "PASS" : "FAIL"} ${offsetCheck.name}`);
  await page.goto(
    `${base}/admin/offerings/${offeringId}/subjects/${subjectId}`,
    { waitUntil: "domcontentloaded" },
  );
  await page.locator("input[name=title]").fill("مادة محفوظة من المتصفح");
  await page.getByRole("button", { name: "حفظ المادة", exact: true }).click();
  await page.getByRole("status").waitFor();
  offering = (
    await api(`/admin/offerings/${offeringId}`, { token: adminToken })
  ).data;
  assert.equal(
    offering.subjects.find((s) => s.id === subjectId).title,
    "مادة محفوظة من المتصفح",
  );
  record("browser subject edit persists in its owning offering");
  await page.goto(
    `${base}/admin/offerings/${offeringId}/subjects/${subjectId}/lessons/${lessonId}`,
    { waitUntil: "domcontentloaded" },
  );
  await page.locator("input[name=title]").fill("درس محفوظ من المتصفح");
  await page
    .locator("textarea[name=key_points]")
    .fill("فائدة أولى\nفائدة ثانية");
  await page.getByRole("button", { name: "حفظ الدرس", exact: true }).click();
  await page.getByRole("status").waitFor();
  offering = (
    await api(`/admin/offerings/${offeringId}`, { token: adminToken })
  ).data;
  assert.deepEqual(
    offering.subjects
      .find((s) => s.id === subjectId)
      .lessons.find((l) => l.id === lessonId).key_points,
    ["فائدة أولى", "فائدة ثانية"],
  );
  record("browser lesson edit persists text and key points");
  await page.goto(`${base}/admin/offerings/${offeringId}`, {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator("input[name=user_ids]")
    .fill(String(fixture.users.instructor.id));
  await page
    .getByRole("button", { name: "حفظ المدرّسين", exact: true })
    .click();
  await page.getByRole("status").waitFor();
  offering = (
    await api(`/admin/offerings/${offeringId}`, { token: adminToken })
  ).data;
  assert.equal(offering.instructors[0].id, fixture.users.instructor.id);
  record("browser instructor assignment persists actual instructor relation");
  const beforeOrder = [...offering.subjects]
    .sort((a, b) => a.position - b.position)
    .map((s) => s.id);
  const order = page
    .locator("details")
    .filter({ has: page.locator("summary", { hasText: "ترتيب المواد" }) })
    .first();
  await order.locator("summary").first().click();
  await order
    .getByRole("button", {
      name: `${beforeOrder[0] === subjectId ? "تأخير" : "تقديم"} مادة محفوظة من المتصفح`,
    })
    .click();
  const saveOrderResponse = page.waitForResponse(
    (r) => r.request().method() === "POST" && r.url().startsWith(base),
  );
  await order.getByRole("button", { name: "حفظ الترتيب", exact: true }).click();
  await saveOrderResponse;
  offering = (
    await api(`/admin/offerings/${offeringId}`, { token: adminToken })
  ).data;
  assert.deepEqual(
    [...offering.subjects]
      .sort((a, b) => a.position - b.position)
      .map((s) => s.id),
    [...beforeOrder].reverse(),
  );
  record("browser full sibling ordering persists");
  let reorderFeedback = true;
  try {
    await order.getByRole("status").waitFor({ timeout: 5000 });
  } catch {
    reorderFeedback = false;
  }
  results.push({
    name: "reorder retains visible saved confirmation",
    ok: reorderFeedback,
  });
  await api(`/admin/offerings/${offeringId}/status`, {
    token: adminToken,
    method: "PUT",
    body: { status: "published" },
    status: 409,
  });
  await api(`/admin/lessons/${lessonId}/status`, {
    token: adminToken,
    method: "PUT",
    body: { status: "published" },
  });
  await api(`/admin/subjects/${subjectId}/status`, {
    token: adminToken,
    method: "PUT",
    body: { status: "published" },
  });
  await api(`/admin/offerings/${offeringId}/status`, {
    token: adminToken,
    method: "PUT",
    body: { status: "published" },
  });
  await api("/catalog/offerings/integration-course");
  record("Laravel publication gates and public catalog visibility");
  await page.goto(`${base}/admin/users/${fixture.users.student.id}`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("select[name=status]").selectOption("disabled");
  await page
    .getByRole("button", { name: "تغيير حالة الحساب", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "تغيير حالة الحساب", exact: true })
    .click();
  await page.getByRole("status").waitFor();
  await api("/me", { token: studentToken, status: 401 });
  record("browser disable revokes actual learner sessions");
  await api(`/admin/users/${fixture.users.student.id}/status`, {
    token: adminToken,
    method: "PUT",
    body: { status: "active" },
  });
  studentToken = await login("student");
  await page.goto(`${base}/admin/users/${fixture.users.student.id}`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("input[name=roles][value=student]").uncheck();
  await page.locator("input[name=roles][value=instructor]").check();
  await page.getByRole("button", { name: "حفظ الأدوار", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "حفظ الأدوار", exact: true })
    .click();
  await page.getByRole("status").waitFor();
  assert.deepEqual(
    (
      await api(`/admin/users/${fixture.users.student.id}`, {
        token: adminToken,
      })
    ).data.roles,
    ["instructor"],
  );
  record("browser role assignment persists");
  await api(`/admin/users/${fixture.users.admin.id}/roles`, {
    token: adminToken,
    method: "PUT",
    body: { roles: ["student"] },
    status: 409,
  });
  record("last-active-administrator safeguard rejects self-demotion");
  await context.addCookies([
    { name: "lms_session", value: managerToken, url: base, httpOnly: true },
  ]);
  await page.goto(`${base}/admin/users/${fixture.users.student.id}`, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(
    await page
      .getByRole("button", { name: "حفظ الأدوار", exact: true })
      .count(),
    0,
  );
  await page.goto(`${base}/admin/roles`, { waitUntil: "domcontentloaded" });
  await page
    .getByRole("heading", { name: "ليس لديك صلاحية لعرض هذه الصفحة" })
    .waitFor();
  record(
    "frontend role controls and forbidden page match actual manager permissions",
  );
  await context.addCookies([
    { name: "lms_session", value: studentToken, url: base, httpOnly: true },
  ]);
  await api("/auth/logout", {
    token: studentToken,
    method: "POST",
    status: 204,
  });
  await page.goto(`${base}/admin/offerings`, { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/auth/login?**");
  record("revoked real session redirects frontend to login");
  assert.deepEqual(pageErrors, []);
  await mkdir(out, { recursive: true });
  await writeFile(
    `${out}/live-laravel-results.json`,
    JSON.stringify(
      { api: "Real Laravel/PostgreSQL/Redis", results, pageErrors },
      null,
      2,
    ),
  );
  console.log(
    `Passed ${results.filter((r) => r.ok).length}/${results.length} live integration checks`,
  );
  if (results.some((r) => !r.ok)) process.exitCode = 1;
} catch (error) {
  await mkdir(out, { recursive: true });
  await writeFile(
    `${out}/live-laravel-results.json`,
    JSON.stringify({ results, error: String(error), pageErrors }, null, 2),
  );
  await page.screenshot({
    path: `${out}/live-laravel-failure.png`,
    fullPage: true,
  });
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
