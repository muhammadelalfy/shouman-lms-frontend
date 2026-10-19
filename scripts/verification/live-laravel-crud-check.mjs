import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? "playwright"
);
const base = process.env.PLATFORM_BASE_URL ?? "http://127.0.0.1:3114";
const apiBase = process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8130/api/v1";
const out = process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence";
const fixture = JSON.parse(
  await readFile(
    process.env.LIVE_INTEGRATION_FIXTURE ??
      "/tmp/shouman-live-credentials.json",
    "utf8",
  ),
);
for (const url of [base, apiBase])
  assert(["127.0.0.1", "localhost"].includes(new URL(url).hostname));
assert(fixture.users.admin.email.endsWith("@integration.example.invalid"));
const results = [];
const record = (name) => {
  results.push({ name, ok: true });
  console.log(`PASS ${name}`);
};
async function api(path, { method = "GET", body, status = 200 } = {}) {
  const response = await fetch(apiBase + path, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.equal(response.status, status, `${method} ${path}`);
  return status === 204 ? null : response.json();
}
let token;
const login = await fetch(`${apiBase}/auth/login`, {
  method: "POST",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  body: JSON.stringify({
    email: fixture.users.admin.email,
    password: fixture.password,
    device_name: "isolated-crud",
  }),
});
assert.equal(login.status, 200);
token = (await login.json()).data.token;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE ?? "/opt/google/chrome/chrome",
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 390, height: 900 },
  reducedMotion: "reduce",
});
await context.addCookies([
  { name: "lms_session", value: token, url: base, httpOnly: true },
]);
const page = await context.newPage();
let createdId;
try {
  await page.goto(`${base}/admin/offerings/new`, {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator("input[name=title]")
    .fill("دورة إنشاء وحذف لاختبار التكامل");
  await page.locator("input[name=slug]").fill(`integration-crud-${Date.now()}`);
  await page
    .getByRole("button", { name: "إنشاء المحتوى", exact: true })
    .click();
  await page.waitForURL(/\/admin\/offerings\/\d+$/);
  createdId = Number(new URL(page.url()).pathname.split("/").at(-1));
  let offering = (await api(`/admin/offerings/${createdId}`)).data;
  assert.equal(offering.title, "دورة إنشاء وحذف لاختبار التكامل");
  record("browser creates offering and navigates to returned ID");
  await page.goto(`${base}/admin/offerings/${createdId}/subjects/new`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("input[name=title]").fill("مادة جديدة من المتصفح");
  await page.getByRole("button", { name: "إضافة المادة", exact: true }).click();
  await page.getByRole("status").waitFor();
  offering = (await api(`/admin/offerings/${createdId}`)).data;
  assert.equal(offering.subjects.length, 1);
  const subjectId = offering.subjects[0].id;
  record("browser creates subject under actual offering");
  await page.goto(
    `${base}/admin/offerings/${createdId}/subjects/${subjectId}/lessons/new`,
    { waitUntil: "domcontentloaded" },
  );
  await page.locator("input[name=title]").fill("درس جديد من المتصفح");
  await page.getByRole("button", { name: "إضافة الدرس", exact: true }).click();
  await page.getByRole("status").waitFor();
  offering = (await api(`/admin/offerings/${createdId}`)).data;
  assert.equal(offering.subjects[0].lessons.length, 1);
  const lessonId = offering.subjects[0].lessons[0].id;
  record("browser creates lesson under actual subject");
  await page.goto(
    `${base}/admin/offerings/${createdId}/subjects/${fixture.subjects[0].id}`,
    { waitUntil: "domcontentloaded" },
  );
  await page.getByRole("heading", { name: "لم نعثر على هذه الصفحة" }).waitFor();
  record("cross-offering child route rejects unrelated subject");
  await api(`/admin/offerings/${createdId}/subjects/order`, {
    method: "PUT",
    body: { ids: [] },
    status: 422,
  });
  record("real API rejects incomplete sibling order");
  await page.goto(`${base}/admin/roles`, { waitUntil: "domcontentloaded" });
  const role = page
    .locator("section.xp-card")
    .filter({ has: page.getByRole("heading", { name: "مقيّم", exact: true }) });
  await role.locator('input[name=permissions][value="users.view"]').check();
  await role
    .getByRole("button", { name: "حفظ الصلاحيات", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "حفظ الصلاحيات", exact: true })
    .click();
  await role.getByRole("status").waitFor();
  assert(
    (await api("/admin/roles")).data
      .find((r) => r.name === "evaluator")
      .permissions.includes("users.view"),
  );
  record("browser role-permission edit persists through Laravel");
  await api("/admin/roles/evaluator/permissions", {
    method: "PUT",
    body: { permissions: [] },
  });
  await api(`/admin/lessons/${lessonId}`, { method: "DELETE", status: 204 });
  offering = (await api(`/admin/offerings/${createdId}`)).data;
  assert.equal(offering.subjects[0].lessons.length, 0);
  await api(`/admin/subjects/${subjectId}`, { method: "DELETE", status: 204 });
  offering = (await api(`/admin/offerings/${createdId}`)).data;
  assert.equal(offering.subjects.length, 0);
  record("subject and lesson deletion contracts return 204 and persist");
  await page.goto(`${base}/admin/offerings/${createdId}`, {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator("section.xp-card")
    .first()
    .getByRole("button", { name: "حذف المحتوى", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "حذف المحتوى", exact: true })
    .click();
  await page.waitForURL(`${base}/admin/offerings`);
  await api(`/admin/offerings/${createdId}`, { status: 404 });
  record("browser confirmed offering deletion persists and returns to list");
  await mkdir(out, { recursive: true });
  await writeFile(
    `${out}/live-laravel-crud-results.json`,
    JSON.stringify({ results }, null, 2),
  );
  console.log(
    `Passed ${results.length}/${results.length} CRUD integration checks`,
  );
} catch (error) {
  await mkdir(out, { recursive: true });
  await writeFile(
    `${out}/live-laravel-crud-results.json`,
    JSON.stringify({ results, error: String(error) }, null, 2),
  );
  await page.screenshot({
    path: `${out}/live-crud-failure.png`,
    fullPage: true,
  });
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
