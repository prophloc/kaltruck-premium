import { test, expect } from '@playwright/test';

const uploadedPhotos = [
  '/images/realizacje/2026-10-17-dom-szkieletowy.webp',
  '/images/realizacje/2026-10-17-kontener-ustawianie.webp',
  '/images/realizacje/2026-10-17-budowa-materialy.webp',
  '/images/realizacje/2026-10-17-transport-drewna.webp',
  '/images/realizacje/2026-10-17-montaz-pylonu-reklamowego.webp',
  '/images/realizacje/2026-10-17-kontener-transport.webp',
];

test('uploaded HDS photos are serialized into the realization lightbox gallery', async ({ page }) => {
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  const data = await page.locator('[data-project-lightbox-data]').textContent();
  expect(data).toBeTruthy();
  for (const photo of uploadedPhotos) {
    expect(data).toContain(photo);
  }
});
