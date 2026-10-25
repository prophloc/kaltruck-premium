import { test, expect } from '@playwright/test';

test('desktop header keeps the service rotator text-only and exposes the primary phone plus email', async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 900 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-service-rotator]')).toBeVisible();
  await expect(page.locator('.service-rotator-mark')).toHaveCount(0);

  const contacts = page.locator('.header-actions');
  await expect(contacts.locator('a[href="tel:+48784430022"]')).toBeVisible();
  await expect(contacts.locator('a[href="mailto:hds.plock@gmail.com"]')).toBeVisible();
});

test('mobile menu exposes the primary phone and email', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-menu-open]').click();

  const menu = page.locator('[data-mobile-menu]');
  await expect(menu.locator('a.mobile-contact__phone[href="tel:+48784430022"]')).toBeVisible();
  await expect(menu.locator('a[href="mailto:hds.plock@gmail.com"]')).toBeVisible();
});

test('realizations expose the five source categories and filter to real source-backed projects', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const filters = page.locator('[data-project-filter]');
  await expect(filters).toHaveCount(6);
  await expect(filters).toContainText([
    'Wszystkie',
    'Transport i montaż konstrukcji',
    'Budownictwo i infrastruktura',
    'Energetyka i przemysł',
    'Rolnictwo i rekreacja',
    'Reklama i wydarzenia',
  ]);

  await page.getByRole('button', { name: 'Rolnictwo i rekreacja', exact: true }).click();
  const agriculture = page.locator('[data-project-group="Rolnictwo i rekreacja"]:visible');
  await expect(agriculture).toHaveCount(1);
  await expect(agriculture).toContainText('Maszyny rolnicze');

  await page.getByRole('button', { name: 'Reklama i wydarzenia', exact: true }).click();
  const advertising = page.locator('[data-project-group="Reklama i wydarzenia"]:visible');
  await expect(advertising).toHaveCount(1);
  await expect(advertising).toContainText('Billboardy i reklamy');
});
