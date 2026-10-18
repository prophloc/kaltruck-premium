import { test, expect } from '@playwright/test';

test('short lightbox thumbnail sets stay centered with arrows immediately beside their edges', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const trigger = page.locator('[data-project-lightbox-category="Reklama i wydarzenia"]').first();
  await expect(trigger).toBeVisible();
  await trigger.click();

  const lightbox = page.locator('[data-project-lightbox]');
  const thumbs = lightbox.locator('[data-project-lightbox-thumb]');
  await expect(thumbs.first()).toBeVisible();
  expect(await thumbs.count()).toBeGreaterThan(1);

  const geometry = await page.evaluate(() => {
    const controls = document.querySelector('[data-project-lightbox-controls]');
    const prev = document.querySelector('[data-project-lightbox-prev]');
    const next = document.querySelector('[data-project-lightbox-next]');
    const items = [...document.querySelectorAll('[data-project-lightbox-thumb]')];
    if (!controls || !prev || !next || !items.length) return null;

    const controlsRect = controls.getBoundingClientRect();
    const prevRect = prev.getBoundingClientRect();
    const nextRect = next.getBoundingClientRect();
    const firstRect = items[0].getBoundingClientRect();
    const lastRect = items[items.length - 1].getBoundingClientRect();
    const groupCenter = (firstRect.left + lastRect.right) / 2;
    const controlsCenter = controlsRect.left + controlsRect.width / 2;

    return {
      thumbGroupCentered: Math.abs(groupCenter - controlsCenter) <= 12,
      prevGap: Math.round(firstRect.left - prevRect.right),
      nextGap: Math.round(nextRect.left - lastRect.right),
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.thumbGroupCentered).toBe(true);
  expect(geometry!.prevGap).toBeGreaterThanOrEqual(4);
  expect(geometry!.prevGap).toBeLessThanOrEqual(18);
  expect(geometry!.nextGap).toBeGreaterThanOrEqual(4);
  expect(geometry!.nextGap).toBeLessThanOrEqual(18);
});
