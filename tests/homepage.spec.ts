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

test('homepage hero uses the supplied local HDS artwork', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const heroImage = page.locator('.hero-bg');
  await expect(heroImage).toHaveAttribute('src', '/images/home/hero-hds-kaltruck.webp');

  const decoded = await heroImage.evaluate((img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 45;
    const context = canvas.getContext('2d');
    if (!context) return { width: 0, height: 0, average: 0, spread: 0 };

    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const luminance: number[] = [];
    for (let i = 0; i < pixels.length; i += 4) {
      luminance.push((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
    }
    const average = luminance.reduce((sum, value) => sum + value, 0) / luminance.length;
    const variance = luminance.reduce((sum, value) => sum + ((value - average) ** 2), 0) / luminance.length;

    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      average,
      spread: Math.sqrt(variance),
    };
  });

  expect(decoded.width).toBeGreaterThanOrEqual(1200);
  expect(decoded.height).toBeGreaterThanOrEqual(675);
  expect(decoded.average).toBeGreaterThan(45);
  expect(decoded.spread).toBeGreaterThan(22);
});
