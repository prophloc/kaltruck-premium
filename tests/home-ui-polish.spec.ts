import { test, expect } from '@playwright/test';

test('the four reference advantages maintain readable alignment', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/');
  const cards = page.locator('.features .feature-card');
  await expect(cards).toHaveCount(4);
  const values = await cards.evaluateAll(nodes => nodes.map(node => ({
    icon: Boolean(node.querySelector('.feature-icon')), heading: Boolean(node.querySelector('h3')),
    text: Boolean(node.querySelector('p')),
  })));
  expect(values.every(x => x.icon && x.heading && x.text)).toBeTruthy();
});

test('reference contact section offers existing quote flow', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.contact-actions a[href="/wycena/"]')).toBeVisible();
  await expect(page.locator('.contact-side')).toContainText('Transport HDS');
});

test('footer brand is centered in the whole free row between route and copyright line', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/o-nas/', { waitUntil: 'domcontentloaded' });

  const geometry = await page.evaluate(() => {
    const route = document.querySelector<HTMLElement>('[data-google-route]');
    const footerBottom = document.querySelector<HTMLElement>('.footer-bottom');
    const logo = document.querySelector<HTMLElement>('.footer-brand img');
    const tagline = document.querySelector<HTMLElement>('.footer-brand p');
    if (!route || !footerBottom || !logo || !tagline) return null;

    const routeRect = route.getBoundingClientRect();
    const bottomRect = footerBottom.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const taglineRect = tagline.getBoundingClientRect();

    const contentTop = Math.min(logoRect.top, taglineRect.top);
    const contentBottom = Math.max(logoRect.bottom, taglineRect.bottom);
    const topSpace = contentTop - routeRect.bottom;
    const bottomSpace = bottomRect.top - contentBottom;

    return { topSpace, bottomSpace, delta: Math.abs(topSpace - bottomSpace) };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.topSpace).toBeGreaterThanOrEqual(16);
  expect(geometry!.bottomSpace).toBeGreaterThanOrEqual(16);
  expect(geometry!.delta).toBeLessThanOrEqual(8);
});
