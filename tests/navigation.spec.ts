import {test,expect} from '@playwright/test';
const nav=[['USŁUGI','/transport-hds/'],['REALIZACJE','/realizacje/'],['SPRZĘT','/sprzet/'],['O FIRMIE','/o-nas/'],['KONTAKT','/kontakt/']];
test('navigation exposes five core pages and contact actions',async({page})=>{
 await page.goto('/');
 for(const [label,url] of nav) await expect(page.locator(`.sht-nav a[href="${url}"]`)).toHaveText(label);
 await expect(page.locator('a.sht-nav-phone')).toHaveAttribute('href','tel:+48784430022');
});
for(const width of [320,390,768,1024,1440]){
 test(`main navigation fits at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.sht-logo')).toBeVisible();
  await expect(page.locator('.sht-nav')).toBeVisible();
  const x=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  expect(x.scroll).toBeLessThanOrEqual(x.viewport);
 });
}
test('active navigation state matches current core page',async({page})=>{
 for(const path of ['/realizacje/','/sprzet/','/o-nas/','/kontakt/','/transport-hds/','/transport-kontenerow/']){
  await page.goto(path,{waitUntil:'domcontentloaded'});
  const active=page.locator('.sht-nav a[aria-current="page"]');
  await expect(active).toHaveCount(1);
 }
});
test('nav remains usable without Javascript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();
 await page.goto('/');
 await expect(page.locator('.sht-nav a')).toHaveCount(5);
 await expect(page.locator('.sht-nav a[href="/kontakt/"]')).toBeVisible();
 await context.close();
});
