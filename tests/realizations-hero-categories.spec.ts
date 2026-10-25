import {test,expect} from '@playwright/test';
const categories=['Transport i montaż konstrukcji','Budownictwo i infrastruktura','Energetyka i przemysł','Rolnictwo i rekreacja','Reklama i wydarzenia'];
test('five real source-backed project category thumbnails appear in the editorial body',async({page})=>{
 await page.goto('/realizacje/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.sht-sub-banner h1')).toContainText('Realizacje');
 const cards=page.locator('[data-realization-project-card]');
 await expect(cards).toHaveCount(5);
 const values=await cards.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-realization-category')));
 expect(values.sort()).toEqual([...categories].sort());
});
test('project categories use photographs and visible overlaid captions',async({page})=>{
 await page.goto('/realizacje/');
 const cards=page.locator('.sht-project-category');
 await expect(cards).toHaveCount(5);
 const first=cards.first();
 await expect(first.locator('img')).toHaveAttribute('src',/.+/);
 await expect(first.locator('span')).toBeVisible();
});
test('clicking a thumbnail activates matching gallery filter',async({page})=>{
 await page.goto('/realizacje/',{waitUntil:'domcontentloaded'});
 const first=page.locator('[data-realization-project-card]').first();
 const cat=await first.getAttribute('data-realization-category');
 await first.click();
 await expect(page.locator(`[data-project-filter="${cat}"]`)).toHaveAttribute('aria-pressed','true');
});
