import { test, expect } from '@playwright/test';

const routes = ['/', '/transport-hds/', '/wynajem-hds/', '/transport-kontenerow/', '/transport-prefabrykatow/', '/transport-maszyn/', '/rozladunek-hds/', '/sprzet/', '/realizacje/', '/o-nas/', '/kontakt/', '/wycena/'];
const supportingRoutes = ['/realizacje/', '/sprzet/', '/o-nas/', '/kontakt/', '/wycena/', '/transport-hds/'];

for (const route of routes) {
  test(`${route} passes launch smoke audit`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const images = page.locator('img');
    for (let i = 0; i < await images.count(); i++) {
      const img = images.nth(i);
      expect(Number(await img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(await img.getAttribute('height'))).toBeGreaterThan(0);
    }
  });
}

for (const width of [1920, 1440, 1366, 1024, 768, 390]) {
  test(`homepage stays inside viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const geometry = await page.evaluate(() => {
      const root = document.documentElement;
      const container = document.querySelector('.hero .container') ?? document.querySelector('main .container');
      const rect = container?.getBoundingClientRect();
      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        leftGutter: rect?.left ?? 0,
        rightGutter: rect ? root.clientWidth - rect.right : 0,
      };
    });

    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    if (width >= 1024) {
      expect(geometry.leftGutter).toBeGreaterThanOrEqual(28);
      expect(geometry.rightGutter).toBeGreaterThanOrEqual(28);
    } else {
      expect(geometry.leftGutter).toBeGreaterThanOrEqual(18);
      expect(geometry.rightGutter).toBeGreaterThanOrEqual(18);
    }
  });
}

for (const route of supportingRoutes) {
  for (const width of [1440, 1024, 768, 390]) {
    test(`${route} stays inside viewport at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const geometry = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    });
  }
}

test('homepage hero uses a three-line cinematic title composition', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const lines = page.locator('.hero-title-line');
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0)).toHaveText('TRANSPORT, KTÓRY');
  await expect(lines.nth(1)).toHaveText('PODNOSI');
  await expect(lines.nth(2)).toHaveText('WIĘCEJ.');
  await expect(page.locator('.hero-support')).toHaveCount(1);
});

test('homepage centers the cinematic hero group and uses the supplied KALTRUCK logo', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const logo = page.locator('.brand-logo');
  await expect(logo).toHaveAttribute('src', '/brand/kaltruck-logo.svg');
  await expect(logo).toBeVisible();

  const geometry = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const stage = document.querySelector('.hero-stage');
    const stageRect = stage?.getBoundingClientRect();
    const centerOffset = (rect?: DOMRect) => rect ? Math.abs((rect.left + rect.width / 2) - viewportWidth / 2) : 9999;
    return { stageCenterOffset: centerOffset(stageRect) };
  });

  expect(geometry.stageCenterOffset).toBeLessThanOrEqual(12);
});

test('homepage keeps the editorial service structure intact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.intro-grid')).toHaveCount(1);
  await expect(page.locator('.story')).toHaveCount(5);
  await expect(page.locator('.story .story-media img')).toHaveCount(5);
  const fits = await page.locator('.story-inner').evaluateAll((nodes) => nodes.every((node) => {
    const rect = node.getBoundingClientRect();
    return rect.left >= 0 && rect.right <= document.documentElement.clientWidth;
  }));
  expect(fits).toBeTruthy();
});

test('homepage service stories use balanced media proportions and optical alignment', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.locator('.story-inner').evaluateAll((nodes) => nodes.map((node) => {
    const media = node.querySelector('.story-media')?.getBoundingClientRect();
    const copy = node.querySelector('.story-copy')?.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    return {
      sectionHeight: rect.height,
      mediaRatio: media ? media.width / media.height : 0,
      centerDelta: media && copy ? Math.abs((media.top + media.height / 2) - (copy.top + copy.height / 2)) : 9999,
    };
  }));

  expect(metrics).toHaveLength(5);
  expect(metrics.every((item) => item.sectionHeight <= 650)).toBeTruthy();
  expect(metrics.every((item) => item.mediaRatio >= 1.35 && item.mediaRatio <= 1.75)).toBeTruthy();
  expect(metrics.every((item) => item.centerDelta <= 90)).toBeTruthy();
});

test('homepage utility sections keep a compact premium rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const box = (selector: string) => document.querySelector(selector)?.getBoundingClientRect();
    const equipment = box('.equipment');
    const equipmentHeading = box('.equipment-heading');
    const equipmentCopy = box('.equipment-copy');
    const process = box('.process');
    const cta = box('.cta');
    const footer = box('.site-footer');
    const centerY = (rect?: DOMRect) => rect ? rect.top + rect.height / 2 : 0;
    return {
      equipmentHeight: equipment?.height ?? 9999,
      equipmentCenterDelta: Math.abs(centerY(equipmentHeading) - centerY(equipmentCopy)),
      processHeight: process?.height ?? 9999,
      ctaHeight: cta?.height ?? 9999,
      footerHeight: footer?.height ?? 9999,
    };
  });

  expect(metrics.equipmentHeight).toBeLessThanOrEqual(620);
  expect(metrics.equipmentCenterDelta).toBeLessThanOrEqual(80);
  expect(metrics.processHeight).toBeLessThanOrEqual(700);
  expect(metrics.ctaHeight).toBeLessThanOrEqual(620);
  expect(metrics.footerHeight).toBeLessThanOrEqual(560);
});

test('realization gallery uses a controlled modular rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('[data-project-gallery] .project');
  await expect(cards).toHaveCount(8);
  const topDifference = await cards.evaluateAll((nodes) => {
    if (nodes.length < 2) return 0;
    return Math.abs(nodes[0].getBoundingClientRect().top - nodes[1].getBoundingClientRect().top);
  });
  expect(topDifference).toBeLessThanOrEqual(40);
});

test('keyboard focus remains visible and reduced motion has a global fallback', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus-visible');
  await expect(focused).toHaveCount(1);
  const css = await page.locator('html').evaluate(() => Array.from(document.styleSheets).some((sheet) => {
    try { return Array.from(sheet.cssRules).some((rule) => rule.cssText.includes('prefers-reduced-motion')); } catch { return false; }
  }));
  expect(css).toBeTruthy();
});

test('launch routes do not contain broken internal links', async ({ page, request }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((nodes) => [...new Set(nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')).filter(Boolean))] as string[]);
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
});
