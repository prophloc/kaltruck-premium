import { test, expect } from '@playwright/test';

test('quote form has accessible labels and required commercial fields', async ({ page }) => {
  await page.goto('/wycena/');
  for (const label of ['Imię / firma', 'Telefon', 'E-mail', 'Co przewozimy?', 'Skąd', 'Dokąd', 'Wymiary / waga', 'Preferowany termin', 'Wiadomość']) {
    await expect(page.getByLabel(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByLabel('Telefon', { exact: true })).toHaveAttribute('required', '');
  await expect(page.getByLabel('Co przewozimy?', { exact: true })).toHaveAttribute('required', '');
  await expect(page.getByLabel('Skąd', { exact: true })).toHaveAttribute('required', '');
  await expect(page.getByLabel('Dokąd', { exact: true })).toHaveAttribute('required', '');
  await expect(page.getByLabel('Wymiary / waga', { exact: true })).not.toHaveAttribute('required', '');
});

test('missing submit endpoint is explicit instead of silently dropping leads', async ({ page }) => {
  await page.goto('/wycena/');
  const form = page.locator('form[data-quote-form]');
  const endpoint = await form.getAttribute('action');
  if (!endpoint) {
    await expect(page.locator('.quote-shell .fallback')).toBeVisible();
    await expect(page.getByRole('button', { name: /Wyślij/i })).toBeDisabled();
  }
});
