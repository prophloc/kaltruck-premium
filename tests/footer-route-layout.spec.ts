import { test, expect } from '@playwright/test';

test('footer centers the larger brand block and balances the route section vertically', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const route = page.locator('[data-google-route]');
  const footerGrid = page.locator('.footer-grid');
  const tagline = page.locator('.footer-brand p');

  await expect(route).toHaveCount(1);
  await expect(footerGrid).toHaveCount(1);
  await expect(tagline).toHaveText('CIĘŻKI ŁADUNEK... PRECYZYJNA ROBOTA.');

  const geometry = await page.evaluate(() => {
    const footer = document.querySelector('.site-footer');
    const routeNode = document.querySelector('[data-google-route]');
    const panel = document.querySelector('.google-route-panel');
    const map = document.querySelector('.google-route-map-shell');
    const footerGridNode = document.querySelector('.footer-grid');
    const brand = document.querySelector('.footer-brand');
    const logo = document.querySelector('.footer-brand img');
    const taglineNode = document.querySelector('.footer-brand p');
    const navigation = document.querySelector('.footer-links-wrap');
    const contact = document.querySelector('.footer-contact');
    if (!footer || !routeNode || !panel || !map || !footerGridNode || !brand || !logo || !taglineNode || !navigation || !contact) return null;

    const footerRect = footer.getBoundingClientRect();
    const routeRect = routeNode.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();
    const gridRect = footerGridNode.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const taglineRect = taglineNode.getBoundingClientRect();

    const routeContentTop = Math.min(panelRect.top, mapRect.top);
    const routeContentBottom = Math.max(panelRect.bottom, mapRect.bottom);
    const routeTopGap = routeContentTop - footerRect.top;
    const routeBottomGap = routeRect.bottom - routeContentBottom;

    const brandContentTop = Math.min(logoRect.top, taglineRect.top);
    const brandContentBottom = Math.max(logoRect.bottom, taglineRect.bottom);
    const brandContentCenterY = (brandContentTop + brandContentBottom) / 2;
    const brandContentCenterX = (Math.min(logoRect.left, taglineRect.left) + Math.max(logoRect.right, taglineRect.right)) / 2;

    return {
      routeGapDelta: Math.abs(routeTopGap - routeBottomGap),
      routeTopGap,
      routeBottomGap,
      logoWidth: logoRect.width,
      brandHorizontalCenterDelta: Math.abs(brandContentCenterX - (brandRect.left + brandRect.width / 2)),
      brandVerticalCenterDelta: Math.abs(brandContentCenterY - (gridRect.top + gridRect.height / 2)),
      footerHeight: footerRect.height,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.routeTopGap).toBeGreaterThanOrEqual(18);
  expect(geometry!.routeBottomGap).toBeGreaterThanOrEqual(18);
  expect(geometry!.routeGapDelta).toBeLessThanOrEqual(4);
  expect(geometry!.logoWidth).toBeGreaterThanOrEqual(260);
  expect(geometry!.brandHorizontalCenterDelta).toBeLessThanOrEqual(5);
  expect(geometry!.brandVerticalCenterDelta).toBeLessThanOrEqual(8);
  expect(geometry!.footerHeight).toBeLessThanOrEqual(560);
});
