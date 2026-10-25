import {test,expect} from '@playwright/test';
test('desktop quote form lives in reference-style article with helpful sidebar',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/wycena/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.sht-sub-banner h1')).toContainText('Wycena');
 await expect(page.locator('.sht-quote-primary [data-quote-form]')).toHaveCount(1);
 await expect(page.locator('.sht-quote-info')).toBeVisible();
 const body=await page.locator('.sht-quote-primary').boundingBox();
 const side=await page.locator('.sht-quote-info').boundingBox();
 expect(side!.x).toBeGreaterThan(body!.x+body!.width-1);
 await expect(page.getByLabel('Telefon',{exact:true})).toBeVisible();
});
for(const width of [390,768]){
 test(`quote form stacks with information at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/wycena/',{waitUntil:'domcontentloaded'});
  const main=await page.locator('.sht-quote-primary').boundingBox();
  const side=await page.locator('.sht-quote-info').boundingBox();
  expect(main).not.toBeNull();
  expect(side).not.toBeNull();
  expect(side!.y).toBeGreaterThan(main!.y+main!.height-1);
  expect(side!.x+side!.width).toBeLessThanOrEqual(width+1);
 });
}
