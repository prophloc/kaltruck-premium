import { test, expect } from '@playwright/test';

test('Die Glanzies styling and KALTRUCK logo are present on homepage', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.topbar .brand-logo')).toHaveAttribute('src', '/brand/kaltruck-logo.svg');
  await expect(page.locator('.main-title')).toContainText('Kontenery');
  await expect(page.locator('.main-title')).toContainText('Maszyny');
  await expect(page.locator('.sticker')).toHaveCount(2);
  await expect(page.locator('.sub-sticker')).toContainText('ładunków');
  await expect(page.locator('.feature-card')).toHaveCount(4);
  const background = await page.locator('.hero').evaluate(node => getComputedStyle(node).backgroundImage);
  expect(background).toContain('hero-hds-desktop.webp');
});

test('hero retains reference blue and green stickers with a white stroke', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const vals = await page.locator('.sticker').evaluateAll(nodes => nodes.map(node => {
    const css = getComputedStyle(node);
    return { stroke: css.webkitTextStrokeWidth, shadow: css.filter, color: css.color };
  }));
  expect(vals).toHaveLength(2);
  expect(vals.every(v => parseFloat(v.stroke) > 0 && v.shadow.includes('drop-shadow'))).toBeTruthy();
  expect(vals[0].color).not.toEqual(vals[1].color);
});

test('hero contact points and quote action use Kaltruck data', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.topbar .nav-cta')).toHaveAttribute('href', '/wycena/');
  await expect(page.locator('.badge-phone')).toHaveAttribute('href', 'tel:+48784430022');
  await expect(page.locator('.badge-mail')).toHaveAttribute('href', 'mailto:hds.plock@gmail.com');
  await expect(page.locator('.contact-section')).toContainText('Zapytaj o transport');
});

test('original 3D carousel controls switch between service cards', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('.service-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toHaveAttribute('data-pos', '0');
  await page.locator('#nextBtn').click();
  await expect(cards.nth(1)).toHaveAttribute('data-pos', '0');
  await expect(page.locator('#activeServiceTitle')).toHaveText('Transport prefabrykatów');
  await page.locator('#prevBtn').click();
  await expect(cards.nth(0)).toHaveAttribute('data-pos', '0');
  await page.locator('[data-dot="2"]').click();
  await expect(cards.nth(2)).toHaveAttribute('data-pos', '0');
  await expect(cards.nth(0).locator('a')).toHaveAttribute('tabindex', '-1');
});

test('offer area matches reference 3-card grid with real service links', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.offer-grid a')).toHaveCount(3);
  const links = await page.locator('.offer-grid a').evaluateAll(nodes =>
    nodes.map(node => (node as HTMLAnchorElement).getAttribute('href')));
  expect(links).toEqual(['/transport-kontenerow/', '/transport-prefabrykatow/', '/transport-maszyn/']);
});
