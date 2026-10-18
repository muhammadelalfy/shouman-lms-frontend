import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./navigation";

describe("safeRedirectPath", () => {
  it.each(["/", "/dashboard", "/learn/tracks/1?lesson=3"])("allows internal path %s", (path) => {
    expect(safeRedirectPath(path)).toBe(path);
  });

  it.each([
    ["absolute URL", "https://evil.example/phish"],
    ["protocol-relative URL", "//evil.example"],
    ["backslash trick", "/\\evil.example"],
    ["header injection", "/dashboard\r\nSet-Cookie: x=1"],
    ["relative without slash", "dashboard"],
    ["non-string", null],
  ])("falls back for %s", (_case, candidate) => {
    expect(safeRedirectPath(candidate, "/home")).toBe("/home");
  });
});
