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

test('footer embeds Google Maps directions and keeps route on our page', async ({ page }) => {
  await page.route('https://www.google.com/maps/embed/**', (route) => route.abort());
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const routeMap = page.locator('[data-google-route]');
  await expect(routeMap).toBeVisible();
  await expect(routeMap).toHaveAttribute('data-base-address', 'Tokarska 40, 09-401 Płock');

  const iframe = routeMap.locator('iframe[data-google-route-map]');
  await expect(iframe).toHaveCount(1);
  await expect(routeMap.locator('form[data-google-route-form]')).toBeVisible();
  await expect(routeMap.locator('input[data-google-route-origin]')).toBeVisible();

  // CI intentionally has no production Maps key. Inject a fake key only to verify
  // that submitting an origin switches the embedded Google map to directions mode.
  await routeMap.evaluate((node) => node.setAttribute('data-api-key', 'test-key'));
  await routeMap.locator('input[data-google-route-origin]').fill('Warszawa');
  await routeMap.locator('form[data-google-route-form]').evaluate((form: HTMLFormElement) => form.requestSubmit());

  await expect(iframe).toHaveAttribute('src', /google\.com\/maps\/embed\/v1\/directions/);
  const src = await iframe.getAttribute('src');
  expect(src).toContain('origin=Warszawa');
  expect(src).toContain('destination=Tokarska+40%2C+09-401+P%C5%82ock');
  expect(src).toContain('mode=driving');
  expect(src).toContain('units=metric');

  const year = new Date().getFullYear().toString();
  await expect(page.locator('.footer-bottom')).toContainText(`© ${year}`);
});
