const { test, expect } = require('@playwright/test');

async function stubSupabaseSimple(page) {
  await page.addInitScript(() => {
    const client = { from: () => ({ insert: async () => ({ data: [], error: null }) }) };
    Object.defineProperty(window, 'supabase', { value: client, configurable: true });
  });
}

test.describe('Contact form happy-path', () => {
  test('Submit contact form; success message; no console errors', async ({ page }) => {
    await stubSupabaseSimple(page);
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('/contact/');
    await expect(page.locator('text=Transform Your Business with AI')).toBeVisible();

    await page.fill('#first_name', 'Ada');
    await page.fill('#last_name', 'Lovelace');
    await page.fill('#email', 'qa+contact@example.com');
    await page.fill('#company', 'Utlyze QA');
    await page.fill('#job_title', 'QA Lead');
    await page.fill('#pain_points', 'High API costs and latency');

    await page.click('#submit-button');

    await expect(page.locator('#success-message')).toBeVisible();

    // Link integrity for key paths
    const resContact = await page.request.get('/contact/');
    expect(resContact.status()).toBe(200);

    expect(errors).toEqual([]);
  });
});

