import { test, expect } from '@playwright/test';

test('desktop lightbox scales a small active photo up to use the available stage without distorting it', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });

  await page.route('https://hdsplock.pl/zdj/realizacje/transport-kontenerow-03.jpg', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect width="320" height="240" fill="#222"/></svg>',
    });
  });

  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-project-group]').first().locator('[data-project-lightbox-open]').click();

  const image = page.locator('[data-project-lightbox-image]');

  await expect.poll(
    () => image.evaluate((node) => {
      const img = node as HTMLImageElement;
      return img.complete && img.naturalWidth === 320 && img.naturalHeight === 240;
    }),
    { timeout: 5000 },
  ).toBe(true);

  const geometry = await image.evaluate((node) => {
    const img = node as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const maxWidth = Math.min(1380, window.innerWidth - 150);
    const maxHeight = window.innerHeight - 165;
    return {
      stageUse: Math.max(rect.width / maxWidth, rect.height / maxHeight),
      displayedRatio: rect.width / rect.height,
      naturalRatio: img.naturalWidth / img.naturalHeight,
    };
  });

  expect(geometry.stageUse).toBeGreaterThanOrEqual(0.9);
  expect(Math.abs(geometry.displayedRatio - geometry.naturalRatio)).toBeLessThan(0.02);
});
