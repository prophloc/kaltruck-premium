import { test, expect } from '@playwright/test';

test('reference-like navigation precedes an article photo banner', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.sht-topline')).toBeVisible();
  await expect(page.locator('.sht-logo img')).toHaveAttribute('src','/brand/kaltruck-logo.svg');
  await expect(page.locator('.sht-nav a')).toHaveCount(5);
  await expect(page.locator('.sht-banner')).toBeVisible();
  await expect(page.locator('h1')).toContainText('Transport HDS');
});

test('short article banner uses actual company panorama not old fullscreen hero', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const image=await page.locator('.sht-banner-photo').evaluate(node=>getComputedStyle(node).backgroundImage);
  expect(image).toContain('hero-hds-desktop.webp');
  expect(image).toContain('linear-gradient');
  const height=await page.locator('.sht-banner').evaluate(node=>node.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(500);
  await expect(page.locator('.ht-page')).toHaveCount(0);
});

test('four counters sit directly between banner and article', async ({page})=>{
  await page.goto('/');
  await expect(page.locator('.sht-stat')).toHaveCount(4);
  const order=await page.evaluate(()=>['.sht-banner','.sht-stats','.sht-article','.sht-contact'].map(s=>document.querySelector(s)?.getBoundingClientRect().top));
  expect(order.every((n,i)=>i===0 || Number(n)>Number(order[i-1]))).toBeTruthy();
});

test('header and article link to actual service routes', async ({page})=>{
  await page.goto('/');
  await expect(page.locator('.sht-nav a[href="/transport-hds/"]')).toBeVisible();
  await expect(page.locator('.sht-article-cta a[href="/wycena/"]')).toBeVisible();
  await expect(page.locator('.sht-photo')).toHaveCount(3);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});
