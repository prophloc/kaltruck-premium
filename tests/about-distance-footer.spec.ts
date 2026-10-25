import {test,expect} from '@playwright/test';
test('about page uses shared reference banner and original company facts',async({page})=>{
 await page.goto('/o-nas/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.sht-header')).toHaveCount(1);
 await expect(page.locator('.sht-sub-banner h1')).toContainText('O firmie KALTRUCK');
 await expect(page.locator('.sht-article-text')).toContainText('Od ponad 10 lat');
 await expect(page.locator('.sht-inner-facts>div')).toHaveCount(3);
});
test('original footer route tool is permanently visible above contact columns',async({page})=>{
 await page.goto('/o-nas/',{waitUntil:'domcontentloaded'});
 const route=page.locator('.sht-footer-map [data-google-route]');
 await expect(route).toBeVisible();
 await expect(route.locator('[data-google-route-origin]')).toHaveValue('Płock');
 await expect(route.locator('[data-google-route-destination]')).toBeVisible();
 await expect(page.locator('.sht-footer-grid')).toBeVisible();
});
test('Google reviews remain opt-in via right-side matching toggle',async({page})=>{
 await page.goto('/kontakt/',{waitUntil:'domcontentloaded'});
 await page.locator('[data-sht-drawer-toggle="reviews"]').click();
 const panel=page.locator('#sht-drawer-reviews');
 await expect(panel.locator('[data-google-reviews]')).toBeVisible();
 await expect(panel.locator('.google-reviews-attribution')).toHaveAttribute('href',/google/);
});
