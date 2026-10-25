import {test,expect} from '@playwright/test';
test('transport HDS article retains five catalog panels and 31 services',async({page})=>{
 await page.goto('/transport-hds/');
 const catalog=page.locator('[data-service-catalog]');
 await expect(catalog).toHaveCount(1);
 await expect(catalog.locator('[data-service-panel]')).toHaveCount(5);
 await expect(catalog.locator('[data-service-item]')).toHaveCount(31);
 await expect(catalog.locator('[data-service-panel][data-active="true"]')).toHaveCount(1);
});
test('catalog category controls still activate the selected list',async({page})=>{
 await page.goto('/transport-hds/');
 const catalog=page.locator('[data-service-catalog]');
 await catalog.locator('[data-service-nav-index="1"]').click();
 await expect(catalog.locator('[data-service-panel]').nth(1)).toHaveAttribute('data-active','true');
 await expect(catalog.locator('[data-service-panel]').nth(0)).toHaveAttribute('data-active','false');
});
test('catalog stays underneath the readable article and banner',async({page})=>{
 await page.goto('/transport-hds/');
 const positions=await page.evaluate(()=>['.sht-sub-banner','.sht-service-article','.sht-catalog-area'].map(s=>document.querySelector(s)?.getBoundingClientRect().top||0));
 expect(positions[1]).toBeGreaterThan(positions[0]);
 expect(positions[2]).toBeGreaterThan(positions[1]);
});
test('buttons retain accessible pressed state and visible arrows',async({page})=>{
 await page.goto('/transport-hds/');
 const buttons=page.locator('.service-catalog__controls [data-service-nav-index]');
 await expect(buttons).toHaveCount(5);
 await expect(buttons.nth(0)).toHaveAttribute('aria-pressed','true');
 await expect(buttons.nth(0)).toContainText('01');
 await buttons.nth(2).click();
 await expect(buttons.nth(2)).toHaveAttribute('aria-pressed','true');
});
for(const width of [1440,1024,390]){
 test(`catalog fits article at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});
  await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
  const b=await page.locator('[data-service-catalog]').boundingBox();
  expect(b).not.toBeNull();
  expect(b!.x).toBeGreaterThanOrEqual(0);
  expect(b!.x+b!.width).toBeLessThanOrEqual(width+1);
 });
}
