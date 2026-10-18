import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? sourceFiles(join(directory, entry.name)) : /\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.") ? [join(directory, entry.name)] : []);
}

describe("synthetic frontend boundary", () => {
  it("keeps every design preview free of network, session, storage and server-write dependencies", () => {
    const files = sourceFiles(fileURLToPath(new URL(".", import.meta.url)));
    expect(files.length).toBeGreaterThan(15);
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/\bfetch\s*\(|\b(?:localStorage|sessionStorage)\b|document\.cookie|["']use server["']|features\/(?:auth|account)\/actions|\bapiRequest\s*\(/);
      expect(source, file).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    }
  });
});
