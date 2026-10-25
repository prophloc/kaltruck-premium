import {test,expect} from '@playwright/test';

test('about page uses shared reference banner and original company facts',async({page})=>{
 await page.goto('/o-nas/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.sht-header')).toHaveCount(1);
 await expect(page.locator('.sht-sub-banner h1')).toContainText('O firmie KALTRUCK');
 await expect(page.locator('.sht-article-text')).toContainText('Od ponad 10 lat');
 await expect(page.locator('.sht-inner-facts>div')).toHaveCount(3);
});
test('footer map is expanded and accepts route destinations',async({page})=>{
 await page.goto('/o-nas/',{waitUntil:'domcontentloaded'});
 const details=page.locator('.sht-route-details').first();
 await expect(details).toHaveCount(1);
 await expect(details).toHaveAttribute('open','');
 const route=details.locator('[data-google-route]');
 await expect(route).toHaveCount(1);
 await expect(route.locator('[data-google-route-origin]')).toHaveValue('Płock');
 await expect(route.locator('[data-google-route-destination]')).toHaveCount(1);
});
test('reviews remain opt-in and accessible in footer',async({page})=>{
 await page.goto('/kontakt/');
 const details=page.locator('[data-reference-reviews]');
 await expect(details).toHaveCount(1);
 await details.locator('summary').click();
 await expect(details.locator('[data-google-reviews]')).toBeVisible();
 await expect(details.locator('.google-reviews-attribution')).toHaveAttribute('href',/google/);
});
