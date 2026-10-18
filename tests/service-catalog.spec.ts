import { test, expect } from '@playwright/test';

test('transport HDS hero presents the full service catalog as five document panels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const catalog = page.locator('[data-service-catalog]');
  await expect(catalog).toBeVisible();
  await expect(catalog.locator('[data-service-panel]')).toHaveCount(5);
  await expect(catalog.locator('[data-service-item]')).toHaveCount(31);
  await expect(catalog.locator('[data-service-panel][data-active="true"]')).toHaveCount(1);

  const heroContainsCatalog = await page.evaluate(() => {
    const hero = document.querySelector('.service-hero');
    const catalog = document.querySelector('[data-service-catalog]');
    return Boolean(hero && catalog && hero.contains(catalog));
  });
  expect(heroContainsCatalog).toBeTruthy();

  await expect(page.locator('.service-body').getByRole('heading', { name: 'Pełny zakres usług HDS' })).toHaveCount(0);
});

test('service catalog controls switch the visible document panel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const catalog = page.locator('[data-service-catalog]');
  const panels = catalog.locator('[data-service-panel]');
  await expect(panels.nth(0)).toHaveAttribute('data-active', 'true');

  await catalog.locator('[data-service-nav-index="1"]').click();

  await expect(panels.nth(0)).toHaveAttribute('data-active', 'false');
  await expect(panels.nth(1)).toHaveAttribute('data-active', 'true');
  await expect(panels.nth(1).getByRole('heading', { name: 'Budownictwo i infrastruktura' })).toBeVisible();
});

test('desktop keeps the original left hero placement and centers a frameless catalog in the right half', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const copy = document.querySelector('.service-copy')?.getBoundingClientRect();
    const heading = document.querySelector('.service-copy h1')?.getBoundingClientRect();
    const catalog = document.querySelector('[data-service-catalog]')?.getBoundingClientRect();
    const panel = document.querySelector('[data-service-panel][data-active="true"]');
    const style = panel ? getComputedStyle(panel) : null;
    const catalogCenter = catalog ? catalog.left + catalog.width / 2 : 0;
    return {
      viewport,
      copyLeft: copy?.left ?? 0,
      headingWidth: heading?.width ?? 9999,
      catalogLeft: catalog?.left ?? 0,
      catalogRight: catalog?.right ?? 0,
      catalogCenter,
      panelBackgroundImage: style?.backgroundImage ?? '',
      panelBackgroundColor: style?.backgroundColor ?? '',
      panelBorderTopWidth: style?.borderTopWidth ?? '',
      panelBoxShadow: style?.boxShadow ?? '',
    };
  });

  expect(metrics.copyLeft).toBeGreaterThanOrEqual(40);
  expect(metrics.headingWidth).toBeLessThan(metrics.viewport * 0.55);
  expect(metrics.catalogLeft).toBeGreaterThanOrEqual(metrics.viewport / 2);
  expect(metrics.catalogRight).toBeLessThanOrEqual(metrics.viewport + 1);
  expect(Math.abs(metrics.catalogCenter - metrics.viewport * 0.75)).toBeLessThanOrEqual(90);
  expect(metrics.panelBackgroundImage).toBe('none');
  expect(metrics.panelBackgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(metrics.panelBorderTopWidth).toBe('0px');
  expect(metrics.panelBoxShadow).toBe('none');
});

test('desktop aligns the right category label with the left eyebrow and uses a darker blurred backdrop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const leftEyebrow = document.querySelector('.service-copy .eyebrow')?.getBoundingClientRect();
    const rightMeta = document.querySelector('[data-service-panel][data-active="true"] .service-document__meta')?.getBoundingClientRect();
    const stage = document.querySelector('.service-catalog__stage');
    const stageBackdrop = stage ? getComputedStyle(stage, '::before') : null;
    const background = stageBackdrop?.backgroundColor ?? '';
    const alphaMatch = background.match(/rgba?\([^,]+,[^,]+,[^,]+(?:,\s*([\d.]+))?\)/);
    return {
      leftEyebrowTop: leftEyebrow?.top ?? 0,
      rightMetaTop: rightMeta?.top ?? 9999,
      stageBackdropFilter: stageBackdrop?.backdropFilter ?? 'none',
      stageWebkitBackdropFilter: stageBackdrop?.getPropertyValue('-webkit-backdrop-filter') ?? 'none',
      backdropAlpha: alphaMatch?.[1] ? Number.parseFloat(alphaMatch[1]) : 1,
    };
  });

  expect(Math.abs(metrics.rightMetaTop - metrics.leftEyebrowTop)).toBeLessThanOrEqual(8);
  expect(`${metrics.stageBackdropFilter} ${metrics.stageWebkitBackdropFilter}`).toContain('blur(');
  expect(metrics.backdropAlpha).toBeGreaterThanOrEqual(0.2);
});

test('category numbers sit below the text, include upward arrows and are visually larger', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const metrics = await page.evaluate(() => {
    const stage = document.querySelector('.service-catalog__stage')?.getBoundingClientRect();
    const controls = document.querySelector('.service-catalog__controls')?.getBoundingClientRect();
    const firstButton = document.querySelector('[data-service-nav-index="0"]');
    const buttonStyle = firstButton ? getComputedStyle(firstButton) : null;
    return {
      stageBottom: stage?.bottom ?? 9999,
      controlsTop: controls?.top ?? 0,
      firstText: firstButton?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      firstFontSize: buttonStyle ? Number.parseFloat(buttonStyle.fontSize) : 0,
    };
  });

  expect(metrics.controlsTop).toBeGreaterThan(metrics.stageBottom);
  expect(metrics.firstText).toContain('↑');
  expect(metrics.firstText).toContain('01');
  expect(metrics.firstFontSize).toBeGreaterThanOrEqual(13);
});

test('category controls stay below the longest service list', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

  const catalog = page.locator('[data-service-catalog]');
  await catalog.locator('[data-service-nav-index="1"]').click();
  await expect(catalog.locator('[data-service-panel]').nth(1)).toHaveAttribute('data-active', 'true');

  const spacing = await page.evaluate(() => {
    const activePanel = document.querySelector('[data-service-panel][data-active="true"]');
    const list = activePanel?.querySelector('ul')?.getBoundingClientRect();
    const controls = document.querySelector('.service-catalog__controls')?.getBoundingClientRect();
    return {
      listBottom: list?.bottom ?? 9999,
      controlsTop: controls?.top ?? 0,
    };
  });

  expect(spacing.controlsTop - spacing.listBottom).toBeGreaterThanOrEqual(18);
});

test('service catalog fits the hero on desktop and stacks safely on mobile', async ({ page }) => {
  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/transport-hds/', { waitUntil: 'domcontentloaded' });

    const geometry = await page.locator('[data-service-catalog]').evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        viewport: document.documentElement.clientWidth,
      };
    });

    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
  }
});
