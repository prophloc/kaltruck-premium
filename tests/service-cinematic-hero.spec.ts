import {test,expect} from '@playwright/test';
const services=[
 {path:'/transport-hds/',title:'Transport HDS'},
 {path:'/transport-kontenerow/',title:'Transport kontenerów'},
 {path:'/transport-prefabrykatow/',title:'Transport prefabrykatów'},
 {path:'/transport-maszyn/',title:'Transport maszyn'},
 {path:'/rozladunek-hds/',title:'Rozładunek HDS'},
 {path:'/wynajem-hds/',title:'Wynajem HDS'}
];
for(const service of services){
 test(`${service.path} has photo banner and the full article on desktop`,async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(service.path,{waitUntil:'domcontentloaded'});
  await expect(page.locator('.sht-sub-banner h1')).toHaveCount(1);
  await expect(page.locator('.sht-sub-banner')).toContainText(service.title);
  const bg=await page.locator('.sht-sub-banner .sht-banner-photo').evaluate(el=>getComputedStyle(el).backgroundImage);
  expect(bg).toContain('url(');
  await expect(page.locator('.sht-prose h2').first()).toBeVisible();
  await expect(page.locator('.sht-service-side a[href="/wycena/"]')).toHaveCount(1);
 });
 test(`${service.path} fits reference mobile design`,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(service.path,{waitUntil:'domcontentloaded'});
  await expect(page.locator('.sht-sub-banner h1')).toBeVisible();
  await expect(page.locator('.sht-prose')).toBeVisible();
  const vals=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  expect(vals.scroll).toBeLessThanOrEqual(vals.viewport);
 });
}
