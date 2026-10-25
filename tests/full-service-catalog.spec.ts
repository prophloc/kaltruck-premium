import { test, expect } from '@playwright/test';

const sourceCategories = [
  'Transport i montaż konstrukcji',
  'Budownictwo i infrastruktura',
  'Energetyka i przemysł',
  'Rolnictwo i rekreacja',
  'Reklama i wydarzenia',
];

test('transport HDS page exposes all 31 services grouped under the five original source categories', async ({ page }) => {
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const catalog = page.locator('[data-service-catalog]');
  const groups = catalog.locator('[data-service-panel] h2');
  await expect(groups).toHaveCount(5);
  await expect(groups).toHaveText(sourceCategories);

  const services = catalog.locator('[data-service-item]');
  await expect(services).toHaveCount(31);
  await expect(services).toContainText([
    'Magazynowanie i konserwacja kontenerów',
    'Transport i montaż suwnic',
    'Transport i osadzanie stacji transformatorowych',
    'Transport i osadzanie prefabrykatów',
    'Transport i rozładunek maszyn i urządzeń',
    'Transport i rozładunek maszyn rolniczych',
    'Transport i montaż reklam, billboardów i paczkomatów',
    'Obsługa imprez masowych i eventów',
  ]);
});

test('realizations keep the complete five-category structure from the original source files', async ({ page }) => {
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  const filters = page.locator('[data-project-filter]');
  await expect(filters).toHaveCount(6);
  await expect(filters).toHaveText(['Wszystkie', ...sourceCategories]);
});

test('desktop contact order is primary phone, quote pill, then email', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const hrefs = await page.locator('.header-actions > a').evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')),
  );

  expect(hrefs.slice(0, 3)).toEqual([
    'tel:+48784430022',
    '/wycena/',
    'mailto:hds.plock@gmail.com',
  ]);
});
