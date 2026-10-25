import {test,expect} from '@playwright/test';
test('catalog is contained in a dedicated dark area with accessible controls',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/transport-hds/');
 await expect(page.locator('.sht-catalog-area')).toHaveCount(1);
 await expect(page.locator('.sht-catalog-area [data-service-nav-index]')).toHaveCount(5);
 const c=await page.locator('.sht-catalog-area .service-catalog').boundingBox();
 const shell=await page.locator('.sht-catalog-area .sht-shell').boundingBox();
 expect(c!.x).toBeGreaterThanOrEqual(shell!.x-1);
 expect(c!.x+c!.width).toBeLessThanOrEqual(shell!.x+shell!.width+1);
});
