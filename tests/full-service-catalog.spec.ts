import {test,expect} from '@playwright/test';
const categories=['Transport i montaż konstrukcji','Budownictwo i infrastruktura','Energetyka i przemysł','Rolnictwo i rekreacja','Reklama i wydarzenia'];
test('all 31 HDS services and five categories remain on the primary service page',async({page})=>{
 await page.goto('/transport-hds/',{waitUntil:'domcontentloaded'});
 const panels=page.locator('[data-service-panel]');
 await expect(panels).toHaveCount(5);
 await expect(panels.locator('h2')).toHaveText(categories);
 await expect(page.locator('[data-service-item]')).toHaveCount(31);
 await expect(page.locator('[data-service-catalog]')).toHaveCount(1);
});
test('realizations still expose all five project filters',async({page})=>{
 await page.goto('/realizacje/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('[data-project-filter]')).toHaveCount(6);
 await expect(page.locator('[data-project-filter]')).toHaveText(['Wszystkie',...categories]);
});
test('shared header gives visible phone and offer navigation',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/transport-hds/');
 await expect(page.locator('.sht-nav-phone')).toHaveAttribute('href','tel:+48784430022');
 await expect(page.locator('.sht-nav a')).toHaveCount(5);
 await expect(page.locator('.sht-topline a')).toHaveAttribute('href','mailto:hds.plock@gmail.com');
});
