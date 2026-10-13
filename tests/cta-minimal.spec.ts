import { test, expect } from '@playwright/test';

test('CTA uses a minimal frameless treatment on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector('.cta-panel');
    const style = panel ? getComputedStyle(panel) : null;
    return {
      backgroundImage: style?.backgroundImage ?? '',
      borderTopWidth: style?.borderTopWidth ?? '',
      borderRadius: style ? Number.parseFloat(style.borderRadius) : 999,
      boxShadow: style?.boxShadow ?? '',
      paddingLeft: style ? Number.parseFloat(style.paddingLeft) : 999,
      paddingRight: style ? Number.parseFloat(style.paddingRight) : 999,
    };
  });

  expect(metrics.backgroundImage).toBe('none');
  expect(metrics.borderTopWidth).toBe('0px');
  expect(metrics.borderRadius).toBeLessThanOrEqual(4);
  expect(metrics.boxShadow).toBe('none');
  expect(metrics.paddingLeft).toBeLessThanOrEqual(8);
  expect(metrics.paddingRight).toBeLessThanOrEqual(8);
});
