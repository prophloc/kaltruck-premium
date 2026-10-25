import { createHash } from 'node:crypto';
import { test, expect } from '@playwright/test';

test('homepage communicates the premium HDS offer without invented data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('CIĘŻKI ŁADUNEK?');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('MY GO RUSZYMY.');
  await expect(page.getByRole('link', { name: /Wyceń transport/i }).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();

  for (const href of ['/transport-kontenerow/', '/transport-prefabrykatow/', '/transport-maszyn/', '/rozladunek-hds/', '/transport-hds/']) {
    await expect(page.locator('.premium-service a[href="' + href + '"]')).toBeVisible();
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

test('homepage preserves original PNG but serves lightweight responsive WebP', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const png = await page.request.get('/images/home/hero-hds-original.png');
  expect(png.ok()).toBeTruthy();
  const bytes = await png.body();
  expect(bytes.byteLength).toBe(3_113_888);
  expect(createHash('sha256').update(bytes).digest('hex')).toBe('e50fe7b925406797a309348ccbcd463598e0b4e3514c131641c6db78e7a74f2b');
  const hero = page.locator('.hero-bg');
  await expect(hero).toHaveAttribute('src', '/images/home/hero-hds-desktop.webp');
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
  await expect(hero).toHaveAttribute('loading', 'eager');
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(2);
  for (const file of ['hero-hds-desktop.webp', 'hero-hds-mobile.webp']) {
    const response = await page.request.get(`/images/home/${file}`);
    expect(response.ok(), file).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/webp');
    expect((await response.body()).byteLength).toBeLessThan(bytes.byteLength);
  }
  const dimensions = await hero.evaluate((img: HTMLImageElement) => ({ width: img.naturalWidth, height: img.naturalHeight }));
  expect(dimensions).toEqual({ width: 1672, height: 941 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(hero).toHaveJSProperty('currentSrc', 'http://127.0.0.1:4321/images/home/hero-hds-mobile.webp');
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

test('redesigned services section has balanced heading and visible coverage copy', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const section = page.locator('.premium-services');
  await expect(section.locator('h2')).toContainText('Przewozimy.');
  await expect(section.locator('h2')).toContainText('Ustawiamy.');
  await expect(section.locator('.premium-service')).toHaveCount(5);
  const grid = await section.locator('.premium-services__grid').boundingBox();
  expect(grid).not.toBeNull();
  expect(grid!.width).toBeGreaterThan(900);
  await expect(page.locator('.coverage')).toContainText('Płock');
  await expect(page.locator('.coverage')).toContainText('Polsce');
});
