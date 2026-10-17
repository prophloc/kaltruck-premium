import { test, expect } from '@playwright/test';

const uploadedRealizationImages = [
  '/images/realizations/kaltruck-dom-szkieletowy-01.webp',
  '/images/realizations/kaltruck-kontener-01.webp',
  '/images/realizations/kaltruck-budowa-hds-01.webp',
  '/images/realizations/kaltruck-drewno-hds-01.webp',
  '/images/realizations/kaltruck-pylon-reklamowy-01.webp',
  '/images/realizations/kaltruck-kontener-02.webp',
];

test('uploaded realization photos keep full-resolution source pixels for the fullscreen lightbox', async ({ page }) => {
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  for (const src of uploadedRealizationImages) {
    const dimensions = await page.evaluate(async (imageSrc) => {
      const image = new Image();
      image.src = imageSrc;
      await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    }, src);

    expect(Math.min(dimensions.width, dimensions.height), `${src} should not be a thumbnail-sized proxy`).toBeGreaterThanOrEqual(1200);
  }
});
