import { test, expect } from '@playwright/test';

test('FAQ changes the active plus into a minus and restores it when closed', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const firstDetails = page.locator('.faq-list details').first();
  const firstSummary = firstDetails.locator('summary');
  const icon = firstSummary.locator('[data-faq-icon]');

  await expect(icon).toHaveText('+');
  await firstSummary.click();
  await expect(firstDetails).toHaveAttribute('open', '');
  await expect(icon).toHaveText('−');

  await firstSummary.click();
  await expect(firstDetails).not.toHaveAttribute('open', '');
  await expect(icon).toHaveText('+');
});

test('process cards use consistent number and title anchors', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const cards = page.locator('[data-process-step]');
  const numbers = page.locator('[data-step-number]');
  const titles = page.locator('[data-step-title]');

  await expect(cards).toHaveCount(4);
  await expect(numbers).toHaveCount(4);
  await expect(titles).toHaveCount(4);

  const geometry = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-process-step]'));
    return cards.map((card) => {
      const number = card.querySelector<HTMLElement>('[data-step-number]');
      const title = card.querySelector<HTMLElement>('[data-step-title]');
      if (!number || !title) return null;
      const cardRect = card.getBoundingClientRect();
      const numberRect = number.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      return {
        height: cardRect.height,
        numberLeft: numberRect.left - cardRect.left,
        numberTop: numberRect.top - cardRect.top,
        titleLeft: titleRect.left - cardRect.left,
        titleBottom: cardRect.bottom - titleRect.bottom,
      };
    });
  });

  expect(geometry.every(Boolean)).toBe(true);
  const rows = geometry.filter((row): row is NonNullable<typeof row> => Boolean(row));
  const spread = (values: number[]) => Math.max(...values) - Math.min(...values);

  expect(spread(rows.map((row) => row.height))).toBeLessThanOrEqual(1);
  expect(spread(rows.map((row) => row.numberLeft))).toBeLessThanOrEqual(1);
  expect(spread(rows.map((row) => row.numberTop))).toBeLessThanOrEqual(1);
  expect(spread(rows.map((row) => row.titleLeft))).toBeLessThanOrEqual(1);
  expect(spread(rows.map((row) => row.titleBottom))).toBeLessThanOrEqual(2);
});

test('footer brand is centered in the whole free row between route and copyright line', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const geometry = await page.evaluate(() => {
    const route = document.querySelector<HTMLElement>('[data-google-route]');
    const footerBottom = document.querySelector<HTMLElement>('.footer-bottom');
    const logo = document.querySelector<HTMLElement>('.footer-brand img');
    const tagline = document.querySelector<HTMLElement>('.footer-brand p');
    if (!route || !footerBottom || !logo || !tagline) return null;

    const routeRect = route.getBoundingClientRect();
    const bottomRect = footerBottom.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const taglineRect = tagline.getBoundingClientRect();

    const contentTop = Math.min(logoRect.top, taglineRect.top);
    const contentBottom = Math.max(logoRect.bottom, taglineRect.bottom);
    const topSpace = contentTop - routeRect.bottom;
    const bottomSpace = bottomRect.top - contentBottom;

    return { topSpace, bottomSpace, delta: Math.abs(topSpace - bottomSpace) };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.topSpace).toBeGreaterThanOrEqual(16);
  expect(geometry!.bottomSpace).toBeGreaterThanOrEqual(16);
  expect(geometry!.delta).toBeLessThanOrEqual(8);
});
