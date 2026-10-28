import { expect, it } from "vitest";
import { canUseCsv, isCsvResource } from "./resources";

it("includes SEO CSV only behind the existing homepage management permission", () => {
  expect(isCsvResource("homepage-seo")).toBe(true);
  for (const importing of [false, true]) {
    expect(canUseCsv("homepage-seo", [], importing)).toBe(false);
    expect(canUseCsv("homepage-seo", ["users.view"], importing)).toBe(false);
    expect(canUseCsv("homepage-seo", ["homepage.manage"], importing)).toBe(true);
  }
});

it("allows audit CSV export only with both system administrator role and audit permission", () => {
  expect(isCsvResource("audit-logs")).toBe(true);
  expect(canUseCsv("audit-logs", [], false, ["system-administrator"])).toBe(false);
  expect(canUseCsv("audit-logs", ["users.view"], false, ["system-administrator"])).toBe(false);
  expect(canUseCsv("audit-logs", ["audit.view"], false)).toBe(false);
  expect(canUseCsv("audit-logs", ["audit.view"], false, ["academy-manager"])).toBe(false);
  expect(canUseCsv("audit-logs", ["audit.view"], false, ["system-administrator"])).toBe(true);
  expect(canUseCsv("audit-logs", ["audit.view"], true, ["system-administrator"])).toBe(false);
});
