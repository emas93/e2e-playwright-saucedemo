import { defineConfig } from '@playwright/test';
import { ambiente } from './configuracao/ambiente';

export default defineConfig({
  testDir: './testes',
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 4_000 },
  forbidOnly: !!process.env.CI,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: ambiente.url,
    browserName: 'chromium',
    testIdAttribute: 'data-test',
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    channel: 'chrome',
  headless: true,
  },
});
