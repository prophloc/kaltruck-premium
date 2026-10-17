import { test, expect } from '@playwright/test';

test('footer keeps the route section above a compact brand navigation contact row', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const footer = page.locator('.site-footer');
  const route = page.locator('[data-google-route]');
  const footerGrid = page.locator('.footer-grid');
  const brand = page.locator('.footer-brand');
  const logo = page.locator('.footer-brand img');
  const brandLines = page.locator('.footer-brand p > span');
  const navigation = page.locator('.footer-links-wrap');
  const contact = page.locator('.footer-contact');

  await expect(route).toHaveCount(1);
  await expect(footerGrid).toHaveCount(1);
  await expect(brandLines).toHaveCount(2);
  await expect(brandLines.nth(0)).toHaveText('Ciężki ładunek.');
  await expect(brandLines.nth(1)).toHaveText('Precyzyjna robota.');

  const geometry = await page.evaluate(() => {
    const footerNode = document.querySelector('.site-footer');
    const routeNode = document.querySelector('[data-google-route]');
    const footerGridNode = document.querySelector('.footer-grid');
    const brandNode = document.querySelector('.footer-brand');
    const logoNode = document.querySelector('.footer-brand img');
    const navigationNode = document.querySelector('.footer-links-wrap');
    const contactNode = document.querySelector('.footer-contact');
    if (!footerNode || !routeNode || !footerGridNode || !brandNode || !logoNode || !navigationNode || !contactNode) return null;

    const footerRect = footerNode.getBoundingClientRect();
    const routeRect = routeNode.getBoundingClientRect();
    const footerGridRect = footerGridNode.getBoundingClientRect();
    const brandRect = brandNode.getBoundingClientRect();
    const logoRect = logoNode.getBoundingClientRect();
    const navigationRect = navigationNode.getBoundingClientRect();
    const contactRect = contactNode.getBoundingClientRect();

    return {
      routeAboveFooterRow: routeRect.bottom <= footerGridRect.top - 1,
      footerColumnsAligned: Math.max(
        Math.abs(brandRect.top - navigationRect.top),
        Math.abs(brandRect.top - contactRect.top),
      ) < 36,
      logoWidth: logoRect.width,
      footerHeight: footerRect.height,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.routeAboveFooterRow).toBe(true);
  expect(geometry!.footerColumnsAligned).toBe(true);
  expect(geometry!.logoWidth).toBeGreaterThanOrEqual(195);
  expect(geometry!.footerHeight).toBeLessThanOrEqual(560);
});
