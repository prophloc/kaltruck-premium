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

  const metrics = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll('.cta-heading-line'));
    return {
      count: lines.length,
      lineRatios: lines.map((line) => {
        const style = getComputedStyle(line);
        const lineHeight = Number.parseFloat(style.lineHeight);
        const height = line.getBoundingClientRect().height;
        return lineHeight > 0 ? height / lineHeight : 999;
      }),
      tops: lines.map((line) => line.getBoundingClientRect().top),
    };
  });

  expect(metrics.count).toBe(2);
  expect(metrics.lineRatios.every((ratio) => ratio <= 1.15)).toBe(true);
  expect(metrics.tops[1]).toBeGreaterThan(metrics.tops[0]);
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
