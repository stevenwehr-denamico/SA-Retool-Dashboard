import { defineConfig, devices } from "@playwright/test";

// End-to-end QA regression harness for the SA Retool Dashboard.
// Targets the already-running Vite dev server. Scope: Denamico Dev Sandbox only.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    channel: undefined,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
