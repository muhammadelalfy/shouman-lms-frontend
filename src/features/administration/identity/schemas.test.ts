import { expect, it } from "vitest";
import {
  userFiltersSchema,
  userRolesSchema,
  rolePermissionsSchema,
} from "./schemas";
it("restricts backend search and enums", () => {
  expect(userFiltersSchema.safeParse({ search: "x" }).success).toBe(false);
  expect(
    userFiltersSchema.safeParse({ search: "xx", status: "active" }).success,
  ).toBe(true);
  expect(userFiltersSchema.safeParse({ search: "x".repeat(101) }).success).toBe(
    false,
  );
});
it("accepts explicit clearing and rejects unknown or repeated roles", () => {
  expect(userRolesSchema.safeParse({ id: 42, roles: [] }).success).toBe(true);
  for (const roles of [["root"], ["student", "student"]])
    expect(userRolesSchema.safeParse({ id: 42, roles }).success).toBe(false);
});
it("rejects unregistered permissions", () =>
  expect(
    rolePermissionsSchema.safeParse({
      role: "student",
      permissions: ["everything"],
    }).success,
  ).toBe(false));
