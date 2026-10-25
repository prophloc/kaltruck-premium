import { test, expect } from '@playwright/test';

test('contact cards mirror informational reference pattern, without fake staff',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-contact-item')).toHaveCount(3);
 await expect(page.locator('.sht-contact-item').first()).toContainText('Telefon');
 await expect(page.locator('.sht-contact-item').nth(1)).toContainText('Zapytania i wyceny');
 await expect(page.locator('.sht-contact-item').nth(2)).toContainText('Baza transportowa');
});

test('editorial article has compact heading and restrained conversion links',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.sht-article-title h2')).toContainText('Transport z HDS');
 await expect(page.locator('.sht-article-cta a')).toHaveCount(2);
 await expect(page.locator('.sht-contact-bottom a[href="/wycena/"]')).toBeVisible();
});

test('new footer layout keeps logo, navigation and copyright separated', async ({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/o-nas/',{waitUntil:'domcontentloaded'});
 const footer=page.locator('.sht-footer');
 await expect(footer).toHaveCount(1);
 await expect(footer.locator('.sht-footer-logo img')).toHaveAttribute('src','/brand/kaltruck-logo.svg');
 await expect(footer.locator('.sht-footer-top nav a')).toHaveCount(5);
 await expect(footer.locator('.sht-footer-bottom')).toContainText('NIP:');
 await expect(footer.locator('.sht-footer-map [data-google-route]')).toHaveCount(1);
});
