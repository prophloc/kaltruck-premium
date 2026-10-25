import {test,expect} from '@playwright/test';

test('header uses only enlarged KALTRUCK logo without duplicated brand type',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const logo=page.locator('.sht-logo');
 await expect(logo.locator('img')).toHaveAttribute('src','/brand/kaltruck-logo.svg');
 await expect(logo.locator('span')).toHaveCount(0);
 const size=await logo.locator('img').boundingBox();
 expect(size!.width).toBeGreaterThan(180);
});

test('map slide-out opens on left, reveals route, and closes on Escape',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const toggle=page.locator('[data-sht-drawer-toggle="route"]');
 const panel=page.locator('#sht-drawer-route');
 await expect(toggle).toHaveAttribute('aria-expanded','false');
 await toggle.click();
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await expect(panel).toHaveAttribute('aria-hidden','false');
 await expect(panel.locator('[data-google-route]')).toBeVisible();
 await expect(panel.locator('[data-google-route-map]')).not.toHaveAttribute('src','about:blank');
 await page.keyboard.press('Escape');
 await expect(panel).toHaveAttribute('aria-hidden','true');
 await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('Google reviews slide-out opens on right, preserves Google link',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const toggle=page.locator('[data-sht-drawer-toggle="reviews"]');
 await toggle.click();
 const panel=page.locator('#sht-drawer-reviews');
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await expect(panel.locator('[data-google-reviews]')).toBeVisible();
 await expect(panel.locator('.google-reviews-attribution')).toHaveAttribute('href',/google/);
 await panel.locator('[data-sht-drawer-close]').click();
 await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('map and Google reviews handles have identical dimensions and original icon styles',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const left=page.locator('[data-sht-drawer-toggle="route"]');
 const right=page.locator('[data-sht-drawer-toggle="reviews"]');
 const [a,b]=await Promise.all([left.boundingBox(),right.boundingBox()]);
 expect(a).not.toBeNull();expect(b).not.toBeNull();
 expect(Math.abs(a!.width-b!.width)).toBeLessThanOrEqual(1);
 expect(Math.abs(a!.height-b!.height)).toBeLessThanOrEqual(1);
 await expect(left.locator('.sht-drawer-tab-pin')).toHaveCount(1);
 await expect(right.locator('.sht-drawer-tab-star')).toHaveText('★');
 await expect(left.locator('.sht-drawer-tab-label')).toHaveText('TRASA');
 await expect(right.locator('.sht-drawer-tab-label')).toHaveText('OPINIE');
});

test('restored footer map is compact and comes before footer navigation',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/kontakt/',{waitUntil:'domcontentloaded'});
 const map=page.locator('.sht-footer-map .google-route-map-shell');
 const info=page.locator('.sht-footer-grid');
 const [mapBox,infoBox]=await Promise.all([map.boundingBox(),info.boundingBox()]);
 expect(mapBox).not.toBeNull();
 expect(infoBox).not.toBeNull();
 expect(mapBox!.height).toBeLessThanOrEqual(285);
 expect(infoBox!.y).toBeGreaterThan(mapBox!.y+mapBox!.height-1);
});

test('contact map retains familiar two-column layout and gear image is centered',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/kontakt/',{waitUntil:'domcontentloaded'});
 const [formBox,mapBox]=await Promise.all([
  page.locator('.sht-contact-page .sht-route-page .google-route-panel').boundingBox(),
  page.locator('.sht-contact-page .sht-route-page .google-route-map-shell').boundingBox()
 ]);
 expect(mapBox!.width).toBeGreaterThan(formBox!.width);
 await page.goto('/sprzet/',{waitUntil:'domcontentloaded'});
 const positions=await page.evaluate(()=>{
  const text=document.querySelector('.sht-equipment-page .sht-article-text')?.getBoundingClientRect();
  const photo=document.querySelector('.sht-equipment-page .sht-article-aside')?.getBoundingClientRect();
  if(!text || !photo)return null;
  return Math.abs((text.top+text.bottom)/2-(photo.top+photo.bottom)/2);
 });
 expect(positions).not.toBeNull();
 expect(positions!).toBeLessThanOrEqual(4);
});

test('favicon reflects charcoal/coral design theme',async({page})=>{
 await page.goto('/');
 const src=await page.request.get('/favicon.svg');
 expect(src.ok()).toBeTruthy();
 const svg=await src.text();
 expect(svg).toContain('#25292C');
 expect(svg).toContain('#E94F32');
 await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href',/kaltruck-heavy-v5/);
});
