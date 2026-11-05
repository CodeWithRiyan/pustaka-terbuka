import { defineConfig, devices } from "@playwright/test"

/**
 * `pnpm e2e` builds the static export and tests it, served under the same
 * base path as GitHub Pages. With E2E_BASE_URL set (the live site) it runs
 * the same specs there instead: the smoke test. Open Library is stubbed in
 * the specs either way, so results never depend on its availability.
 */
const PORT = 4173
const BASE_PATH = "/pustaka-terbuka"
const live = process.env.E2E_BASE_URL
const baseURL = live ?? `http://localhost:${PORT}${BASE_PATH}/`

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    // The site picks its language from the browser; pin it so specs are deterministic.
    locale: "id-ID",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: live
    ? undefined
    : {
        command: "pnpm build && node e2e/serve.mjs",
        env: {
          NEXT_PUBLIC_BASE_PATH: BASE_PATH,
          BASE_PATH,
          PORT: String(PORT),
        },
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      },
})
