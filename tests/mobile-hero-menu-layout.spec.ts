import { test, expect } from '@playwright/test';

for (const width of [320,390,620]) {
  test(`responsive HeavyTransport homepage remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:844});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('.ht-hero h1')).toBeVisible();
    await expect(page.locator('.ht-hero-actions a[href="/wycena/"]')).toBeVisible();
    await expect(page.locator('.ht-fact')).toHaveCount(4);
    await expect(page.locator('.ht-service')).toHaveCount(3);
    const dimensions = await page.evaluate(() => ({
      viewport:document.documentElement.clientWidth,
      body:document.documentElement.scrollWidth
    }));
    expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
  });
}

test('existing mobile menu retains contact access on inner pages', async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
  await page.locator('[data-menu-open]').click();
  const menu = page.locator('[data-mobile-menu]');
  await expect(menu).toBeVisible();
  await expect(menu.locator('a[href="tel:+48784430022"]')).toBeVisible();
  await expect(menu.locator('a[href^="mailto:"]')).toBeVisible();
});
