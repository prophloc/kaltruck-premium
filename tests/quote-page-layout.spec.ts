import { test, expect } from '@playwright/test';

test('desktop quote page shows its full request form alongside the headline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/wycena/', { waitUntil: 'domcontentloaded' });
  const heading = page.locator('.quote-intro h1');
  const form = page.locator('.quote-card [data-quote-form]');
  const card = page.locator('.quote-card');
  const [title, formRect, cardRect] = await Promise.all([heading.boundingBox(), form.boundingBox(), card.boundingBox()]);
  expect(title).not.toBeNull();
  expect(formRect).not.toBeNull();
  expect(cardRect).not.toBeNull();
  expect(cardRect!.x).toBeGreaterThan(title!.x + title!.width - 10);
  expect(cardRect!.y).toBeLessThan(300);
  expect(formRect!.x).toBeGreaterThan(title!.x);
  await expect(page.getByLabel('Telefon', { exact: true })).toBeVisible();
  await expect(heading.locator('.quote-accent')).toHaveText('stanąć?');
  const accentColor = await heading.locator('.quote-accent').evaluate((el) => getComputedStyle(el).color);
  expect(accentColor).toBe('rgb(215, 180, 106)');
});

for (const width of [390, 768]) {
  test(`quote form stacks below headline on ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/wycena/', { waitUntil: 'domcontentloaded' });
    const heading = await page.locator('.quote-intro').boundingBox();
    const card = await page.locator('.quote-card').boundingBox();
    expect(heading).not.toBeNull();
    expect(card).not.toBeNull();
    expect(card!.y).toBeGreaterThan(heading!.y + heading!.height);
    expect(card!.x).toBeGreaterThanOrEqual(0);
    expect(card!.x + card!.width).toBeLessThanOrEqual(width);
  });
}
