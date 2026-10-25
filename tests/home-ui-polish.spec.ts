import { test, expect } from '@playwright/test';

test('contact cards mirror informational reference pattern, without fake staff',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-contact-item')).toHaveCount(3);
 await expect(page.locator('.sht-contact-item').first()).toContainText('Telefon');
 await expect(page.locator('.sht-contact-item').nth(1)).toContainText('Zapytania i wyceny');
 await expect(page.locator('.sht-contact-item').nth(2)).toContainText('Baza transportowa');
});

test('editorial article has compact heading and restrained conversion links',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-article-title h2')).toContainText('Transport z HDS');
 await expect(page.locator('.sht-article-cta a')).toHaveCount(2);
 await expect(page.locator('.sht-contact-bottom a[href="/wycena/"]')).toBeVisible();
});

test('footer brand is centered in the whole free row between route and copyright line', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const geometry = await page.evaluate(() => {
    const route = document.querySelector<HTMLElement>('[data-google-route]');
    const footerBottom = document.querySelector<HTMLElement>('.footer-bottom');
    const logo = document.querySelector<HTMLElement>('.footer-brand img');
    const tagline = document.querySelector<HTMLElement>('.footer-brand p');
    if (!route || !footerBottom || !logo || !tagline) return null;

    const routeRect = route.getBoundingClientRect();
    const bottomRect = footerBottom.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const taglineRect = tagline.getBoundingClientRect();

    const contentTop = Math.min(logoRect.top, taglineRect.top);
    const contentBottom = Math.max(logoRect.bottom, taglineRect.bottom);
    const topSpace = contentTop - routeRect.bottom;
    const bottomSpace = bottomRect.top - contentBottom;

    return { topSpace, bottomSpace, delta: Math.abs(topSpace - bottomSpace) };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.topSpace).toBeGreaterThanOrEqual(16);
  expect(geometry!.bottomSpace).toBeGreaterThanOrEqual(16);
  expect(geometry!.delta).toBeLessThanOrEqual(8);
});
