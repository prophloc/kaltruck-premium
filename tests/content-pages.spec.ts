import { test, expect } from '@playwright/test';

for (const path of ['/realizacje/', '/sprzet/', '/o-nas/', '/kontakt/']) {
  test(`${path} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('realizations gallery ships semantic images without client filtering dependency', async ({ page }) => {
  await page.goto('/realizacje/');
  const images = page.locator('[data-project-gallery] img');
  expect(await images.count()).toBeGreaterThan(3);
  for (let i = 0; i < await images.count(); i++) {
    const image = images.nth(i);
    expect((await image.getAttribute('alt'))?.trim().length).toBeGreaterThan(3);
    expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0);
  }
});
