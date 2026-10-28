// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { Permission, Role } from "@/features/auth/types";
import { AdminShell } from "./admin-shell";
afterEach(cleanup);
it.each([
  [[], ["audit.view"], false], [["system-administrator"], [], false],
  [["academy-manager"], ["audit.view"], false], [["system-administrator"], ["audit.view"], true],
])("gates audit discovery with both current role %j and permission %j", (roles, permissions, visible) => {
  render(<AdminShell title="الإدارة" roles={roles as Role[]} permissions={permissions as Permission[]} currentSection="audit">سجل</AdminShell>);
  const link = screen.queryByRole("link", { name: "سجل التدقيق" });
  expect(Boolean(link)).toBe(visible);
  if (link) { expect(link.getAttribute("href")).toBe("/admin/audit-logs"); expect(link.getAttribute("aria-current")).toBe("page"); }
});
