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

test('new premium hero shows the offer, contact actions and layered service cards', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-commercial-hero]')).toHaveCount(1);
  const title = page.locator('.kt-hero-title');
  await expect(title).toContainText('ŁADUNEK?');
  await expect(title).toContainText('MY GO RUSZYMY.');
  const actions = page.locator('.kt-hero-actions .btn');
  await expect(actions).toHaveCount(2);
  await expect(actions.first()).toHaveAttribute('href', '/wycena/');
  await expect(actions.nth(1)).toHaveAttribute('href', /tel:/);

  const metrics = await actions.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return { height: rect.height, fontSize: parseFloat(style.fontSize), fontWeight: parseInt(style.fontWeight, 10) || 0 };
  }));
  expect(metrics.every((item) => item.height >= 52 && item.fontSize >= 13 && item.fontWeight >= 700)).toBeTruthy();
  await expect(page.locator('[data-kt-card]')).toHaveCount(3);
  await expect(page.locator('[data-kt-card][data-pos="0"]')).toBeVisible();
  await expect(page.locator('.hero-bottom-copy')).toContainText('ROZŁADUNEK HDS');
});

test('hero is centered and the feature band sits below the sales actions', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const stageBox = await page.locator('.hero-stage').boundingBox();
  const bandBox = await page.locator('.hero-bottom-copy').boundingBox();
  const actionsBox = await page.locator('.kt-hero-actions').boundingBox();
  expect(stageBox).not.toBeNull();
  expect(bandBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(Math.abs(stageBox!.x + stageBox!.width / 2 - 800)).toBeLessThanOrEqual(24);
  expect(bandBox!.y).toBeGreaterThan(actionsBox!.y + actionsBox!.height);
  expect(bandBox!.width).toBeGreaterThanOrEqual(1598);
});

test('service carousel switches cards with buttons, dots and keyboard without making inactive links focusable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('[data-kt-card]');
  const dots = page.locator('[data-kt-dot]');
  await expect(cards.nth(0)).toHaveAttribute('data-pos', '0');
  await expect(cards.nth(1)).toHaveAttribute('aria-hidden', 'true');

  await page.locator('[data-kt-next]').click();
  await expect(cards.nth(1)).toHaveAttribute('data-pos', '0');
  await expect(dots.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(cards.nth(0).locator('a')).toHaveAttribute('tabindex', '-1');
  await expect(cards.nth(1).locator('a')).toHaveAttribute('tabindex', '0');

  await dots.nth(2).click();
  await expect(cards.nth(2)).toHaveAttribute('data-pos', '0');
  await page.locator('[data-kt-next]').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(cards.nth(1)).toHaveAttribute('data-pos', '0');
  await expect(page.locator('[data-kt-counter]')).toHaveText('02 / 03');
});

test('homepage features five large editorial service tiles with real links', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.premium-services')).toHaveCount(1);
  const cards = page.locator('.premium-service');
  await expect(cards).toHaveCount(5);
  const links = await cards.locator('a').evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')));
  expect(links).toEqual(['/transport-kontenerow/','/transport-prefabrykatow/','/transport-maszyn/','/rozladunek-hds/','/transport-hds/']);
  await expect(page.locator('.premium-services__intro h2')).toContainText('Podnosimy.');
});
