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

for (const width of [1920,1440,1366,1024,768,390,320]) {
  test(`homepage stays inside viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    const geometry = await page.evaluate(() => {
      const root = document.documentElement;
      const container = document.querySelector('.ht-hero .ht-container');
      const rect = container?.getBoundingClientRect();
      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        left: rect?.left ?? 0,
        right: rect ? root.clientWidth - rect.right : 0,
      };
    });
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    expect(geometry.left).toBeGreaterThanOrEqual(width>620 ? 30 : 18);
    expect(geometry.right).toBeGreaterThanOrEqual(width>620 ? 30 : 18);
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

test('homepage uses the panorama, four numbers and editorial HDS structure', async ({ page }) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  await expect(page.locator('.ht-hero')).toBeVisible();
  await expect(page.locator('.ht-fact')).toHaveCount(4);
  await expect(page.locator('.ht-about-grid')).toHaveCount(1);
  await expect(page.locator('.ht-service')).toHaveCount(3);
  await expect(page.locator('.ht-reason')).toHaveCount(4);
  await expect(page.locator('.ht-contact-details')).toHaveCount(1);
});

test('editorial text and imagery use business content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('PEWNY TRANSPORT');
  await expect(page.locator('.ht-about h2')).toContainText('Z PŁOCKA');
  await expect(page.locator('.ht-service img')).toHaveCount(3);
  await expect(page.locator('.ht-statement h2')).toContainText('USTAWIAMY');
  await expect(page.locator('.ht-contact')).toContainText('784 430 022');
});

test('new sections maintain width, readable copy and prominent lead conversion', async ({ page }) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  const action = page.locator('.ht-hero-actions .ht-action-primary');
  await expect(action).toBeVisible();
  const heroWidth = await page.locator('.ht-hero').evaluate(el=>el.getBoundingClientRect().width);
  expect(heroWidth).toBe(1440);
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(2);
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
