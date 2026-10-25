import {test,expect} from '@playwright/test';
test('shared desktop header exposes logo, navigation, phone and email',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/sprzet/');
 await expect(page.locator('.sht-logo img')).toHaveAttribute('src','/brand/kaltruck-logo.svg');
 await expect(page.locator('.sht-nav a')).toHaveCount(5);
 await expect(page.locator('.sht-nav-phone')).toHaveAttribute('href','tel:+48784430022');
 await expect(page.locator('.sht-topline a')).toHaveAttribute('href','mailto:hds.plock@gmail.com');
});
test('responsive reference navigation still exposes contact',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/transport-hds/');
 await expect(page.locator('.sht-nav')).toBeVisible();
 await expect(page.locator('.sht-nav a[href="/kontakt/"]')).toHaveCount(1);
 await expect(page.locator('.sht-nav-phone')).toBeVisible();
});
test('realizations category links select matching filtered projects',async({page})=>{
 await page.goto('/realizacje/',{waitUntil:'domcontentloaded'});
 const btn=page.locator('[data-realization-category="Rolnictwo i rekreacja"]');
 await expect(btn).toHaveCount(1);
 await btn.click();
 await expect(page.locator('[data-project-filter="Rolnictwo i rekreacja"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-project-filter="Reklama i wydarzenia"]').click();
 await expect(page.locator('[data-project-group="Reklama i wydarzenia"]:visible')).toHaveCount(1);
});
