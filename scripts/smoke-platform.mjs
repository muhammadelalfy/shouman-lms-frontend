const base = process.env.PLATFORM_BASE_URL ?? "http://127.0.0.1:3111";
const results = [];
for (const path of [
  "/admin",
  "/admin/dashboard",
  "/dashboard",
  "/my-learning",
  "/learning",
  "/admin/users",
  "/admin/users/42",
  "/admin/roles",
  "/admin/offerings",
  "/admin/offerings/new",
  "/admin/offerings/4/subjects/5/lessons/new",
]) {
  const response = await fetch(new URL(path, base), { redirect: "manual" });
  const location = response.headers.get("location");
  const html = await response.text();
  const streamedRedirect =
    response.status === 200 &&
    /<meta[^>]+id="__next-page-redirect"[^>]+content="[^"]*url=\/auth\/login\?/.test(
      html,
    );
  results.push({
    path,
    status: response.status,
    streamedRedirect,
    ok:
      streamedRedirect ||
      ([303, 307].includes(response.status) &&
        location?.startsWith("/auth/login?")),
  });
}
for (const path of [
  "/admin/users/demo-user",
  "/admin/users/new",
  "/admin/offerings/0",
  "/admin/subjects/99",
]) {
  const response = await fetch(new URL(path, base));
  const html = await response.text();
  results.push({
    path,
    status: response.status,
    ok: response.status === 404 || html.includes("لم نعثر على هذه الصفحة"),
  });
}
console.log(
  JSON.stringify(
    {
      base,
      passed: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok),
    },
    null,
    2,
  ),
);
if (results.some((r) => !r.ok)) process.exitCode = 1;
