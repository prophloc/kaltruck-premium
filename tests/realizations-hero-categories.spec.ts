import { test, expect } from '@playwright/test';

const parentCategories = [
  'Transport i montaż konstrukcji',
  'Budownictwo i infrastruktura',
  'Energetyka i przemysł',
  'Rolnictwo i rekreacja',
  'Reklama i wydarzenia',
];

test('realizations hero shows exactly one thumbnail per parent category pulled ten percent closer to the headline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const cards = page.locator('[data-realization-project-card]');
  await expect(cards).toHaveCount(5);

  const categories = await cards.evaluateAll((elements) => elements.map((el) => el.getAttribute('data-realization-category')));
  expect(new Set(categories).size).toBe(5);
  expect([...categories].sort()).toEqual([...parentCategories].sort());

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('.page-head-grid')?.getBoundingClientRect();
    const copy = document.querySelector('.page-head-copy')?.getBoundingClientRect();
    const panel = document.querySelector('.realization-category-preview')?.getBoundingClientRect();
    const grid = document.querySelector('.realization-category-grid')?.getBoundingClientRect();
    const cards = [...document.querySelectorAll('[data-realization-project-card]')]
      .map((el) => el.getBoundingClientRect());

    if (!hero || !copy || !panel || !grid || !cards.length) return null;

    const heroCenterY = hero.top + hero.height / 2;
    const panelCenterX = panel.left + panel.width / 2;
    const panelCenterY = panel.top + panel.height / 2;
    const averageCardWidth = cards.reduce((sum, rect) => sum + rect.width, 0) / cards.length;
    const averageCardHeight = cards.reduce((sum, rect) => sum + rect.height, 0) / cards.length;
    const lastCard = cards[cards.length - 1];

    return {
      heroWidth: hero.width,
      copyInset: copy.left - hero.left,
      panelCenterRatio: (panelCenterX - hero.left) / hero.width,
      heroCenterY,
      panelCenterY,
      averageCardWidth,
      averageCardHeight,
      gridCenterX: grid.left + grid.width / 2,
      lastCardCenterX: lastCard.left + lastCard.width / 2,
      firstCardWidth: cards[0].width,
      lastCardWidth: lastCard.width,
    };
  });

  expect(metrics).not.toBeNull();
  expect(metrics!.copyInset / metrics!.heroWidth).toBeGreaterThan(0.045);
  expect(metrics!.copyInset / metrics!.heroWidth).toBeLessThan(0.055);
  expect(metrics!.panelCenterRatio).toBeGreaterThan(0.695);
  expect(metrics!.panelCenterRatio).toBeLessThan(0.705);
  expect(Math.abs(metrics!.panelCenterY - metrics!.heroCenterY)).toBeLessThan(24);
  expect(metrics!.averageCardWidth).toBeGreaterThan(190);
  expect(metrics!.averageCardHeight).toBeGreaterThanOrEqual(102);
  expect(Math.abs(metrics!.lastCardCenterX - metrics!.gridCenterX)).toBeLessThan(2);
  expect(Math.abs(metrics!.lastCardWidth - metrics!.firstCardWidth)).toBeLessThan(2);
});

test('realization thumbnails use brighter photos and centered blurred category strips with two pixel larger labels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const card = page.locator('[data-realization-project-card]').first();
  const category = await card.getAttribute('data-realization-category');
  expect(category).toBeTruthy();

  const appearance = await card.evaluate((el) => {
    const image = el.querySelector('img');
    const label = el.querySelector('span');
    if (!image || !label) return null;

    const cardRect = el.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const imageStyle = getComputedStyle(image);
    const labelStyle = getComputedStyle(label);

    return {
      filter: imageStyle.filter,
      labelCenterOffset: Math.abs((labelRect.top + labelRect.height / 2) - (cardRect.top + cardRect.height / 2)),
      backdropFilter: labelStyle.backdropFilter || labelStyle.webkitBackdropFilter,
      labelText: label.textContent?.trim() ?? '',
      fontSize: Number.parseFloat(labelStyle.fontSize),
    };
  });

  expect(appearance).not.toBeNull();
  expect(appearance!.filter).toContain('brightness(0.82)');
  expect(appearance!.labelCenterOffset).toBeLessThan(2);
  expect(appearance!.backdropFilter).toContain('blur(');
  expect(appearance!.fontSize).toBeGreaterThanOrEqual(15);
  await expect(card.locator('span')).toHaveText(category!);
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
