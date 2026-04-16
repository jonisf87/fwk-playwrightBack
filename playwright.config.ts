import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    baseURL: "https://demoqa.com",
  },
  reporter: [["list"], ["html"]],
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
