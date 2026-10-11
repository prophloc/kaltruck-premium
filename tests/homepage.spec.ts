import { createHash } from 'node:crypto';
import { test, expect } from '@playwright/test';

test('homepage communicates the premium HDS offer without invented data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('CIĘŻKI ŁADUNEK?');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ZOSTAW TO NAM!');
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();

  for (const theme of ['Kontenery', 'Prefabrykaty', 'Maszyny', 'Precyzyjne ustawienie', 'Transport specjalistyczny']) {
    await expect(page.getByText(theme, { exact: false }).first()).toBeVisible();
  }

  for (const step of ['Kontakt', 'Ocena ładunku', 'Wycena i termin', 'Transport i ustawienie']) {
    await expect(page.getByText(step, { exact: false }).first()).toBeVisible();
  }
});

test('homepage hero uses the exact supplied PNG artwork', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const expectedSrc = '/images/home/hero-hds-original.png';
  const heroImage = page.locator('.hero-bg');
  await expect(heroImage).toHaveAttribute('src', expectedSrc);

  const assetResponse = await page.request.get(expectedSrc);
  expect(assetResponse.ok()).toBeTruthy();
  expect(assetResponse.headers()['content-type']).toContain('image/png');
  const assetBytes = await assetResponse.body();
  expect(assetBytes.byteLength).toBe(3_113_888);
  expect(createHash('sha256').update(assetBytes).digest('hex')).toBe('e50fe7b925406797a309348ccbcd463598e0b4e3514c131641c6db78e7a74f2b');

  const decoded = await heroImage.evaluate((img: HTMLImageElement) => ({
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));

  expect(decoded.width).toBe(1672);
  expect(decoded.height).toBe(941);
});
