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
}

test.describe('Venture Studio form happy-path', () => {
  test('Submit studio idea; success note; no console errors', async ({ page }) => {
    await stubSupabase(page);
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('/studio/');
    await expect(page.locator('text=Utlyze Venture Studio')).toBeVisible();

    await page.fill('#name', 'QA Runner');
    await page.fill('#email', 'qa+studio@example.com');
    await page.fill('#description', 'This is a sufficiently detailed idea description for testing.');

    await page.click('button.submit-btn');

    const msg = page.locator('#formMessage');
    await expect(msg).toBeVisible();
    await expect(msg).toContainText('Thank you');

    // Link integrity for key paths
    const resStudio = await page.request.get('/studio/');
    expect(resStudio.status()).toBe(200);

    expect(errors).toEqual([]);
  });
});

