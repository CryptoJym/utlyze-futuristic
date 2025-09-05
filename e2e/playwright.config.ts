import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3010',
    trace: 'off'
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } }
    },
    {
      name: 'Tablet',
      use: { browserName: 'chromium', viewport: { width: 820, height: 1180 } }
    },
    {
      name: 'Mobile',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'python3 -m http.server 3010',
    cwd: '..',
    port: 3010,
    reuseExistingServer: true,
    timeout: 120000
  }
});
