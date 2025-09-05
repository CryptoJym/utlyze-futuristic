const { test, expect } = require('@playwright/test');

async function stubSupabase(page) {
  await page.addInitScript(() => {
    const makeClient = () => ({
      from: () => ({ insert: async () => ({ data: [], error: null }) })
    });
    const client = makeClient();
    Object.defineProperty(window, 'supabase', {
      value: { createClient: () => client, from: client.from },
      configurable: true
    });
  });
  const fulfillNoop = (route) => route.fulfill({ status: 200, body: '', contentType: 'application/javascript' });
  await page.route('**/*supabase-js*', fulfillNoop);
  await page.route('**/*@supabase/*', fulfillNoop);
}

test.describe('ROI calculator happy-path', () => {
  test('Submit ROI form and see results; no console errors', async ({ page }) => {
    await stubSupabase(page);
    const errors = [];
    page.on('dialog', (d) => d.dismiss());
    page.on('pageerror', (err) => errors.push(String(err)));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('/roi/');
    await expect(page.locator('text=Estimate Your Savings')).toBeVisible();

    await page.fill('#simpleMonthlySpend', '3000');
    await page.fill('#calcForm input[name="name"]', 'QA User');
    await page.fill('#calcForm input[name="email"]', 'qa+roi@example.com');

    await page.click('#btnCalc');

    await expect(page.locator('#roiResults')).toBeVisible();
    await expect(page.locator('#savings')).not.toHaveText('');

    // Link integrity for key paths
    const resRoi = await page.request.get('/roi/');
    expect(resRoi.status()).toBe(200);

    expect(errors).toEqual([]);
  });
});
