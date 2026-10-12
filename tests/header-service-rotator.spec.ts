import { test, expect } from '@playwright/test';

test('desktop header rotates through the full source-backed HDS service range', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const rotator = page.locator('[data-service-rotator]');
  await expect(rotator).toBeVisible();

  const services = await rotator.evaluate((node) => {
    const raw = node.getAttribute('data-services') || '[]';
    return JSON.parse(raw) as string[];
  });

  expect(services.length).toBeGreaterThanOrEqual(30);
  expect(services).toEqual(expect.arrayContaining([
    'Suwnice przemysłowe',
    'Domki holenderskie',
    'Stacje transformatorowe',
    'Prefabrykaty',
    'Maszyny rolnicze',
    'Łodzie i jachty',
    'Reklamy, billboardy i paczkomaty',
  ]));

  const label = rotator.locator('[data-service-rotator-label]');
  const first = (await label.textContent())?.trim();
  expect(first).toBeTruthy();

  await page.waitForTimeout(3200);
  const second = (await label.textContent())?.trim();
  expect(second).toBeTruthy();
  expect(second).not.toBe(first);
});

test('service rotator stays out of compressed navigation widths', async ({ page }) => {
  await page.setViewportSize({ width: 1170, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-service-rotator]')).toBeHidden();
});
