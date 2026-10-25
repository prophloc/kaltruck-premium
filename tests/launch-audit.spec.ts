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

test('homepage hero presents the new HDS headline and three service cards', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.kt-hero-title')).toContainText('ŁADUNEK?');
  await expect(page.locator('.kt-hero-title')).toContainText('MY GO RUSZYMY.');
  await expect(page.locator('[data-kt-card]')).toHaveCount(3);
  await expect(page.locator('[data-kt-card][data-pos="0"]')).toHaveCount(1);
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

test('desktop header balances its edge gutters and keeps a tight premium rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const header = document.querySelector('.header-inner');
    const brand = document.querySelector('.brand');
    const actions = document.querySelector('.header-actions');
    const nav = document.querySelector('.desktop-nav');
    const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
    const brandRect = brand?.getBoundingClientRect();
    const actionsRect = actions?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    const firstNav = navLinks[0]?.getBoundingClientRect();
    const secondNav = navLinks[1]?.getBoundingClientRect();
    const children = header ? Array.from(header.children) : [];
    return {
      leftGutter: brandRect?.left ?? 0,
      rightGutter: navRect ? document.documentElement.clientWidth - navRect.right : 0,
      actionsAfterBrand: children.indexOf(actions as Element) === children.indexOf(brand as Element) + 1,
      navAfterActions: children.indexOf(nav as Element) > children.indexOf(actions as Element),
      actionsGap: brandRect && actionsRect ? actionsRect.left - brandRect.right : 9999,
      navGap: firstNav && secondNav ? secondNav.left - firstNav.right : 9999,
      actionsHeight: actionsRect?.height ?? 9999,
    };
  });

  expect(Math.abs(metrics.leftGutter - metrics.rightGutter)).toBeLessThanOrEqual(2);
  expect(metrics.leftGutter).toBeGreaterThanOrEqual(40);
  expect(metrics.actionsAfterBrand).toBeTruthy();
  expect(metrics.navAfterActions).toBeTruthy();
  expect(metrics.actionsGap).toBeLessThanOrEqual(20);
  expect(metrics.navGap).toBeLessThanOrEqual(20);
  expect(metrics.actionsHeight).toBeLessThanOrEqual(48);
});

test('homepage keeps a full-width service feature band below the hero', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const band = page.locator('.hero-bottom-copy');
  await expect(band.locator('.kt-feature-inner > span')).toHaveCount(3);
  const geometry = await band.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: rect.left,
      right: document.documentElement.clientWidth - rect.right,
      top: rect.top,
      heroBottom: document.querySelector('.hero')?.getBoundingClientRect().bottom ?? 0,
    };
  });
  expect(Math.abs(geometry.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.right)).toBeLessThanOrEqual(1);
  expect(geometry.heroBottom - geometry.top).toBeLessThanOrEqual(150);
});

test('homepage uses responsive linked service imagery instead of repeated story blocks', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.premium-services__grid')).toHaveCount(1);
  await expect(page.locator('.premium-service')).toHaveCount(5);
  await expect(page.locator('.premium-service img')).toHaveCount(5);
  const fits = await page.locator('.premium-service').evaluateAll((nodes) => nodes.every((node) => {
    const rect = node.getBoundingClientRect();
    return rect.left >= 0 && rect.right <= document.documentElement.clientWidth;
  }));
  expect(fits).toBeTruthy();
});

test('premium service tiles use featured-large, supporting-small proportions on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const dimensions = await page.locator('.premium-service').evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    const img = node.querySelector('img')?.getBoundingClientRect();
    return { width: rect.width, height: rect.height, imageFills: Boolean(img && img.width >= rect.width - 2 && img.height >= rect.height - 2) };
  }));
  expect(dimensions).toHaveLength(5);
  expect(dimensions[0].height).toBeGreaterThan(dimensions[2].height);
  expect(dimensions[0].width).toBeGreaterThan(dimensions[2].width);
  expect(dimensions.every((item) => item.imageFills)).toBeTruthy();
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
  await expect(cards).toHaveCount(10);
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
