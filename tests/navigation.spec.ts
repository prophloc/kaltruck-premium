import { test, expect } from '@playwright/test';

const labels = ['Usługi', 'Realizacje', 'Sprzęt', 'O nas', 'Kontakt'];

test('shared navigation exposes primary routes and conversion actions', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  for (const label of labels) await expect(page.getByRole('link', { name: label, exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
});

for (const width of [899, 900, 1024, 1079, 1080]) {
  test(`primary navigation remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 820 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const desktopNav = page.locator('.desktop-nav');
    const menuButton = page.locator('[data-menu-open]');

    if (await desktopNav.isVisible()) {
      await expect(desktopNav.getByRole('link', { name: 'Usługi', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
    } else {
      await expect(menuButton).toBeVisible();
      await menuButton.click();
      await expect(page.locator('[data-mobile-menu]')).toBeVisible();
      await expect(page.locator('[data-mobile-menu]').getByRole('link', { name: 'Usługi', exact: true })).toBeVisible();
      await expect(page.locator('[data-mobile-menu]').getByRole('link', { name: /Wyceń transport/i })).toBeVisible();
    }
  });
}

test('navigation remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Usługi', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await context.close();
});
