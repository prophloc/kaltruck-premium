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
    if (!footer || !routeNode || !panel || !map || !footerGridNode || !brand || !logo || !taglineNode) return null;

    const footerRect = footer.getBoundingClientRect();
    const routeRect = routeNode.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();
    const gridRect = footerGridNode.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const taglineRect = taglineNode.getBoundingClientRect();

    const routeContentTop = Math.min(panelRect.top, mapRect.top);
    const routeContentBottom = Math.max(panelRect.bottom, mapRect.bottom);
    const routeTopGap = routeContentTop - footerRect.top;
    const routeBottomGap = routeRect.bottom - routeContentBottom;

    const brandContentTop = Math.min(logoRect.top, taglineRect.top);
    const brandContentBottom = Math.max(logoRect.bottom, taglineRect.bottom);
    const brandContentCenterY = (brandContentTop + brandContentBottom) / 2;

    return {
      routeGapDelta: Math.abs(routeTopGap - routeBottomGap),
      routeTopGap,
      routeBottomGap,
      logoWidth: logoRect.width,
      brandVerticalCenterDelta: Math.abs(brandContentCenterY - (gridRect.top + gridRect.height / 2)),
      brandTopSpace: brandContentTop - gridRect.top,
      brandBottomSpace: gridRect.bottom - brandContentBottom,
      footerHeight: footerRect.height,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.routeTopGap).toBeGreaterThanOrEqual(18);
  expect(geometry!.routeBottomGap).toBeGreaterThanOrEqual(18);
  expect(geometry!.routeGapDelta).toBeLessThanOrEqual(4);
  expect(geometry!.logoWidth).toBeGreaterThanOrEqual(280);
  expect(geometry!.brandVerticalCenterDelta).toBeLessThanOrEqual(4);
  expect(Math.abs(geometry!.brandTopSpace - geometry!.brandBottomSpace)).toBeLessThanOrEqual(8);
  expect(geometry!.footerHeight).toBeLessThanOrEqual(590);
});

test('homepage has a left-edge route drawer that opens, closes and stays centered on the hero', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const hero = page.locator('[data-commercial-hero]');
  const drawer = page.locator('[data-hero-route-drawer]');
  const toggle = page.locator('[data-hero-route-toggle]');
  const panel = page.locator('[data-hero-route-panel]');

  await expect(drawer).toHaveCount(1);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await expect(drawer.locator('[data-google-route]')).toHaveCount(1);

  const closedGeometry = await page.evaluate(() => {
    const heroNode = document.querySelector('[data-commercial-hero]');
    const toggleNode = document.querySelector('[data-hero-route-toggle]');
    if (!heroNode || !toggleNode) return null;
    const heroRect = heroNode.getBoundingClientRect();
    const toggleRect = toggleNode.getBoundingClientRect();
    return {
      centerDelta: Math.abs((toggleRect.top + toggleRect.height / 2) - (heroRect.top + heroRect.height / 2)),
      heightRatio: toggleRect.height / heroRect.height,
      leftEdge: toggleRect.left - heroRect.left,
    };
  });

  expect(closedGeometry).not.toBeNull();
  expect(closedGeometry!.centerDelta).toBeLessThanOrEqual(4);
  expect(closedGeometry!.heightRatio).toBeGreaterThanOrEqual(0.08);
  expect(closedGeometry!.heightRatio).toBeLessThanOrEqual(0.12);
  expect(closedGeometry!.leftEdge).toBeLessThanOrEqual(8);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
});
