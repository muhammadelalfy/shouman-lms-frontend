import { readFileSync } from "node:fs";

const base = process.env.E5_BASE_URL ?? "http://127.0.0.1:3111";
const registry = readFileSync(new URL("../src/features/experience/route-registry.ts", import.meta.url), "utf8");
const exampleBlock = registry.match(/export const experienceRoutes:[\s\S]*?= \[([\s\S]*?)\];/)?.[1];

if (!exampleBlock) throw new Error("Could not read the E5 route examples");

const examples = [...exampleBlock.matchAll(/\{ href: "([^"]+)"/g)].map((match) => match[1]);
const aliases = [
  "/admin",
  "/admin/tracks",
  "/admin/students",
  "/learning",
  "/learn/track/demo-lesson",
  "/catalog/search",
  "/community/demo-group",
  "/certificates/verify/demo-certificate",
];
const missing = [
  "/admin/dashboard/anything",
  "/admin/roles/anything",
  "/admin/analytics/anything",
  "/admin/notifications/foo/questions",
  "/learn/unknown/demo-lesson",
  "/quizzes/demo-quiz/unknown",
];

async function inspect(path, expectedStatus) {
  try {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
    const html = await response.text();
    const preview = expectedStatus === 200;
    const banner = html.includes("معاينة الواجهة") && html.includes("بيانات تجريبية");
    const heading = /<h1(?:\s|>)/i.test(html);
    const noindex = /<meta name="robots" content="noindex/i.test(html);
    const streamedNotFound = !preview && response.status === 200 &&
      html.includes("لم نعثر على هذه الصفحة") && noindex;
    const ok = preview
      ? response.status === 200 && banner && heading && noindex
      : response.status === 404 || streamedNotFound;
    return { path, status: response.status, expectedStatus, banner, heading, noindex, streamedNotFound, ok };
  } catch (error) {
    return { path, expectedStatus, error: String(error), ok: false };
  }
}

const cases = [...new Set(examples.concat(aliases))].map((path) => [path, 200]);
cases.push(...missing.map((path) => [path, 404]));
const results = [];

for (let index = 0; index < cases.length; index += 4) {
  results.push(...await Promise.all(cases.slice(index, index + 4).map(([path, status]) => inspect(path, status))));
}

const failed = results.filter((result) => !result.ok);
console.log(JSON.stringify({
  base,
  exampleRoutes: examples.length,
  aliases: aliases.length,
  rejectedRoutes: missing.length,
  streamedNotFound: results.filter((result) => result.streamedNotFound).length,
  passed: results.length - failed.length,
  failed,
}, null, 2));
if (failed.length) process.exitCode = 1;
