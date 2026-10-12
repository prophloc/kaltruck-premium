import { test, expect } from '@playwright/test';

test('transport HDS hero presents the full service catalog as five document panels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const catalog = page.locator('[data-service-catalog]');
  await expect(catalog).toBeVisible();
  await expect(catalog.locator('[data-service-panel]')).toHaveCount(5);
  await expect(catalog.locator('[data-service-item]')).toHaveCount(31);
  await expect(catalog.locator('[data-service-panel][data-active="true"]')).toHaveCount(1);

  const heroContainsCatalog = await page.evaluate(() => {
    const hero = document.querySelector('.service-hero');
    const catalog = document.querySelector('[data-service-catalog]');
    return Boolean(hero && catalog && hero.contains(catalog));
  });
  expect(heroContainsCatalog).toBeTruthy();

  await expect(page.locator('.service-body').getByRole('heading', { name: 'Pełny zakres usług HDS' })).toHaveCount(0);
});

test('service catalog controls switch the visible document panel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const catalog = page.locator('[data-service-catalog]');
  const panels = catalog.locator('[data-service-panel]');
  await expect(panels.nth(0)).toHaveAttribute('data-active', 'true');

  await catalog.locator('[data-service-nav-index="1"]').click();

  await expect(panels.nth(0)).toHaveAttribute('data-active', 'false');
  await expect(panels.nth(1)).toHaveAttribute('data-active', 'true');
  await expect(panels.nth(1).getByRole('heading', { name: 'Budownictwo i infrastruktura' })).toBeVisible();
});

test('service catalog fits the hero on desktop and stacks safely on mobile', async ({ page }) => {
  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

    const geometry = await page.locator('[data-service-catalog]').evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        viewport: document.documentElement.clientWidth,
      };
    });

    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
  }
});
