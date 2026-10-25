import {test,expect} from '@playwright/test';
test('homepage contact module uses three informational columns',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-contact h2')).toContainText('SKONTAKTUJ SIĘ Z NAMI');
 await expect(page.locator('.sht-contact-item')).toHaveCount(3);
});
test('inner page contact remains a plain rectangular reference module',async({page})=>{
 await page.goto('/sprzet/');
 await expect(page.locator('.sht-contact')).toHaveCount(1);
 await expect(page.locator('.sht-contact a[href="/wycena/"]')).toBeVisible();
 await expect(page.locator('.sht-contact a[href^="mailto:"]')).toHaveCount(1);
});
test('real company contact actions link to real destinations',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-contact a[href="tel:+48784430022"]')).toBeVisible();
 await expect(page.locator('.sht-contact a[href="mailto:hds.plock@gmail.com"]')).toBeVisible();
 await expect(page.locator('.sht-contact a[href="/wycena/"]')).toHaveCount(1);
});
