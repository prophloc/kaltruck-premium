import { test, expect } from '@playwright/test';

for (const width of [320, 390, 620]) {
  test(`mobile hero tools and CTAs stay usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const route = page.locator('[data-hero-route-toggle]');
    const reviews = page.locator('[data-hero-reviews-toggle]');
    const [routeBox, reviewsBox] = await Promise.all([route.boundingBox(), reviews.boundingBox()]);
    expect(routeBox).not.toBeNull();
    expect(reviewsBox).not.toBeNull();
    expect(routeBox!.y).toBeGreaterThanOrEqual(88);
    expect(Math.abs(routeBox!.y - reviewsBox!.y)).toBeLessThan(3);
    expect(routeBox!.x + routeBox!.width + 8).toBeLessThan(reviewsBox!.x);
    expect(reviewsBox!.x + reviewsBox!.width).toBeLessThanOrEqual(width);

    const actions = page.locator('.hero-actions .btn');
    const first = await actions.nth(0).boundingBox();
    const second = await actions.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(Math.abs(first!.y - second!.y)).toBeLessThan(3);
    expect(first!.x + first!.width).toBeLessThanOrEqual(second!.x);
    expect(second!.x + second!.width).toBeLessThanOrEqual(width);

    await route.click();
    await expect(page.locator('[data-hero-route-panel]')).toBeVisible();
    await reviews.click();
    await expect(page.locator('[data-hero-reviews-panel]')).toBeVisible();
    await expect(route).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Escape');
    await expect(reviews).toHaveAttribute('aria-expanded', 'false');
  });
}

test('mobile menu closes with a centered X and keeps both phone numbers side by side', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-menu-open]').click();
  const close = page.locator('[data-menu-close]');
  await expect(close.locator('.mobile-menu__close-icon')).toHaveCount(1);
  const position = await close.evaluate((button) => {
    const buttonBox = button.getBoundingClientRect();
    const markBox = button.querySelector('.mobile-menu__close-icon')!.getBoundingClientRect();
    return {
      dx: (markBox.left + markBox.width / 2) - (buttonBox.left + buttonBox.width / 2),
      dy: (markBox.top + markBox.height / 2) - (buttonBox.top + buttonBox.height / 2),
    };
  });
  expect(Math.abs(position.dx)).toBeLessThan(1);
  expect(Math.abs(position.dy)).toBeLessThan(1);

  const numbers = page.locator('.mobile-contact__phone');
  const first = await numbers.nth(0).boundingBox();
  const second = await numbers.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(3);
  expect(second!.x).toBeGreaterThan(first!.x + first!.width);
  await close.click();
  await expect(page.locator('[data-mobile-menu]')).not.toBeVisible();
});
