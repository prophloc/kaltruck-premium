import { test, expect } from '@playwright/test';

test('homepage communicates a grounded HDS offer without fictitious numbers', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toContainText('CIĘŻKI ŁADUNEK.');
  await expect(page.locator('.ht-fact')).toHaveCount(4);
  await expect(page.locator('.ht-fact')).toContainText(['10+LAT DOŚWIADCZENIA', '12 tUDŹWIG HDS DO', '14 mZASIĘG RAMIENIA DO','POLSKAOBSZAR DZIAŁANIA']);
  await expect(page.locator('.ht-contact-details a[href^="tel:"]')).toHaveCount(1);
});

test('homepage retains optimized responsive photograph as the LCP asset', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="preload"][media="(min-width: 621px)"]')).toHaveAttribute('href','/images/home/hero-hds-desktop.webp');
  await expect(page.locator('link[rel="preload"][media="(max-width: 620px)"]')).toHaveAttribute('href','/images/home/hero-hds-mobile.webp');
  await page.setViewportSize({width:390,height:844});
  const image = await page.locator('.ht-hero-media').evaluate(node => getComputedStyle(node).backgroundImage);
  expect(image).toContain('hero-hds-mobile.webp');
});

test('editorial service section contains three real routes and project imagery', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.ht-service')).toHaveCount(3);
  await expect(page.locator('.ht-service img')).toHaveCount(3);
  await expect(page.locator('.ht-services h2')).toContainText('CO MOŻEMY');
  await expect(page.locator('.ht-reason')).toHaveCount(4);
});

test('new homepage includes structured editorial layout and verified contact area', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.ht-about h2')).toContainText('Z PŁOCKA.');
  await expect(page.locator('.ht-statement h2')).toContainText('USTAWIAMY.');
  await expect(page.locator('.ht-contact h2')).toContainText('MASZ ŁADUNEK');
  await expect(page.locator('.ht-contact a[href="/wycena/"]')).toHaveCount(1);
});
