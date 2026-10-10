import { test, expect } from '@playwright/test';

test('homepage communicates the premium HDS offer without invented data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('TRANSPORT, KTÓRY');
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();

  for (const theme of ['Kontenery', 'Prefabrykaty', 'Maszyny', 'Precyzyjne ustawienie', 'Transport specjalistyczny']) {
    await expect(page.getByText(theme, { exact: false }).first()).toBeVisible();
  }

  for (const step of ['Kontakt', 'Ocena ładunku', 'Wycena i termin', 'Transport i ustawienie']) {
    await expect(page.getByText(step, { exact: false }).first()).toBeVisible();
  }
});
