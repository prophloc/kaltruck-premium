import { test, expect } from '@playwright/test';

const services = [
  { path: '/transport-hds/', photo: '/images/home/hero-hds-original.png', accent: 'kompromisów' },
  { path: '/transport-kontenerow/', photo: '/transport-kontenerow-03.jpg', accent: 'miejsce' },
  { path: '/transport-prefabrykatow/', photo: '/prefabrykaty-betonowe-07.jpg', accent: 'precyzyjnie' },
  { path: '/transport-maszyn/', photo: '/transport-przemys-owy-01.jpg', accent: 'kontrolą' },
  { path: '/rozladunek-hds/', photo: '/stacje-transformatorowe-05.jpg', accent: 'precyzją' },
  { path: '/wynajem-hds/', photo: '/montaz-latarni-03.jpg', accent: 'działania' },
] as const;

for (const service of services) {
  test(`${service.path} has centered cinematic two-line headline and relevant project photo on desktop`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(service.path, { waitUntil: 'domcontentloaded' });
    const hero = page.locator('.service-hero');
    const heading = hero.locator('h1');
    const lines = heading.locator('.service-headline-line');
    const accent = heading.locator('.service-headline-accent');
    await expect(lines).toHaveCount(2);
    await expect(accent).toHaveText(service.accent);
    await expect(hero.locator('img.service-hero-image')).toHaveAttribute('src', new RegExp(service.photo.replaceAll('.', '\\.').replaceAll('/', '\\/') + '$'));

    const geometry = await heading.evaluate((node) => {
      const lines = Array.from(node.querySelectorAll('.service-headline-line'));
      const rect = node.getBoundingClientRect();
      const boxes = lines.map(line => line.getBoundingClientRect());
      return {
        viewport: document.documentElement.clientWidth,
        headingCenter: rect.left + rect.width / 2,
        lineCount: boxes.length,
        firstY: boxes[0]?.y ?? 0,
        secondY: boxes[1]?.y ?? 0,
        firstHeight: boxes[0]?.height ?? 0,
        secondHeight: boxes[1]?.height ?? 0,
        longestWidth: Math.max(...boxes.map(box => box.width)),
        rightOverflow: boxes.some(box => box.right > innerWidth + 1 || box.left < -1),
      };
    });
    expect(Math.abs(geometry.headingCenter - geometry.viewport / 2)).toBeLessThanOrEqual(10);
    expect(geometry.lineCount).toBe(2);
    expect(geometry.secondY).toBeGreaterThanOrEqual(geometry.firstY + geometry.firstHeight - 1);
    expect(geometry.rightOverflow).toBe(false);
    expect(geometry.longestWidth).toBeLessThanOrEqual(geometry.viewport);
  });

  test(`${service.path} is readable and fits on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(service.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.service-copy h1 .service-headline-line')).toHaveCount(2);
    await expect(page.locator('.service-copy h1 .service-headline-accent')).toHaveText(service.accent);
    const viewportOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(viewportOverflow).toBe(false);
    const title = await page.locator('.service-copy h1').boundingBox();
    expect(title).not.toBeNull();
    expect(title!.x).toBeGreaterThanOrEqual(0);
    expect(title!.x + title!.width).toBeLessThanOrEqual(390);
  });
}
