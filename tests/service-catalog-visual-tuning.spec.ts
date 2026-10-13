import { test, expect } from '@playwright/test';

test('service list dashes are vertically centered, backdrop is narrower and counter stays inside it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector('.service-catalog__stage');
    const firstItem = document.querySelector('[data-service-panel][data-active="true"] [data-service-item]');
    const counter = document.querySelector('[data-service-panel][data-active="true"] .service-document__meta strong');
    const stageRect = stage?.getBoundingClientRect();
    const itemRect = firstItem?.getBoundingClientRect();
    const counterRect = counter?.getBoundingClientRect();
    const dash = firstItem ? getComputedStyle(firstItem, '::before') : null;
    const backdrop = stage ? getComputedStyle(stage, '::before') : null;

    const dashTop = dash ? Number.parseFloat(dash.top) : Number.NaN;
    const dashHeight = dash ? Number.parseFloat(dash.height) : Number.NaN;
    const dashTransform = dash?.transform ?? 'none';
    const transformMatch = dashTransform.match(/^matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^)]+)\)$/);
    const translateY = transformMatch ? Number.parseFloat(transformMatch[1]) : 0;
    const dashCenter = dashTop + dashHeight / 2 + translateY;
    const itemCenter = (itemRect?.height ?? 0) / 2;
    const backdropLeft = backdrop ? Number.parseFloat(backdrop.left) : 0;
    const backdropWidth = backdrop ? Number.parseFloat(backdrop.width) : 0;
    const backdropRight = (stageRect?.left ?? 0) + backdropLeft + backdropWidth;

    return {
      dashCenterDelta: Math.abs(dashCenter - itemCenter),
      backdropWidth,
      stageWidth: stageRect?.width ?? 0,
      counterRight: counterRect?.right ?? 9999,
      backdropRight,
    };
  });

  expect(metrics.dashCenterDelta).toBeLessThanOrEqual(0.1);
  expect(metrics.backdropWidth / metrics.stageWidth).toBeGreaterThanOrEqual(0.89);
  expect(metrics.backdropWidth / metrics.stageWidth).toBeLessThanOrEqual(0.91);
  expect(metrics.counterRight).toBeLessThanOrEqual(metrics.backdropRight - 8);
});
