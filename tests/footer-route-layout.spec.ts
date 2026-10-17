import { test, expect } from '@playwright/test';

test('footer keeps brand, route form, navigation and contact in one row with the map full-width below', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const geometry = await page.evaluate(() => {
    const footer = document.querySelector('.site-footer');
    const brand = document.querySelector('.footer-brand');
    const panel = document.querySelector('.google-route-panel');
    const navigation = document.querySelector('.footer-links-wrap');
    const contact = document.querySelector('.footer-contact');
    const map = document.querySelector('.google-route-map-shell');
    const bottom = document.querySelector('.footer-bottom');
    if (!footer || !brand || !panel || !navigation || !contact || !map || !bottom) return null;

    const footerRect = footer.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const navigationRect = navigation.getBoundingClientRect();
    const contactRect = contact.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();
    const bottomRect = bottom.getBoundingClientRect();
    const rowTop = Math.min(brandRect.top, panelRect.top, navigationRect.top, contactRect.top);
    const rowBottom = Math.max(brandRect.bottom, panelRect.bottom, navigationRect.bottom, contactRect.bottom);

    return {
      routeBesideBrand: panelRect.left >= brandRect.right - 4,
      topRowAligned: Math.max(
        Math.abs(brandRect.top - rowTop),
        Math.abs(panelRect.top - rowTop),
        Math.abs(navigationRect.top - rowTop),
        Math.abs(contactRect.top - rowTop),
      ) < 36,
      mapBelowTopRow: mapRect.top >= rowBottom + 12,
      mapNearlyFullFooterWidth: mapRect.width >= footerRect.width * 0.72,
      mapBeforeBottomBar: mapRect.bottom <= bottomRect.top - 12,
    };
  });

  expect(geometry).toEqual({
    routeBesideBrand: true,
    topRowAligned: true,
    mapBelowTopRow: true,
    mapNearlyFullFooterWidth: true,
    mapBeforeBottomBar: true,
  });
});
