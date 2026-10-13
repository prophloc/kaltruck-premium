import { test, expect } from '@playwright/test';

test('realizations hero shows all ten realization thumbnails centered in the right half', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const cards = page.locator('[data-realization-project-card]');
  await expect(cards).toHaveCount(10);

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('.page-head-grid')?.getBoundingClientRect();
    const panel = document.querySelector('.realization-category-preview')?.getBoundingClientRect();
    const cards = [...document.querySelectorAll('[data-realization-project-card]')]
      .map((el) => el.getBoundingClientRect());

    if (!hero || !panel || !cards.length) return null;

    const rightHalfCenterX = hero.left + hero.width * .75;
    const heroCenterY = hero.top + hero.height / 2;
    const panelCenterX = panel.left + panel.width / 2;
    const panelCenterY = panel.top + panel.height / 2;
    const averageCardWidth = cards.reduce((sum, rect) => sum + rect.width, 0) / cards.length;

    return {
      rightHalfCenterX,
      heroCenterY,
      panelCenterX,
      panelCenterY,
      averageCardWidth,
      minCardLeft: Math.min(...cards.map((rect) => rect.left)),
      heroMid: hero.left + hero.width / 2,
    };
  });

  expect(metrics).not.toBeNull();
  expect(Math.abs(metrics!.panelCenterX - metrics!.rightHalfCenterX)).toBeLessThan(24);
  expect(Math.abs(metrics!.panelCenterY - metrics!.heroCenterY)).toBeLessThan(24);
  expect(metrics!.averageCardWidth).toBeGreaterThan(190);
  expect(metrics!.minCardLeft).toBeGreaterThanOrEqual(metrics!.heroMid - 8);
});

test('clicking a realization thumbnail selects its matching gallery category', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const card = page.locator('[data-realization-project-card]').first();
  const category = await card.getAttribute('data-realization-category');
  expect(category).toBeTruthy();
  await card.click();

  const filter = page.locator(`[data-project-filter="${category}"]`);
  await expect(filter).toHaveAttribute('aria-pressed', 'true');

  await expect.poll(
    () => page.locator('[data-project-gallery]').evaluate((el) => el.getBoundingClientRect().top),
    { timeout: 3000 },
  ).toBeLessThan(220);
});
