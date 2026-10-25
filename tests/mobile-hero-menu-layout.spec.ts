import { test, expect } from '@playwright/test';

for(const width of [320,390,620]){
 test(`reference homepage stays usable at ${width}px`, async ({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.sht-banner h1')).toBeVisible();
  await expect(page.locator('.sht-nav')).toBeVisible();
  await expect(page.locator('.sht-stat')).toHaveCount(4);
  await expect(page.locator('.sht-photo')).toHaveCount(3);
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,visible:document.documentElement.clientWidth}));
  expect(widths.scroll).toBeLessThanOrEqual(widths.visible);
 });
}

test('existing mobile navigation on inner pages is preserved',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
 await page.locator('[data-menu-open]').click();
 const menu=page.locator('[data-mobile-menu]');
 await expect(menu).toBeVisible();
 await expect(menu.locator('a.mobile-contact__phone[href="tel:+48784430022"]')).toBeVisible();
 await expect(menu.locator('a[href^="mailto:"]')).toBeVisible();
});
