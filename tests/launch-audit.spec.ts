import { test, expect } from '@playwright/test';

const routes = ['/', '/transport-hds/', '/wynajem-hds/', '/transport-kontenerow/', '/transport-prefabrykatow/', '/transport-maszyn/', '/rozladunek-hds/', '/sprzet/', '/realizacje/', '/o-nas/', '/kontakt/', '/wycena/'];
const supportingRoutes = ['/realizacje/', '/sprzet/', '/o-nas/', '/kontakt/', '/wycena/', '/transport-hds/'];

for (const route of routes) {
  test(`${route} passes launch smoke audit`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const images = page.locator('img');
    for (let i = 0; i < await images.count(); i++) {
      const img = images.nth(i);
      expect(Number(await img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(await img.getAttribute('height'))).toBeGreaterThan(0);
    }
  });
}

for (const width of [1920, 1440, 1366, 1024, 768, 390, 320]) {
  test(`new homepage stays inside viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const geom = await page.evaluate(() => {
      const root = document.documentElement;
      const hero = document.querySelector('.hero');
      const style = hero ? getComputedStyle(hero) : null;
      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        paddingLeft: style ? parseFloat(style.paddingLeft) : 0,
        paddingRight: style ? parseFloat(style.paddingRight) : 0
      };
    });
    expect(geom.scrollWidth).toBeLessThanOrEqual(geom.clientWidth);
    expect(geom.paddingLeft).toBeGreaterThanOrEqual(width >= 1024 ? 24 : 18);
    expect(geom.paddingRight).toBeGreaterThanOrEqual(width >= 1024 ? 24 : 18);
  });
}

for (const route of supportingRoutes) {
  for (const width of [1440, 1024, 768, 390]) {
    test(`${route} stays inside viewport at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    });
  }
}

test('the homepage uses its full Die Glanzies reference composition', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1.main-title')).toHaveCount(1);
  await expect(page.locator('.main-title .sticker')).toHaveCount(2);
  await expect(page.locator('.topbar .brand-logo')).toHaveCount(1);
  await expect(page.locator('.cards-stage .service-card')).toHaveCount(3);
  await expect(page.locator('.features .feature-card')).toHaveCount(4);
  await expect(page.locator('.offer-grid article')).toHaveCount(3);
  await expect(page.locator('.contact-section')).toHaveCount(1);
});

test('hero reference cards retain the same layered perspective', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const attrs = await page.locator('.service-card').evaluateAll(nodes =>
    nodes.map(node => ({ pos: node.getAttribute('data-pos'), z: getComputedStyle(node).zIndex })));
  expect(attrs.map(x => x.pos)).toEqual(['0','1','2']);
  expect(Number(attrs[0].z)).toBeGreaterThan(Number(attrs[1].z));
});

test('reference full-width benefits bar sits after the service carousel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const positions = await page.evaluate(() => ({
    cards: document.querySelector('.hero-cards')!.getBoundingClientRect().top,
    features: document.querySelector('.features')!.getBoundingClientRect().top,
  }));
  expect(positions.features).toBeGreaterThan(positions.cards);
});

test('existing high-intent service paths remain discoverable from the new offer section', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('.offer-grid a').evaluateAll(nodes =>
    nodes.map(node => (node as HTMLAnchorElement).getAttribute('href')));
  expect(hrefs).toEqual(['/transport-kontenerow/', '/transport-prefabrykatow/', '/transport-maszyn/']);
});

test('realization gallery uses a controlled modular rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('[data-project-gallery] .project');
  await expect(cards).toHaveCount(10);
  const topDifference = await cards.evaluateAll((nodes) => {
    if (nodes.length < 2) return 0;
    return Math.abs(nodes[0].getBoundingClientRect().top - nodes[1].getBoundingClientRect().top);
  });
  expect(topDifference).toBeLessThanOrEqual(40);
});

test('keyboard focus remains visible and reduced motion has a global fallback', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus-visible');
  await expect(focused).toHaveCount(1);
  const css = await page.locator('html').evaluate(() => Array.from(document.styleSheets).some((sheet) => {
    try { return Array.from(sheet.cssRules).some((rule) => rule.cssText.includes('prefers-reduced-motion')); } catch { return false; }
  }));
  expect(css).toBeTruthy();
});

test('launch routes do not contain broken internal links', async ({ page, request }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((nodes) => [...new Set(nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')).filter(Boolean))] as string[]);
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
});
