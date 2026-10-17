import { test, expect } from '@playwright/test';

const buildingMaterialPhotos = Array.from(
  { length: 7 },
  (_, index) => `https://hdsplock.pl/zdj/realizacje/materia-y-budowlane-${String(index + 1).padStart(2, '0')}.jpg`,
);

test('building materials HDS photos are serialized into the realization lightbox gallery', async ({ page }) => {
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  const data = await page.locator('[data-project-lightbox-data]').textContent();
  expect(data).toBeTruthy();

  for (const photo of buildingMaterialPhotos) {
    expect(data).toContain(photo);
  }
});
