import { createHash } from 'node:crypto';
import { test, expect } from '@playwright/test';

test('homepage communicates the premium HDS offer without invented data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('CIĘŻKI ŁADUNEK?');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ZOSTAW TO NAM!');
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();

  for (const theme of ['Kontenery', 'Prefabrykaty', 'Maszyny', 'Precyzyjne ustawienie', 'Transport specjalistyczny']) {
    await expect(page.getByText(theme, { exact: false }).first()).toBeVisible();
  }

  // Deliberately broken visual lines must retain accessible, natural heading text.
  const processHeadings = page.locator('[data-process-step] h3');
  await expect(processHeadings).toHaveCount(4);
  for (const [index, [first, second]] of [
    ['Kontakt /', 'zapytanie'],
    ['Ocena ładunku', 'i warunków'],
    ['Wycena', 'i termin'],
    ['Transport', 'i ustawienie'],
  ].entries()) {
    await expect(processHeadings.nth(index).locator('span')).toHaveText([first, second]);
  }

  // Studio-style card copy is horizontally centered, not bottom-left.
  for (const heading of await processHeadings.all()) {
    const centerDelta = await heading.evaluate((node) => {
      const card = node.closest('[data-process-step]')?.getBoundingClientRect();
      const title = node.getBoundingClientRect();
      return card ? Math.abs(title.left + title.width / 2 - (card.left + card.width / 2)) : 1000;
    });
    expect(centerDelta).toBeLessThanOrEqual(3);
  }
});

test('homepage hero uses the exact supplied PNG artwork', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const expectedSrc = '/images/home/hero-hds-original.png';
  const heroImage = page.locator('.hero-bg');
  await expect(heroImage).toHaveAttribute('src', expectedSrc);

  const assetResponse = await page.request.get(expectedSrc);
  expect(assetResponse.ok()).toBeTruthy();
  expect(assetResponse.headers()['content-type']).toContain('image/png');
  const assetBytes = await assetResponse.body();
  expect(assetBytes.byteLength).toBe(3_113_888);
  expect(createHash('sha256').update(assetBytes).digest('hex')).toBe('e50fe7b925406797a309348ccbcd463598e0b4e3514c131641c6db78e7a74f2b');

  const decoded = await heroImage.evaluate((img: HTMLImageElement) => ({
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));

  expect(decoded.width).toBe(1672);
  expect(decoded.height).toBe(941);
});

test('capability strip centers clean data without decorative indexes', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const strip = page.locator('.cap-strip');
  await expect(strip).toBeVisible();
  await expect(strip.locator('.cap-intro')).toContainText('KALTRUCK / MOŻLIWOŚCI');

  const items = strip.locator('.cap-item');
  await expect(items).toHaveCount(4);
  await expect(strip.locator('.cap-index')).toHaveCount(0);
  await expect(strip.locator('.cap-value')).toHaveText(['10+', '12 t', '14 m', 'CAŁA POLSKA']);

  const alignment = await items.evaluateAll((nodes) => nodes.map((node) => {
    const item = node.getBoundingClientRect();
    const value = node.querySelector('.cap-value')!.getBoundingClientRect();
    const label = node.querySelector('.cap-label')!.getBoundingClientRect();
    return {
      itemCenter: item.x + item.width / 2,
      valueCenter: value.x + value.width / 2,
      labelCenter: label.x + label.width / 2,
      textAlign: getComputedStyle(node).textAlign,
    };
  }));

  for (const metric of alignment) {
    expect(Math.abs(metric.itemCenter - metric.valueCenter)).toBeLessThanOrEqual(3);
    expect(Math.abs(metric.itemCenter - metric.labelCenter)).toBeLessThanOrEqual(3);
    expect(metric.textAlign).toBe('center');
  }

  const metrics = await strip.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return { height: rect.height, backgroundImage: style.backgroundImage };
  });
  expect(metrics.height).toBeGreaterThanOrEqual(130);
  expect(metrics.height).toBeLessThanOrEqual(190);
  expect(metrics.backgroundImage).toContain('linear-gradient');
});

test('intro location lockup is smaller, clean, and vertically balanced', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.hero-kicker')).toHaveCount(0);

  const intro = page.locator('.intro');
  const title = intro.locator('.section-title');
  await expect(title).not.toContainText('•');
  await expect(title.locator('.intro-location-main')).toHaveText('Transport HDS');
  await expect(title.locator('.intro-location-sub')).toHaveText('Płock Polska');

  const titleFontSize = await title.evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  expect(titleFontSize).toBeGreaterThanOrEqual(50);
  expect(titleFontSize).toBeLessThanOrEqual(52);

  const subTransform = await title.locator('.intro-location-sub').evaluate((node) => getComputedStyle(node).transform);
  const transformMatch = subTransform.match(/^matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+),\s*(-?[\d.]+)\)$/);
  expect(transformMatch).not.toBeNull();
  expect(Number(transformMatch![2])).toBeCloseTo(5, 1);

  const centers = await intro.evaluate(() => {
    const left = document.querySelector('.intro-heading')!.getBoundingClientRect();
    const right = document.querySelector('.intro-copy')!.getBoundingClientRect();
    return {
      left: left.top + left.height / 2,
      right: right.top + right.height / 2,
    };
  });
  expect(Math.abs(centers.left - centers.right)).toBeLessThanOrEqual(5);

  const introBox = await intro.boundingBox();
  expect(introBox).not.toBeNull();
  expect(introBox!.height).toBeLessThanOrEqual(470);
});
