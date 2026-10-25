import { test, expect } from '@playwright/test';

test('Die Glanzies carousel is a three-depth glass-card stack on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/');
  const cards = page.locator('.service-card');
  await expect(cards).toHaveCount(3);
  const depth = await cards.evaluateAll(nodes => nodes.map(node => ({
    position: node.getAttribute('data-pos'),
    transform: getComputedStyle(node).transform,
    blur: getComputedStyle(node).backdropFilter,
  })));
  expect(depth.map(x => x.position)).toEqual(['0','1','2']);
  expect(depth.every(x => x.transform !== 'none')).toBeTruthy();
  expect(depth.every(x => x.blur !== 'none')).toBeTruthy();
});

test('card content and photo attributes match Kaltruck actual services', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.service-card');
  await expect(cards.nth(0)).toContainText('Transport');
  const destinations = await cards.locator('.more-btn').evaluateAll(nodes =>
    nodes.map(node => (node as HTMLAnchorElement).getAttribute('href')));
  expect(destinations).toEqual(['/transport-kontenerow/', '/transport-prefabrykatow/', '/transport-maszyn/']);
  await expect(cards.locator('.photo-panel img')).toHaveCount(3);
  const alts = await cards.locator('.photo-panel img').evaluateAll(nodes => nodes.map(node => node.getAttribute('alt') || ''));
  expect(alts.every(x => x.includes('HDS'))).toBeTruthy();
});

test('reference navigation and callback actions are all present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.nav a[href="#angebot"]')).toBeVisible();
  await expect(page.locator('.nav a[href="/realizacje/"]')).toBeVisible();
  await expect(page.locator('.nav a[href="#kontakt"]')).toBeVisible();
  await expect(page.locator('.nav a[href="/wycena/"]')).toBeVisible();
  await expect(page.locator('.badge-phone')).toHaveAttribute('href', 'tel:+48784430022');
  await expect(page.locator('.badge-mail')).toHaveAttribute('href', 'mailto:hds.plock@gmail.com');
});

test('social meta, canonical and browser assets are still configured', async ({ page }) => {
  for (const route of ['/', '/transport-hds/']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  }
  const favicon = await page.request.get('/favicon.svg');
  expect(favicon.ok()).toBeTruthy();
  const manifest = await page.request.get('/site.webmanifest');
  expect(manifest.ok()).toBeTruthy();
});

test('existing reviews component and footer tools remain on service pages', async ({ page }) => {
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.site-footer')).toBeVisible();
  await expect(page.locator('.footer-socials a')).toHaveCount(2);
  await expect(page.locator('.site-footer [data-google-route]')).toHaveCount(1);
});
