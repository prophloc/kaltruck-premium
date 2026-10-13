import { test, expect } from '@playwright/test';

const categories = [
  'Transport i montaż konstrukcji',
  'Budownictwo i infrastruktura',
  'Energetyka i przemysł',
  'Rolnictwo i rekreacja',
  'Reklama i wydarzenia',
];

test('realizations hero shows five compact category thumbnails on the right', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const cards = page.locator('[data-realization-category-card]');
  await expect(cards).toHaveCount(5);

  for (const category of categories) {
    const card = page.locator(`[data-realization-category-card="${category}"]`);
    await expect(card).toBeVisible();
    await expect(card.locator('img')).toBeVisible();
    await expect(card).toContainText(category);
  }

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('.page-head-grid')?.getBoundingClientRect();
    const cards = [...document.querySelectorAll('[data-realization-category-card]')].map((el) => el.getBoundingClientRect());
    return {
      heroMid: hero ? hero.left + hero.width / 2 : 0,
      minCardLeft: cards.length ? Math.min(...cards.map((rect) => rect.left)) : 0,
      maxCardBottom: cards.length ? Math.max(...cards.map((rect) => rect.bottom)) : 9999,
      heroBottom: hero?.bottom ?? 0,
    };
  });

  expect(metrics.minCardLeft).toBeGreaterThan(metrics.heroMid - 24);
  expect(metrics.maxCardBottom).toBeLessThanOrEqual(metrics.heroBottom + 24);
});

test('clicking a hero category selects the matching gallery filter', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const category = 'Energetyka i przemysł';
  await page.locator(`[data-realization-category-card="${category}"]`).click();

  const filter = page.locator(`[data-project-filter="${category}"]`);
  await expect(filter).toHaveAttribute('aria-pressed', 'true');

  await expect.poll(
    () => page.locator('[data-project-gallery]').evaluate((el) => el.getBoundingClientRect().top),
    { timeout: 3000 },
  ).toBeLessThan(220);
});
