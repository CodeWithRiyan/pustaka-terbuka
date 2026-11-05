import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Playwright specs live in e2e/ and are run by `pnpm e2e`.
    exclude: ["e2e/**", "node_modules/**"],
    testTimeout: 10_000,
    hookTimeout: 10_000,
    // Enabled with `pnpm test --coverage`.
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/test/**",
        "src/setupTests.ts",
        // Route files: thin wrappers around the page components, run by e2e.
        "src/app/**",
        // Vendored shadcn/ui primitives, not this project's own logic.
        "src/components/ui/**",
        "src/**/index.ts", // re-export barrels
        "src/types/**", // type-only modules
        "src/i18n/types.ts",
      ],
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
      // The same gate as the simple-geolocation reference.
      thresholds: {
        statements: 95,
        branches: 85,
        functions: 95,
        lines: 95,
      },
    },
  },
})
