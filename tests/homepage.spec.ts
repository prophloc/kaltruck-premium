import { test, expect } from '@playwright/test';

test('homepage has four verified business statistics rather than animated fake client counts', async ({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('h1')).toContainText('Transport HDS');
 await expect(page.locator('.sht-stat strong')).toHaveText(['10+','12 t','14 m','POLSKA']);
 await expect(page.locator('.sht-stat')).toHaveCount(4);
 await expect(page.locator('.sht-contact-item')).toHaveCount(3);
});

test('homepage keeps optimized desktop and mobile hero backgrounds', async ({page})=>{
 await page.goto('/');
 await expect(page.locator('link[rel="preload"][media="(min-width: 541px)"]')).toHaveAttribute('href','/images/home/hero-hds-desktop.webp');
 await expect(page.locator('link[rel="preload"][media="(max-width: 540px)"]')).toHaveAttribute('href','/images/home/hero-hds-mobile.webp');
 await page.setViewportSize({width:390,height:844});
 const image=await page.locator('.sht-banner-photo').evaluate(node=>getComputedStyle(node).backgroundImage);
 expect(image).toContain('hero-hds-mobile.webp');
});

test('article copy introduces KALTRUCK and shows the three services', async ({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-article h2')).toContainText('Transport z HDS');
 await expect(page.locator('.sht-article-text p')).toHaveCount(4);
 await expect(page.locator('.sht-photo')).toHaveCount(3);
 const urls=await page.locator('.sht-photo').evaluateAll(nodes=>nodes.map(node=>(node as HTMLAnchorElement).getAttribute('href')));
 expect(urls).toEqual(['/transport-kontenerow/','/transport-prefabrykatow/','/transport-maszyn/']);
});

test('contact section uses real phone email location and leads to quote', async ({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-contact a[href="tel:+48784430022"]')).toBeVisible();
 await expect(page.locator('.sht-contact a[href="mailto:hds.plock@gmail.com"]')).toBeVisible();
 await expect(page.locator('.sht-contact-bottom a[href="/wycena/"]')).toBeVisible();
});
