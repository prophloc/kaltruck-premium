import {test,expect} from '@playwright/test';
for(const path of ['/realizacje/','/sprzet/','/o-nas/','/kontakt/','/wycena/']){
 test(`${path} renders shared header, article and footer`,async({page})=>{
  const res=await page.goto(path,{waitUntil:'domcontentloaded'});
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.sht-header')).toHaveCount(1);
  await expect(page.locator('.sht-footer')).toHaveCount(1);
 });
}
test('realizations gallery keeps semantic images',async({page})=>{
 await page.goto('/realizacje/');
 const images=page.locator('[data-project-gallery] img');
 expect(await images.count()).toBeGreaterThan(3);
 for(let i=0;i<await images.count();i++){
  const image=images.nth(i);
  expect((await image.getAttribute('alt'))?.trim().length).toBeGreaterThan(3);
  expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0);
  expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0);
 }
});
const services=["/transport-hds/","/wynajem-hds/","/transport-kontenerow/","/transport-prefabrykatow/","/transport-maszyn/","/rozladunek-hds/"];
for(const path of services){
 test(`${path} serves full SEO guide in HTML without click`,async({page})=>{
  await page.goto(path,{waitUntil:'domcontentloaded'});
  const guide=page.locator('[data-service-guide]');
  await expect(guide).toBeVisible();
  expect(await guide.locator('h2').count()).toBeGreaterThanOrEqual(3);
  expect(await guide.locator('a[href^="/"]').count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator('.sht-related a')).toHaveCount(5);
 });
}
test('service information remains readable without Javascript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 try{
  const page=await context.newPage();
  await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-service-guide]')).toBeVisible();
  await expect(page.locator('.sht-nav a')).toHaveCount(5);
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  expect(widths.scroll).toBeLessThanOrEqual(widths.viewport);
 }finally{await context.close();}
});
