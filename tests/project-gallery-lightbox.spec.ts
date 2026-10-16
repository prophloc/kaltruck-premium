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
