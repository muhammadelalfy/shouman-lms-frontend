import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(directory, entry.name)) : /\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.") ? [join(directory, entry.name)] : []);
}
describe("marketing preview data boundary", () => {
  it("cannot send messages, publish records, persist drafts or read sessions", () => {
    const sources = files(fileURLToPath(new URL(".", import.meta.url)));
    expect(sources.length).toBeGreaterThan(3);
    for (const file of sources) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/\bfetch\s*\(|\b(?:localStorage|sessionStorage)\b|document\.cookie|["']use server["']|features\/(?:auth|account)\/actions|\bapiRequest\s*\(/);
    }
  });
});
