import { test, expect } from '@playwright/test';

test('editorial reasons have four service-focused explanations', async ({page})=>{
  await page.goto('/');
  await expect(page.locator('.ht-reason')).toHaveCount(4);
  await expect(page.locator('.ht-reason').first()).toContainText('Transport i dźwig w jednym');
  await expect(page.locator('.ht-reason').last()).toContainText('Zlecenia w całej Polsce');
});

test('homepage contact is aligned with real brand contacts and quote flow', async ({page})=>{
  await page.goto('/');
  await expect(page.locator('.ht-contact-primary a[href="/wycena/"]')).toBeVisible();
  await expect(page.locator('.ht-contact-details a[href^="tel:"]')).toHaveCount(1);
  await expect(page.locator('.ht-contact-details a[href^="mailto:"]')).toHaveCount(1);
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
