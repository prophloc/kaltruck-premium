import { test, expect } from '@playwright/test';

test('route handle keeps a compact rotated Google pin with TRASA and the drawer heading mark stays text-sized', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const drawer = page.locator('[data-hero-route-drawer]');
  const toggle = drawer.locator('[data-hero-route-toggle]');
  const pin = toggle.locator('[data-google-maps-pin]');

  await expect(toggle.locator('[data-route-handle-label]')).toHaveText('TRASA');
  await expect(pin).toHaveCount(1);
  expect(await pin.evaluate((node) => getComputedStyle(node).transform)).not.toBe('none');

  await toggle.click();
  const heading = drawer.locator('[data-route-heading] h2');
  const headingPin = drawer.locator('[data-route-heading] [data-google-maps-pin]');
  await expect(heading).toHaveText('Sprawdź trasę transportu');

  const sizing = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>('[data-hero-route-drawer] [data-route-heading] h2');
    const mark = document.querySelector<HTMLElement>('[data-hero-route-drawer] [data-route-heading] [data-google-maps-pin]');
    if (!title || !mark) return null;
    return {
      titleFontSize: parseFloat(getComputedStyle(title).fontSize),
      markHeight: mark.getBoundingClientRect().height,
    };
  });

  expect(sizing).not.toBeNull();
  expect(sizing!.markHeight).toBeLessThanOrEqual(sizing!.titleFontSize + 2);
});

test('right-side OPINIE drawer opens, closes the route drawer and keeps Google Maps attribution visible', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const routeToggle = page.locator('[data-hero-route-toggle]');
  const reviewsDrawer = page.locator('[data-hero-reviews-drawer]');
  const reviewsToggle = page.locator('[data-hero-reviews-toggle]');
  const reviewsPanel = page.locator('[data-hero-reviews-panel]');

  await expect(reviewsDrawer).toHaveCount(1);
  await expect(reviewsToggle).toHaveText(/OPINIE/);
  const star = reviewsToggle.locator('[data-reviews-handle-star]');
  await expect(star).toHaveText('★');
  await expect(star).toBeVisible();
  await expect(reviewsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(reviewsPanel).toBeHidden();
  const collapsedColor = await star.evaluate((node) => getComputedStyle(node).color);

  await routeToggle.click();
  await expect(routeToggle).toHaveAttribute('aria-expanded', 'true');

  await reviewsToggle.click();
  await expect(reviewsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(reviewsPanel).toBeVisible();
  await expect(routeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => star.evaluate((node) => getComputedStyle(node).color)).not.toBe(collapsedColor);
  await expect(star).toBeVisible();
  const reviews = page.locator('[data-google-reviews]');
  await expect(reviews.locator('.google-reviews-kicker')).toHaveText('OPINIE KLIENTÓW');
  await expect(reviews.locator('.google-reviews-brand')).toHaveAttribute('src', '/brand/kaltruck-logo.svg');
  await expect(reviews.locator('.google-reviews-attribution')).toHaveAttribute('aria-label', /Google Maps/);
  await expect(reviews.locator('.google-reviews-attribution-logo')).toHaveAttribute('src', '/brand/google-reviews-stars.svg');
  const googleBadge = await page.request.get('/brand/google-reviews-stars.svg');
  expect(googleBadge.ok()).toBeTruthy();
  await expect(reviews.locator('.google-reviews-brand')).toBeVisible();
  await expect(reviews.locator('.google-reviews-attribution-logo')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(reviewsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(reviewsPanel).toBeHidden();
  await expect.poll(() => star.evaluate((node) => getComputedStyle(node).color)).toBe(collapsedColor);
});

test('reviews drawer renders Google rating and review author attribution from Places when configured', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.route('https://maps.googleapis.com/maps/api/js**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.google = {
          maps: {
            importLibrary: async () => ({
              Place: class {
                constructor() {
                  this.attributions = ['Dane testowe partnera'];
                }
                async fetchFields() {
                  this.displayName = 'Transport Usługi HDS KalTruck Płock';
                  this.rating = 4.9;
                  this.userRatingCount = 37;
                  this.googleMapsURI = 'https://www.google.com/maps/place/test';
                  this.reviews = [{
                    rating: 5,
                    text: 'Szybko, sprawnie i profesjonalnie.',
                    relativePublishTimeDescription: 'miesiąc temu',
                    authorAttribution: {
                      displayName: 'Jan Kowalski',
                      uri: 'https://www.google.com/maps/contrib/test',
                      photoURI: ''
                    }
                  }];
                }
              }
            })
          }
        };
      `,
    });
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const reviews = page.locator('[data-google-reviews]');
  await reviews.evaluate((node) => {
    node.setAttribute('data-api-key', 'test-key');
    node.setAttribute('data-place-id', 'test-place-id');
  });

  await page.locator('[data-hero-reviews-toggle]').click();

  await expect(reviews.locator('[data-google-reviews-rating]')).toContainText('4.9');
  await expect(reviews.locator('[data-google-reviews-count]')).toContainText('37');
  await expect(reviews.locator('[data-google-review-card]')).toHaveCount(1);
  await expect(reviews.locator('[data-google-review-card]')).toContainText('Jan Kowalski');
  await expect(reviews.locator('[data-google-review-card]')).toContainText('Szybko, sprawnie i profesjonalnie.');
  await expect(reviews.locator('.google-reviews-third-party')).toContainText('Dane testowe partnera');
});

test('social links appear only in the footer, not in the hero', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero-social-tabs, .hero-social-tab')).toHaveCount(0);
  const footerSocials = page.locator('.footer-socials a');
  await expect(footerSocials).toHaveCount(2);
  await expect(footerSocials.nth(0)).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61561070733012');
  await expect(footerSocials.nth(1)).toHaveAttribute('href', 'https://www.instagram.com/transporthdsplock/');
});

test('social footer and favicon/Open Graph previews are configured', async ({ page }) => {
  for (const route of ['/', '/transport-hds/', '/transport-kontenerow/']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const fb = page.locator('.footer-socials a').filter({ hasText: 'Facebook' });
    const ig = page.locator('.footer-socials a').filter({ hasText: 'Instagram' });
    await expect(fb).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61561070733012');
    await expect(ig).toHaveAttribute('href', 'https://www.instagram.com/transporthdsplock/');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg?v=kaltruck-h-4');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://plockhds.pl/og-image-v02.jpg');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://plockhds.pl/og-image-v02.jpg');
  }
  for (const path of ['/favicon.svg', '/brand/facebook-icon.svg', '/brand/instagram-icon.svg', '/site.webmanifest']) {
    const response = await page.request.get(path);
    expect(response.ok(), path).toBeTruthy();
  }
});

test('Google review attribution is more compact on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-hero-reviews-toggle]').click();
  const logo = page.locator('.google-reviews-attribution-logo');
  await expect(logo).toBeVisible();
  const width = await logo.evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeLessThanOrEqual(96);
  expect(width).toBeGreaterThanOrEqual(90);
});

test('Kaltruck favicon is exactly a legible gold H on a dark square', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const response = await page.request.get('/favicon.svg?v=kaltruck-h-4');
  expect(response.ok()).toBeTruthy();
  const svg = await response.text();
  expect(svg).toContain('viewBox="0 0 64 64"');
  expect(svg).toContain('H - KALTRUCK HDS');
  expect(svg).toContain('fill="#090C10"');
  expect(svg).toContain('fill="#E1B967"');
  expect(svg).toContain('d="M13 12h11v15h16V12h11v40H40V37H24v15H13Z"');
  expect(svg).not.toContain('Samochód');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
});
