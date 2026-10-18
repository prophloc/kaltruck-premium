import { test, expect } from '@playwright/test';

for (const path of ['/realizacje/', '/sprzet/', '/o-nas/', '/kontakt/']) {
  test(`${path} renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('realizations gallery ships semantic images without client filtering dependency', async ({ page }) => {
  await page.goto('/realizacje/');
  const images = page.locator('[data-project-gallery] img');
  expect(await images.count()).toBeGreaterThan(3);
  for (let i = 0; i < await images.count(); i++) {
    const image = images.nth(i);
    expect((await image.getAttribute('alt'))?.trim().length).toBeGreaterThan(3);
    expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0);
  }
});

const serviceRoutes = [
  '/transport-hds/',
  '/wynajem-hds/',
  '/transport-kontenerow/',
  '/transport-prefabrykatow/',
  '/transport-maszyn/',
  '/rozladunek-hds/',
];

for (const path of serviceRoutes) {
  test(`${path} starts compact and reveals its full SEO description on click`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const details = page.locator('[data-service-details]');
    const toggle = details.locator('[data-service-details-toggle]');
    const content = details.locator('[data-service-details-content]');

    await expect(details).toHaveCount(1);
    await expect(details).not.toHaveAttribute('open', '');
    await expect(toggle).toBeVisible();
    await expect(page.locator('.service-overview-lead')).toBeVisible();
    await expect(content).toBeHidden();
    // Important: the original Markdown remains in the initial server-rendered HTML,
    // not injected later with JavaScript or fetched only on click.
    expect(await content.locator('h2').count()).toBeGreaterThanOrEqual(3);
    expect(await content.locator('a[href^="/"]').count()).toBeGreaterThanOrEqual(3);

    await toggle.click();
    await expect(details).toHaveAttribute('open', '');
    await expect(content).toBeVisible();
    await expect(content.locator('h2').first()).toBeVisible();

    await toggle.click();
    await expect(details).not.toHaveAttribute('open', '');
    await expect(content).toBeHidden();
  });
}

test('service description expands with keyboard even when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });
    const details = page.locator('[data-service-details]');
    const toggle = details.locator('summary');
    const content = details.locator('[data-service-details-content]');
    await expect(content).toBeHidden();
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(content).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(content).toBeHidden();
    const sizes = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);
  } finally {
    await context.close();
  }
});
