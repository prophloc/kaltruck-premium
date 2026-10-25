import {test,expect} from '@playwright/test';
test('original Premium footer order and columns are restored with new palette',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/o-nas/',{waitUntil:'domcontentloaded'});
 const footer=page.locator('.sht-footer');
 await expect(footer).toHaveCount(1);
 await expect(footer.locator('.sht-footer-logo img')).toHaveAttribute('src','/brand/kaltruck-logo.svg');
 await expect(footer.locator('.sht-footer-navigation nav a')).toHaveCount(5);
 await expect(footer.locator('.sht-socials a')).toHaveCount(2);
 await expect(footer.locator('.sht-footer-bottom')).toContainText('NIP:');
 const coords=await page.evaluate(()=>{
   const el=s=>(document.querySelector(s) as HTMLElement).getBoundingClientRect();
   return {map:el('.sht-footer-map'),info:el('.sht-footer-grid')};
 });
 expect(coords.map.top).toBeLessThan(coords.info.top);
});

test('footer map retains source proportions and accepts destination',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
 const route=page.locator('.sht-footer-map [data-google-route]');
 await expect(route).toHaveCount(1);
 await expect(route.locator('[data-google-route-origin]')).toHaveValue('Płock');
 await route.locator('[data-google-route-destination]').fill('Łódź');
 await expect(route.locator('[data-google-route-destination]')).toHaveValue('Łódź');
 const [map,form]=await Promise.all([
   route.locator('.google-route-map-shell').boundingBox(),
   route.locator('.google-route-panel').boundingBox()
 ]);
 expect(map).not.toBeNull();
 expect(form).not.toBeNull();
 expect(map!.width).toBeGreaterThan(form!.width);
 expect(map!.height).toBeLessThanOrEqual(285);
});

test('reviews remain in matching side tab rather than an extra footer accordion',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.sht-footer [data-google-route]')).toHaveCount(1);
 await expect(page.locator('.sht-footer [data-google-reviews]')).toHaveCount(0);
 await expect(page.locator('#sht-drawer-reviews [data-google-reviews]')).toHaveCount(1);
 await expect(page.locator('.sht-contact a[href="/wycena/"]')).toHaveCount(1);
});
