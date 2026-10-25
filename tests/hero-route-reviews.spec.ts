import { test, expect } from '@playwright/test';

test('landing page uses verified company facts and service photos', async ({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.ht-fact')).toHaveCount(4);
 await expect(page.locator('.ht-service img')).toHaveCount(3);
 await expect(page.locator('.ht-about img')).toHaveCount(1);
 await expect(page.locator('.ht-reason')).toHaveCount(4);
});

test('editorial links connect into existing HDS and quote routes', async ({page})=>{
 await page.goto('/');
 const paths=await page.locator('.ht-page a[href^="/"]').evaluateAll(nodes=>
   [...new Set(nodes.map(node=>(node as HTMLAnchorElement).getAttribute('href')))].filter(Boolean));
 for(const href of ['/transport-hds/','/transport-kontenerow/','/transport-prefabrykatow/',
   '/transport-maszyn/','/rozladunek-hds/','/realizacje/','/wycena/'])expect(paths).toContain(href);
});

test('footer retains Google route and social links on original service pages', async ({page})=>{
 await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.site-footer [data-google-route]')).toHaveCount(1);
 await expect(page.locator('.footer-socials a')).toHaveCount(2);
 await expect(page.locator('.footer-socials a').first()).toHaveAttribute('href',/facebook.com/);
});

test('favicon social metadata and canonical URLs remain live', async ({page})=>{
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

test('KALTRUCK HDS social links are kept in the footer', async ({page})=>{
 await page.goto('/');
 await expect(page.locator('.ht-page .footer-socials')).toHaveCount(0);
 const socials=page.locator('.site-footer .footer-socials a');
 await expect(socials).toHaveCount(2);
 await expect(socials.nth(0)).toHaveAttribute('href','https://www.facebook.com/profile.php?id=61561070733012');
 await expect(socials.nth(1)).toHaveAttribute('href','https://www.instagram.com/transporthdsplock/');
});
