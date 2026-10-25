import {test,expect} from '@playwright/test';
test('new shared footer has consistent brand, navigation, social links and copyright',async({page})=>{
 await page.goto('/o-nas/');
 const footer=page.locator('footer.sht-footer');
 await expect(footer).toHaveCount(1);
 await expect(footer.locator('.sht-footer-logo')).toContainText('KALTRUCK');
 await expect(footer.locator('nav a')).toHaveCount(4);
 await expect(footer.locator('.sht-socials a')).toHaveCount(2);
 await expect(footer.locator('.sht-footer-bottom')).toContainText('NIP:');
});
test('route tool remains present and accepts destination inside footer',async({page})=>{
 await page.goto('/transport-hds/');
 const details=page.locator('.sht-route-details').first();
 await expect(details).toHaveAttribute('open','');
 const route=details.locator('[data-google-route]');
 await expect(route).toHaveCount(1);
 await expect(route.locator('[data-google-route-origin]')).toHaveValue('Płock');
 await route.locator('[data-google-route-destination]').fill('Łódź');
 await expect(route.locator('[data-google-route-destination]')).toHaveValue('Łódź');
});
test('homepage continues to offer route and live reviews from footer',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-footer [data-google-route]')).toHaveCount(1);
 await expect(page.locator('.sht-footer [data-google-reviews]')).toHaveCount(1);
 await expect(page.locator('.sht-contact a[href="/wycena/"]')).toHaveCount(1);
});
