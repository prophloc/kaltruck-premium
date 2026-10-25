import { test, expect } from '@playwright/test';

test('homepage communicates HDS services and precise verified metrics', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('Kontenery');
  await expect(page.locator('h1')).toContainText('Maszyny');
  await expect(page.locator('.badge-price')).toContainText('12 ton');
  await expect(page.locator('.badge-bus')).toContainText('Płock i cała Polska');
  await expect(page.locator('.contact-main')).toHaveAttribute('href', '/wycena/');
});

test('homepage uses existing responsive KALTRUCK background imagery', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const desktop = await page.locator('.hero').evaluate(node => getComputedStyle(node).backgroundImage);
  expect(desktop).toContain('/images/home/hero-hds-desktop.webp');
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.locator('.hero').evaluate(node => getComputedStyle(node).backgroundImage);
  expect(mobile).toContain('/images/home/hero-hds-mobile.webp');
});

test('reference four benefit cards are present with KALTRUCK text', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.feature-card')).toHaveCount(4);
  await expect(page.locator('.feature-card').nth(0)).toContainText('Transport i HDS');
  await expect(page.locator('.feature-card').nth(1)).toContainText('Precyzyjny rozładunek');
  await expect(page.locator('.feature-card').nth(3)).toContainText('Płock i cała Polska');
});

test('reference contact cards retain phone, form, email and mapped coverage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.contact-card')).toHaveCount(1);
  await expect(page.locator('.contact-side img')).toHaveAttribute('src','/brand/kaltruck-logo.svg');
  await expect(page.locator('.contact-card a[href="/wycena/"]')).toHaveCount(1);
  await expect(page.locator('.contact-card a[href^="tel:"]')).toHaveCount(1);
  await expect(page.locator('.contact-card a[href^="mailto:"]')).toHaveCount(1);
});
