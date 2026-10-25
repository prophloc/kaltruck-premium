import { test, expect } from '@playwright/test';

for (const width of [320, 390, 620]) {
  test(`Die Glanzies mobile hero and service slider remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.topbar .brand')).toBeVisible();
    await expect(page.locator('.main-title')).toBeVisible();
    await expect(page.locator('.nav-cta')).toBeVisible();
    await expect(page.locator('.badge-phone')).toBeVisible();
    await expect(page.locator('#nextBtn')).toBeVisible();
    await page.locator('#nextBtn').click();
    await expect(page.locator('#activeServiceTitle')).toHaveText('Transport prefabrykatów');
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth
    }));
    expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewport);
  });
}

test('mobile benefits and contact sections stack into one column', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('.feature-card');
  await expect(cards).toHaveCount(4);
  const rects = await cards.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect()));
  expect(rects[1].top).toBeGreaterThan(rects[0].bottom - 1);
  const sections = page.locator('.contact-card, .contact-side');
  await expect(sections).toHaveCount(2);
  const first = await sections.nth(0).boundingBox();
  const second = await sections.nth(1).boundingBox();
  expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1);
});
