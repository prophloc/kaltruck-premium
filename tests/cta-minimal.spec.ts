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

test('CTA heading stays on exactly two visual lines on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const lineCount = await page.evaluate(() => {
    const heading = document.querySelector('.cta h2');
    if (!heading) return 0;
    const range = document.createRange();
    range.selectNodeContents(heading);
    const tops = Array.from(range.getClientRects())
      .filter((rect) => rect.width > 1 && rect.height > 1)
      .map((rect) => Math.round(rect.top));
    return new Set(tops).size;
  });

  expect(lineCount).toBe(2);
});

test('CTA has a decorative map that fades upward from the bottom edge', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const map = document.querySelector('.cta-map');
    const style = map ? getComputedStyle(map) : null;
    const rect = map?.getBoundingClientRect();
    const section = document.querySelector('.cta')?.getBoundingClientRect();
    return {
      exists: Boolean(map),
      backgroundImage: style?.backgroundImage ?? 'none',
      maskImage: style?.maskImage ?? '',
      webkitMaskImage: style?.webkitMaskImage ?? '',
      height: rect?.height ?? 0,
      bottomDelta: section && rect ? Math.abs(section.bottom - rect.bottom) : 999,
      pointerEvents: style?.pointerEvents ?? '',
    };
  });

  expect(metrics.exists).toBe(true);
  expect(metrics.backgroundImage).not.toBe('none');
  expect(`${metrics.maskImage} ${metrics.webkitMaskImage}`).toContain('linear-gradient');
  expect(metrics.height).toBeGreaterThan(100);
  expect(metrics.bottomDelta).toBeLessThanOrEqual(2);
  expect(metrics.pointerEvents).toBe('none');
});
