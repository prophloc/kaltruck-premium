import { test, expect } from '@playwright/test';

test('header uses source brand artwork and readable sales navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const brand = page.locator('[data-brand-logo]');
  await expect(brand).toHaveCount(1);
  await expect(brand).toHaveAttribute('src', /kaltruck-logo/);

  const brandBox = await brand.boundingBox();
  expect(brandBox?.width ?? 0).toBeGreaterThanOrEqual(165);
  expect(brandBox?.height ?? 0).toBeGreaterThanOrEqual(50);

  const navMetrics = await page.locator('.desktop-nav a').evaluateAll((nodes) => nodes.map((node) => {
    const style = getComputedStyle(node);
    return { fontSize: parseFloat(style.fontSize), fontWeight: parseInt(style.fontWeight, 10) || 0 };
  }));
  expect(navMetrics.length).toBeGreaterThanOrEqual(5);
  expect(navMetrics.every((item) => item.fontSize >= 15 && item.fontWeight >= 600)).toBeTruthy();

  const quoteBox = await page.locator('.quote-link').boundingBox();
  expect(quoteBox?.height ?? 0).toBeGreaterThanOrEqual(40);
  expect(quoteBox?.height ?? 999).toBeLessThanOrEqual(48);
});

test('header uses a deep top gradient instead of a blurred menu backdrop', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const gradient = await page.locator('[data-header]').evaluate((node) => {
    const style = getComputedStyle(node, '::before');
    return {
      backgroundImage: style.backgroundImage,
      height: parseFloat(style.height),
    };
  });

  expect(gradient.backgroundImage).toContain('linear-gradient');
  expect(gradient.height).toBeGreaterThanOrEqual(170);
});

test('hero keeps the sales message vertically centered and CTAs prominent', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const stage = page.locator('[data-commercial-hero]');
  await expect(stage).toHaveCount(1);
  const titleBox = await page.locator('.hero-title').boundingBox();
  expect(titleBox).not.toBeNull();
  const titleCenter = (titleBox!.y + titleBox!.height / 2) / 900;
  expect(titleCenter).toBeGreaterThan(0.30);
  expect(titleCenter).toBeLessThan(0.60);

  const buttons = page.locator('.hero-actions .btn');
  await expect(buttons).toHaveCount(2);
  const metrics = await buttons.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return { height: rect.height, fontSize: parseFloat(style.fontSize), fontWeight: parseInt(style.fontWeight, 10) || 0 };
  }));
  expect(metrics.every((item) => item.height >= 58 && item.fontSize >= 15 && item.fontWeight >= 700)).toBeTruthy();
});

test('hero centers the cinematic composition as one group', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const stageBox = await page.locator('.hero-stage').boundingBox();
  expect(stageBox).not.toBeNull();
  const stageCenter = stageBox!.x + stageBox!.width / 2;
  expect(Math.abs(stageCenter - 800)).toBeLessThanOrEqual(24);

  const leadBand = await page.locator('.hero-bottom-copy').boundingBox();
  const actions = await page.locator('.hero-actions').boundingBox();
  expect(leadBand).not.toBeNull();
  expect(actions).not.toBeNull();
  expect(leadBand!.y).toBeGreaterThan(actions!.y + actions!.height);
  expect(leadBand!.width).toBeGreaterThanOrEqual(1598);
});

test('desktop slogan stacks tightly, shares a right edge, and centers CTAs below the group', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const lineOne = await page.locator('.hero-title-line--one').boundingBox();
  const lineTwo = await page.locator('.hero-title-line--two').boundingBox();
  const actions = await page.locator('.hero-actions').boundingBox();
  expect(lineOne).not.toBeNull();
  expect(lineTwo).not.toBeNull();
  expect(actions).not.toBeNull();

  // Keep the first line where it already sits against the crane boom.
  expect(lineOne!.y).toBeGreaterThanOrEqual(330);
  expect(lineOne!.y).toBeLessThanOrEqual(410);
  expect(lineOne!.x).toBeGreaterThanOrEqual(390);
  expect(lineOne!.x).toBeLessThanOrEqual(500);

  // Pull the closing line closer and make it about 5px smaller at this desktop width.
  const verticalGap = lineTwo!.y - (lineOne!.y + lineOne!.height);
  expect(verticalGap).toBeGreaterThanOrEqual(-4);
  expect(verticalGap).toBeLessThanOrEqual(8);
  const lineTwoFontSize = await page.locator('.hero-title-line--two').evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
  expect(lineTwoFontSize).toBeGreaterThanOrEqual(60);
  expect(lineTwoFontSize).toBeLessThanOrEqual(61.5);

  // Fine tune the closing line exactly 5px left and 4px up on desktop.
  const lineTwoTransform = await page.locator('.hero-title-line--two').evaluate((node) => getComputedStyle(node).transform);
  const transformMatch = lineTwoTransform.match(/^matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*(-?[\d.]+),\s*(-?[\d.]+)\)$/);
  expect(transformMatch).not.toBeNull();
  expect(Number(transformMatch![1])).toBeCloseTo(-5, 1);
  expect(Number(transformMatch![2])).toBeCloseTo(-4, 1);

  const rightOne = lineOne!.x + lineOne!.width;
  const rightTwo = lineTwo!.x + lineTwo!.width;
  expect(Math.abs(rightOne - rightTwo)).toBeLessThanOrEqual(8);

  // CTAs should be centered under the visual width of the two-line slogan group.
  const groupLeft = Math.min(lineOne!.x, lineTwo!.x);
  const groupRight = Math.max(rightOne, rightTwo);
  const groupCenter = (groupLeft + groupRight) / 2;
  const actionsCenter = actions!.x + actions!.width / 2;
  expect(Math.abs(groupCenter - actionsCenter)).toBeLessThanOrEqual(12);
  expect(actions!.y).toBeGreaterThan(lineTwo!.y + lineTwo!.height);
});

test('hero omits the location pill after moving that statement into the intro', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.hero-kicker')).toHaveCount(0);
  await expect(page.locator('.intro .section-title')).toHaveText('Transport HDS • Płock • Polska');
});
