import {test,expect} from '@playwright/test';
test('shared header labels lead to five core pages',async({page})=>{
 await page.goto('/');
 const links=await page.locator('.sht-nav a').evaluateAll(nodes=>nodes.map(n=>(n as HTMLAnchorElement).getAttribute('href')));
 expect(links).toEqual(['/transport-hds/','/realizacje/','/sprzet/','/o-nas/','/kontakt/']);
});
test('small-screen header stays compact and horizontal without a carousel',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await expect(page.locator('.sht-nav a')).toHaveCount(5);
 await expect(page.locator('[data-service-rotator]')).toHaveCount(0);
 const top=await page.locator('.sht-header').boundingBox();
 expect(top!.height).toBeLessThan(190);
});
