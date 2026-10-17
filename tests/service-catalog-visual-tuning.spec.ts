import { test, expect } from '@playwright/test';

test('service list dashes are centered and backdrop bounds contain counter and separator', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector('.service-catalog__stage');
    const firstItem = document.querySelector('[data-service-panel][data-active="true"] [data-service-item]');
    const counter = document.querySelector('[data-service-panel][data-active="true"] .service-document__meta strong');
    const separator = document.querySelector('[data-service-panel][data-active="true"] .service-document__underline');
    const controls = document.querySelector('.service-catalog__controls');
    const stageRect = stage?.getBoundingClientRect();
    const itemRect = firstItem?.getBoundingClientRect();
    const counterRect = counter?.getBoundingClientRect();
    const separatorRect = separator?.getBoundingClientRect();
    const controlsRect = controls?.getBoundingClientRect();
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
    const backdropAbsoluteLeft = (stageRect?.left ?? 0) + backdropLeft;
    const backdropRight = backdropAbsoluteLeft + backdropWidth;
    const backdropCenter = backdropAbsoluteLeft + backdropWidth / 2;
    const controlsCenter = controlsRect ? controlsRect.left + controlsRect.width / 2 : 9999;

    return {
      dashCenterDelta: Math.abs(dashCenter - itemCenter),
      backdropWidth,
      stageWidth: stageRect?.width ?? 0,
      counterRight: counterRect?.right ?? 9999,
      separatorRight: separatorRect?.right ?? 9999,
      backdropRight,
      controlsCenterDelta: Math.abs(controlsCenter - backdropCenter),
    };
  });

  expect(metrics.dashCenterDelta).toBeLessThanOrEqual(0.1);
  expect(metrics.backdropWidth / metrics.stageWidth).toBeGreaterThanOrEqual(0.89);
  expect(metrics.backdropWidth / metrics.stageWidth).toBeLessThanOrEqual(0.91);
  expect(metrics.counterRight).toBeLessThanOrEqual(metrics.backdropRight - 8);
  expect(metrics.separatorRight).toBeLessThanOrEqual(metrics.backdropRight);
  expect(metrics.controlsCenterDelta).toBeLessThanOrEqual(2);
});
