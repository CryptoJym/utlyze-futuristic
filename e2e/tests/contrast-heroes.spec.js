const { test, expect } = require('@playwright/test');

async function getStyles(page, selector) {
  const handle = await page.locator(selector).first();
  await expect(handle).toBeVisible();
  return await handle.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { color: cs.color, textShadow: cs.textShadow };
  });
}

test.describe('Hero contrast checks', () => {
  test('Pricing hero title is white with shadow', async ({ page }) => {
    await page.goto('/pricing/');
    const styles = await getStyles(page, '.pricing-hero .pricing-title');
    expect(styles.color).toBe('rgb(255, 255, 255)');
    expect(styles.textShadow && styles.textShadow !== 'none').toBeTruthy();
  });

  test('Use Cases hero title is white with shadow', async ({ page }) => {
    await page.goto('/use-cases/');
    const styles = await getStyles(page, '.use-cases-hero .use-cases-title');
    expect(styles.color).toBe('rgb(255, 255, 255)');
    expect(styles.textShadow && styles.textShadow !== 'none').toBeTruthy();
  });
});

