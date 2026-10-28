import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "server-only" throws outside a React Server environment; tests run in Node.
      "server-only": fileURLToPath(new URL("./src/test/server-only-stub.ts", import.meta.url)),
    },
  },
  test: {
    // Windows sandboxed fork workers can fail their IPC startup handshake.
    // A single thread keeps local verification reliable without limiting Linux CI.
    ...(process.platform === "win32" ? { pool: "threads" as const, maxWorkers: 1 } : {}),
    // Component tests opt in per file with `// @vitest-environment jsdom`.
    environment: "node",
    setupFiles: ["./src/test/browser-apis.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // Parallel jsdom workers render the animated landing page slowly; 5s is too tight.
    testTimeout: 20000,
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
});
