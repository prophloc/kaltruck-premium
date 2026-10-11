import { test, expect } from '@playwright/test';

test('header uses source brand artwork and readable sales navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const brand = page.locator('[data-brand-logo]');
  await expect(brand).toHaveCount(1);
  await expect(brand).toHaveAttribute('src', /kaltruck-logo/);

  const brandBox = await brand.boundingBox();
  expect(brandBox?.width ?? 0).toBeGreaterThanOrEqual(165);
  expect(brandBox?.height ?? 0).toBeGreaterThanOrEqual(50);

  const navMetrics = await page.locator('.desktop-nav a').evaluateAll((nodes) => nodes.map((node) => {
    const style = getComputedStyle(node);
    return { fontSize: parseFloat(style.fontSize), fontWeight: parseInt(style.fontWeight, 10) || 0 };
  }));
  expect(navMetrics.length).toBeGreaterThanOrEqual(5);
  expect(navMetrics.every((item) => item.fontSize >= 15 && item.fontWeight >= 600)).toBeTruthy();

  const quoteBox = await page.locator('.quote-link').boundingBox();
  expect(quoteBox?.height ?? 0).toBeGreaterThanOrEqual(52);
});

test('hero keeps the sales message vertically centered and CTAs prominent', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const stage = page.locator('[data-commercial-hero]');
  await expect(stage).toHaveCount(1);
  const titleBox = await page.locator('.hero-title').boundingBox();
  expect(titleBox).not.toBeNull();
  const titleCenter = (titleBox!.y + titleBox!.height / 2) / 900;
  expect(titleCenter).toBeGreaterThan(0.34);
  expect(titleCenter).toBeLessThan(0.62);

  const buttons = page.locator('.hero-actions .btn');
  await expect(buttons).toHaveCount(2);
  const metrics = await buttons.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return { height: rect.height, fontSize: parseFloat(style.fontSize), fontWeight: parseInt(style.fontWeight, 10) || 0 };
  }));
  expect(metrics.every((item) => item.height >= 58 && item.fontSize >= 15 && item.fontWeight >= 700)).toBeTruthy();
});
