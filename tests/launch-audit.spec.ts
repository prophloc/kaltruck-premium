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

for(const width of [1920,1440,1366,1024,768,390,320]){
  test(`homepage stays inside viewport at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    const geometry=await page.evaluate(()=>{
      const root=document.documentElement;
      const rect=document.querySelector('.sht-banner .sht-shell')?.getBoundingClientRect();
      return {scroll:root.scrollWidth,viewport:root.clientWidth,left:rect?.left??0,right:rect?root.clientWidth-rect.right:0};
    });
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.left).toBeGreaterThanOrEqual(width>540?20:15);
    expect(geometry.right).toBeGreaterThanOrEqual(width>540?20:15);
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

test('homepage follows source visual order: header, image banner, four facts, article, contact',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/');
 await expect(page.locator('.sht-topline')).toHaveCount(1);
 await expect(page.locator('.sht-nav')).toHaveCount(1);
 await expect(page.locator('.sht-banner')).toHaveCount(1);
 await expect(page.locator('.sht-stat')).toHaveCount(4);
 await expect(page.locator('.sht-article')).toHaveCount(1);
 await expect(page.locator('.sht-contact-item')).toHaveCount(3);
 await expect(page.locator('.sht-footer')).toHaveCount(1);
});

test('article-like interior has paragraphs and a short photographic gallery',async({page})=>{
 await page.goto('/');
 await expect(page.locator('h1')).toContainText('Transport HDS');
 await expect(page.locator('.sht-article-text>p')).toHaveCount(4);
 await expect(page.locator('.sht-photo-grid .sht-photo')).toHaveCount(3);
 await expect(page.locator('.sht-article-cta a[href="/wycena/"]')).toHaveCount(1);
});

test('hero is short photo header and page keeps accessible canonical metadata',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/');
 const height=await page.locator('.sht-banner').evaluate(el=>el.getBoundingClientRect().height);
 expect(height).toBeLessThanOrEqual(500);
 await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(2);
 await expect(page.locator('meta[name="description"]')).toHaveCount(1);
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
