import { test, expect } from '@playwright/test';

test('source-like article page includes photo gallery and factual metrics',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.sht-stat')).toHaveCount(4);
 await expect(page.locator('.sht-photo img')).toHaveCount(3);
 await expect(page.locator('.sht-article-aside img')).toHaveCount(1);
});

test('source-like article links preserve site information architecture',async({page})=>{
 await page.goto('/');
 const paths=await page.locator('.sht a[href^="/"]').evaluateAll(nodes=>[...new Set(nodes.map(node=>(node as HTMLAnchorElement).getAttribute('href')))].filter(Boolean));
 for(const href of ['/transport-hds/','/transport-kontenerow/','/transport-prefabrykatow/',
 '/transport-maszyn/','/realizacje/','/wycena/']) expect(paths).toContain(href);
});

test('inner service pages retain footer Google route and social links',async({page})=>{
 await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.site-footer [data-google-route]')).toHaveCount(1);
 await expect(page.locator('.sht-footer .sht-socials a')).toHaveCount(2);
});

test('favicon and social metadata remain configured for landing and inner pages',async({page})=>{
 for(const path of ['/','/transport-hds/','/transport-kontenerow/']){
  await page.goto(path,{waitUntil:'domcontentloaded'});
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
 }
 for(const file of ['/favicon.svg','/site.webmanifest']){
  const r=await page.request.get(file);
  expect(r.ok(),file).toBeTruthy();
 }
});

test('reference-like footer includes both KALTRUCK social profiles',async({page})=>{
 await page.goto('/');
 const socials=page.locator('.sht-footer .sht-socials a');
 await expect(socials).toHaveCount(2);
 await expect(socials.nth(0)).toHaveAttribute('href','https://www.facebook.com/profile.php?id=61561070733012');
 await expect(socials.nth(1)).toHaveAttribute('href','https://www.instagram.com/transporthdsplock/');
});
