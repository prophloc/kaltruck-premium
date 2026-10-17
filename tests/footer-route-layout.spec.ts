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
  await expect(toggle).toHaveText('TRASA');
  await expect(toggle.locator('.hero-route-toggle-arrow')).toHaveCount(0);
  await expect(panel).toBeHidden();
  await expect(drawer.locator('[data-google-route]')).toHaveCount(1);

  const closedGeometry = await page.evaluate(() => {
    const heroNode = document.querySelector('[data-commercial-hero]');
    const toggleNode = document.querySelector('[data-hero-route-toggle]');
    const toggleText = document.querySelector('.hero-route-toggle-text');
    if (!heroNode || !toggleNode || !toggleText) return null;
    const heroRect = heroNode.getBoundingClientRect();
    const toggleRect = toggleNode.getBoundingClientRect();
    return {
      centerDelta: Math.abs((toggleRect.top + toggleRect.height / 2) - (heroRect.top + heroRect.height / 2)),
      heightRatio: toggleRect.height / heroRect.height,
      leftEdge: toggleRect.left - heroRect.left,
      textSize: Number.parseFloat(getComputedStyle(toggleText).fontSize),
    };
  });

  expect(closedGeometry).not.toBeNull();
  expect(closedGeometry!.centerDelta).toBeLessThanOrEqual(4);
  expect(closedGeometry!.heightRatio).toBeGreaterThanOrEqual(0.08);
  expect(closedGeometry!.heightRatio).toBeLessThanOrEqual(0.12);
  expect(closedGeometry!.leftEdge).toBeLessThanOrEqual(8);
  expect(closedGeometry!.textSize).toBeGreaterThanOrEqual(13);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();

  const drawerTheme = await drawer.locator('[data-google-route]').evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      background: style.backgroundColor,
      color: style.color,
    };
  });
  expect(drawerTheme.background).toBe('rgb(247, 244, 238)');
  expect(drawerTheme.color).toBe('rgb(20, 20, 18)');
  await expect(drawer.locator('[data-google-brand-icon]')).toHaveCount(1);

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
});

test('route form supports custom origin and destination with base fallback', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const drawer = page.locator('[data-hero-route-drawer]');
  const toggle = drawer.locator('[data-hero-route-toggle]');
  await toggle.click();

  const route = drawer.locator('[data-google-route]');
  const origin = route.locator('[data-google-route-origin]');
  const destination = route.locator('[data-google-route-destination]');
  const map = route.locator('[data-google-route-map]');
  const form = route.locator('[data-google-route-form]');

  await expect(origin).toHaveCount(1);
  await expect(destination).toHaveCount(1);

  await route.evaluate((node) => node.setAttribute('data-api-key', 'test-key'));
  await origin.fill('Warszawa');
  await destination.fill('Łódź');
  await form.locator('button[type="submit"]').click();

  const customSrc = await map.getAttribute('src');
  expect(customSrc).toContain('/maps/embed/v1/directions?');
  expect(new URL(customSrc!).searchParams.get('origin')).toBe('Warszawa');
  expect(new URL(customSrc!).searchParams.get('destination')).toBe('Łódź');

  await destination.fill('');
  await form.locator('button[type="submit"]').click();

  const fallbackSrc = await map.getAttribute('src');
  expect(new URL(fallbackSrc!).searchParams.get('destination')).toBe('Tokarska 40, 09-401 Płock');
});
