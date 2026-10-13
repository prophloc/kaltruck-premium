import { test, expect } from '@playwright/test';

test('service list dashes are vertically centered and backdrop is 20 percent narrower', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector('.service-catalog__stage');
    const firstItem = document.querySelector('[data-service-panel][data-active="true"] [data-service-item]');
    const stageRect = stage?.getBoundingClientRect();
    const itemRect = firstItem?.getBoundingClientRect();
    const dash = firstItem ? getComputedStyle(firstItem, '::before') : null;
    const backdrop = stage ? getComputedStyle(stage, '::before') : null;

    const dashTop = dash ? Number.parseFloat(dash.top) : Number.NaN;
    const dashHeight = dash ? Number.parseFloat(dash.height) : Number.NaN;
    const dashTransform = dash?.transform ?? 'none';
    const transformMatch = dashTransform.match(/^matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^)]+)\)$/);
    const translateY = transformMatch ? Number.parseFloat(transformMatch[1]) : 0;
    const dashCenter = dashTop + dashHeight / 2 + translateY;
    const itemCenter = (itemRect?.height ?? 0) / 2;

    return {
      dashCenterDelta: Math.abs(dashCenter - itemCenter),
      backdropWidth: backdrop ? Number.parseFloat(backdrop.width) : 0,
      stageWidth: stageRect?.width ?? 0,
    };
  });

  expect(metrics.dashCenterDelta).toBeLessThanOrEqual(0.1);
  expect(metrics.backdropWidth / metrics.stageWidth).toBeGreaterThanOrEqual(0.89);
  expect(metrics.backdropWidth / metrics.stageWidth).toBeLessThanOrEqual(0.91);
});
