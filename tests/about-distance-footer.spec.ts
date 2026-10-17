import { test, expect } from '@playwright/test';

test('about hero uses two lines with gold experience accent', async ({ page }) => {
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const title = page.locator('[data-about-title]');
  const lines = title.locator('[data-about-title-line]');

  await expect(title).toBeVisible();
  await expect(lines).toHaveCount(2);
  await expect(lines.nth(0)).toHaveText('Sprzęt jest ważny.');
  await expect(lines.nth(1)).toHaveText('Doświadczenie ważniejsze.');
  await expect(title.locator('[data-about-title-accent]')).toHaveText('Doświadczenie');

  const accentColor = await title.locator('[data-about-title-accent]').evaluate((node) => getComputedStyle(node).color);
  expect(accentColor).not.toBe('rgb(255, 255, 255)');
});

test('footer exposes KALTRUCK base and Google route distance estimator', async ({ page }) => {
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const estimator = page.locator('[data-distance-estimator]');
  await expect(estimator).toBeVisible();
  await expect(estimator).toHaveAttribute('data-base-address', 'Tokarska 40, 09-401 Płock');
  await expect(estimator.locator('[data-distance-autocomplete-host]')).toBeVisible();
  await expect(estimator.locator('[data-distance-result]')).toContainText('km');

  const mapsLink = estimator.locator('[data-distance-base-link]');
  await expect(mapsLink).toContainText('Tokarska 40');
  await expect(mapsLink).toHaveAttribute('href', /google\.com\/maps/);

  const year = new Date().getFullYear().toString();
  await expect(page.locator('.footer-bottom')).toContainText(`© ${year}`);
});
