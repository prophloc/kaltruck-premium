import { test, expect } from '@playwright/test';

const uploadedPhotos = [
  '/images/realizations/kaltruck-dom-szkieletowy-01.webp',
  '/images/realizations/kaltruck-kontener-01.webp',
  '/images/realizations/kaltruck-budowa-hds-01.webp',
  '/images/realizations/kaltruck-drewno-hds-01.webp',
  '/images/realizations/kaltruck-pylon-reklamowy-01.webp',
  '/images/realizations/kaltruck-kontener-02.webp',
];

test('six uploaded KALTRUCK photos are serialized into realization lightbox galleries', async ({ page, request }) => {
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  const data = await page.locator('[data-project-lightbox-data]').textContent();
  expect(data).toBeTruthy();

  for (const photo of uploadedPhotos) {
    expect(data).toContain(photo);
    const response = await request.get(photo);
    expect(response.status(), photo).toBe(200);
  }
});
