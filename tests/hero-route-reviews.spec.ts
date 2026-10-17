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
  await expect(reviewsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(reviewsPanel).toBeHidden();

  await routeToggle.click();
  await expect(routeToggle).toHaveAttribute('aria-expanded', 'true');

  await reviewsToggle.click();
  await expect(reviewsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(reviewsPanel).toBeVisible();
  await expect(routeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-google-reviews] .google-reviews-attribution')).toHaveText('Google Maps');

  await page.keyboard.press('Escape');
  await expect(reviewsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(reviewsPanel).toBeHidden();
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
