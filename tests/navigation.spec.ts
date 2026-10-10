import { test, expect } from '@playwright/test';

const labels = ['Usługi', 'Realizacje', 'Sprzęt', 'O nas', 'Kontakt'];

test('shared navigation exposes primary routes and conversion actions', async ({ page }) => {
  await page.goto('/');
  for (const label of labels) await expect(page.getByRole('link', { name: label, exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
});

test('navigation remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Usługi', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await context.close();
});
