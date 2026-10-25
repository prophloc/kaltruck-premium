import { test, expect } from '@playwright/test';

test('industrial editorial hero presents the KALTRUCK message and source brand', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toContainText('CIĘŻKI ŁADUNEK.');
  await expect(page.locator('h1')).toContainText('PEWNY TRANSPORT.');
  await expect(page.locator('.site-header .brand-logo')).toHaveAttribute('src','/brand/kaltruck-logo.svg');
  await expect(page.locator('.ht-hero')).toBeVisible();
  await expect(page.locator('.ht-hero-actions a[href="/wycena/"]')).toBeVisible();
  await expect(page.locator('.ht-hero')).toContainText('PŁOCK, POLSKA');
});

test('panoramic hero uses a real local HDS WebP with dark gradient overlays', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const hero = await page.locator('.ht-hero-media').evaluate(el => getComputedStyle(el).backgroundImage);
  expect(hero).toContain('hero-hds-desktop.webp');
  expect(hero).toContain('linear-gradient');
  await expect(page.locator('.ht-hero')).toHaveCSS('position','relative');
});

test('call-to-action routes and contact links preserve business data', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.ht-action-primary[href="/wycena/"]')).toHaveCount(2);
  await expect(page.locator('.ht-contact-details a[href="tel:+48784430022"]')).toBeVisible();
  await expect(page.locator('.ht-contact-details a[href="mailto:hds.plock@gmail.com"]')).toBeVisible();
});

test('home retains source navigation, SEO, and detailed service routes', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.desktop-nav')).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('.ht-service')).toHaveCount(3);
  const urls = await page.locator('.ht-service').evaluateAll(nodes => nodes.map(node =>
    (node as HTMLAnchorElement).getAttribute('href')));
  expect(urls).toEqual(['/transport-kontenerow/','/transport-prefabrykatow/','/transport-maszyn/']);
});
