import { test, expect } from '@playwright/test';

test('clicking a realization photo opens a fullscreen lightbox with its description', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const project = page.locator('[data-project-group]').first();
  const expectedTitle = (await project.locator('h2').textContent())?.trim();
  expect(expectedTitle).toBeTruthy();

  await project.locator('[data-project-lightbox-open]').click();

  const lightbox = page.locator('[data-project-lightbox]');
  await expect(lightbox).toBeVisible();
  await expect(lightbox).toHaveAttribute('aria-hidden', 'false');
  await expect(lightbox.locator('[data-project-lightbox-title]')).toHaveText(expectedTitle!);
  await expect(lightbox.locator('[data-project-lightbox-description]')).not.toBeEmpty();
  await expect(lightbox.locator('[data-project-lightbox-image]')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/lightbox-open/);
});

test('lightbox navigates through every photo in the selected parent category and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });

  const project = page.locator('[data-project-group]').first();
  const category = await project.getAttribute('data-project-group');
  expect(category).toBeTruthy();

  await project.locator('[data-project-lightbox-open]').click();

  const lightbox = page.locator('[data-project-lightbox]');
  await expect(lightbox).toHaveAttribute('data-project-lightbox-category', category!);

  const total = Number(await lightbox.locator('[data-project-lightbox-total]').textContent());
  expect(total).toBeGreaterThan(1);

  const image = lightbox.locator('[data-project-lightbox-image]');
  const firstSrc = await image.getAttribute('src');
  await lightbox.locator('[data-project-lightbox-next]').click();
  await expect(image).not.toHaveAttribute('src', firstSrc!);

  await page.keyboard.press('ArrowLeft');
  await expect(image).toHaveAttribute('src', firstSrc!);

  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
  await expect(lightbox).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toHaveClass(/lightbox-open/);
});

test('desktop lightbox centers the photo, blends copy into the photo and docks navigation with thumbnails', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-project-group]').first().locator('[data-project-lightbox-open]').click();

  const lightbox = page.locator('[data-project-lightbox]');
  const image = lightbox.locator('[data-project-lightbox-image]');
  const overlay = lightbox.locator('[data-project-lightbox-overlay]');
  const controls = lightbox.locator('[data-project-lightbox-controls]');

  await expect(overlay).toBeVisible();
  await expect(overlay.locator('[data-project-lightbox-category-label]')).toBeVisible();
  await expect(overlay.locator('[data-project-lightbox-title]')).toBeVisible();
  await expect(overlay.locator('[data-project-lightbox-description]')).toBeVisible();
  await expect(controls.locator('[data-project-lightbox-prev]')).toBeVisible();
  await expect(controls.locator('[data-project-lightbox-next]')).toBeVisible();
  await expect(controls.locator('[data-project-lightbox-thumbs]')).toBeVisible();

  await expect.poll(
    () => image.evaluate((node) => {
      const img = node as HTMLImageElement;
      return img.complete && img.naturalWidth > 0 && img.getBoundingClientRect().width > 0;
    }),
    { timeout: 5000 },
  ).toBe(true);

  const readGeometry = () => page.evaluate(() => {
    const lightbox = document.querySelector('[data-project-lightbox]')?.getBoundingClientRect();
    const figure = document.querySelector('[data-project-lightbox-figure]')?.getBoundingClientRect();
    const image = document.querySelector('[data-project-lightbox-image]')?.getBoundingClientRect();
    const overlay = document.querySelector('[data-project-lightbox-overlay]')?.getBoundingClientRect();
    const controls = document.querySelector('[data-project-lightbox-controls]')?.getBoundingClientRect();
    if (!lightbox || !figure || !image || !overlay || !controls) return null;
    return {
      centered: Math.abs((image.left + image.width / 2) - (lightbox.left + lightbox.width / 2)) < 20,
      overlayInsideImage: overlay.left >= image.left - 2 && overlay.right <= image.right + 2 && overlay.top >= image.top - 2 && overlay.bottom <= image.bottom + 2,
      controlsBelowFigure: controls.top >= figure.bottom - 6,
    };
  });

  await expect.poll(readGeometry, { timeout: 5000 }).toEqual({
    centered: true,
    overlayInsideImage: true,
    controlsBelowFigure: true,
  });

  const firstThumb = controls.locator('[data-project-lightbox-thumb]').first();
  const thumbStyle = await firstThumb.evaluate((el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      backgroundColor: style.backgroundColor,
      paddingTop: style.paddingTop,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });

  expect(thumbStyle).toEqual({
    backgroundColor: 'rgb(13, 15, 17)',
    paddingTop: '3px',
    width: 80,
    height: 58,
  });
});

test('thumbnail rail has no visible scrollbar and geometric arrows align to thumbnail center', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/realizacje/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-project-group]').first().locator('[data-project-lightbox-open]').click();

  const lightbox = page.locator('[data-project-lightbox]');
  const controls = lightbox.locator('[data-project-lightbox-controls]');
  const firstThumbImage = controls.locator('[data-project-lightbox-thumb] img').first();
  const closeGlyph = lightbox.locator('[data-project-lightbox-close-glyph]');

  await expect(firstThumbImage).toBeVisible();
  await expect(closeGlyph).toBeVisible();

  const chrome = await page.evaluate(() => {
    const thumbs = document.querySelector('[data-project-lightbox-thumbs]') as HTMLElement | null;
    const thumbImage = document.querySelector('[data-project-lightbox-thumb] img') as HTMLElement | null;
    const prev = document.querySelector('[data-project-lightbox-prev]') as HTMLElement | null;
    const next = document.querySelector('[data-project-lightbox-next]') as HTMLElement | null;
    const close = document.querySelector('[data-project-lightbox-close]') as HTMLElement | null;
    const closeGlyph = document.querySelector('[data-project-lightbox-close-glyph]') as HTMLElement | null;
    if (!thumbs || !thumbImage || !prev || !next || !close || !closeGlyph) return null;

    const thumbRect = thumbImage.getBoundingClientRect();
    const prevRect = prev.getBoundingClientRect();
    const nextRect = next.getBoundingClientRect();
    const closeRect = close.getBoundingClientRect();
    const closeGlyphRect = closeGlyph.getBoundingClientRect();
    const prevStyle = getComputedStyle(prev);
    const nextStyle = getComputedStyle(next);
    const prevArrow = getComputedStyle(prev, '::before');
    const nextArrow = getComputedStyle(next, '::before');
    const centerY = (rect: DOMRect) => rect.top + rect.height / 2;
    const centerX = (rect: DOMRect) => rect.left + rect.width / 2;

    return {
      railBorder: getComputedStyle(thumbs).borderTopWidth,
      scrollbarWidth: getComputedStyle(thumbs).scrollbarWidth,
      prevBorder: prevStyle.borderTopWidth,
      nextBorder: nextStyle.borderTopWidth,
      prevCenterOffset: Math.abs(centerY(prevRect) - centerY(thumbRect)),
      nextCenterOffset: Math.abs(centerY(nextRect) - centerY(thumbRect)),
      prevFontSize: prevStyle.fontSize,
      nextFontSize: nextStyle.fontSize,
      prevDisplay: prevStyle.display,
      nextDisplay: nextStyle.display,
      prevAlign: prevStyle.alignItems,
      nextAlign: nextStyle.alignItems,
      prevJustify: prevStyle.justifyContent,
      nextJustify: nextStyle.justifyContent,
      prevArrowContent: prevArrow.content,
      nextArrowContent: nextArrow.content,
      prevArrowWidth: prevArrow.width,
      nextArrowWidth: nextArrow.width,
      closeXOffset: Math.abs(centerX(closeRect) - centerX(closeGlyphRect)),
      closeYOffset: Math.abs(centerY(closeRect) - centerY(closeGlyphRect)),
    };
  });

  expect(chrome).not.toBeNull();
  expect(chrome!.railBorder).toBe('0px');
  expect(chrome!.scrollbarWidth).toBe('none');
  expect(chrome!.prevBorder).toBe('0px');
  expect(chrome!.nextBorder).toBe('0px');
  expect(chrome!.prevCenterOffset).toBeLessThanOrEqual(1);
  expect(chrome!.nextCenterOffset).toBeLessThanOrEqual(1);
  expect(chrome!.prevFontSize).toBe('0px');
  expect(chrome!.nextFontSize).toBe('0px');
  expect(chrome!.prevDisplay).toBe('flex');
  expect(chrome!.nextDisplay).toBe('flex');
  expect(chrome!.prevAlign).toBe('center');
  expect(chrome!.nextAlign).toBe('center');
  expect(chrome!.prevJustify).toBe('center');
  expect(chrome!.nextJustify).toBe('center');
  expect(chrome!.prevArrowContent).not.toBe('none');
  expect(chrome!.nextArrowContent).not.toBe('none');
  expect(chrome!.prevArrowWidth).toBe('10px');
  expect(chrome!.nextArrowWidth).toBe('10px');
  expect(chrome!.closeXOffset).toBeLessThanOrEqual(2);
  expect(chrome!.closeYOffset).toBeLessThanOrEqual(2);
});
