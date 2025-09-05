const { test, expect } = require('@playwright/test');

test.describe('Home navigation happy-path', () => {
  test('Header nav loads; ROI link works; no console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('/');

    const navLinks = page.locator('nav .nav-links');
    const toggle = page.locator('.nav-toggle');
    if (await navLinks.isHidden()) {
      if (await toggle.isVisible()) {
        await toggle.click();
      }
    }
    await expect(navLinks).toBeVisible();
    await expect(page.locator('a.nav-link', { hasText: 'Venture Studio' })).toBeVisible();

    await page.locator('a[href="/roi/"]').first().click();
    await expect(page).toHaveURL(/\/roi\//);
    await expect(page).toHaveTitle(/ROI|Predictable AI ROI/i);

    // Back to home and test smooth scroll CTA
    await page.goBack();
    const before = await page.evaluate(() => window.scrollY);
    await page.locator('button[data-scroll-to="form"]').click();
    await page.waitForTimeout(300); // allow smooth scroll
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThanOrEqual(before);

    expect(errors).toEqual([]);
  });
});
