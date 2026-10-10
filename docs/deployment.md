# Deployment — KALTRUCK Premium

## Build

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run test:run
npx playwright install chromium
npm run test:e2e
npm run build
```

Astro generates the static website into `dist/`. Upload the contents of `dist/` to the document root of the target domain or deploy the repository to a static hosting provider.

## Required production configuration

Set `PUBLIC_SITE_URL` to the final HTTPS origin before the production build. This single value drives canonical URLs, Open Graph URLs, structured data, robots and sitemap references.

Set `PUBLIC_FORM_ENDPOINT` only after the receiving endpoint is tested end-to-end. Until it is configured, the quote form intentionally disables its submit button and shows the verified KALTRUCK phone/e-mail fallback so enquiries cannot be silently lost.

## cPanel / traditional hosting

1. Run `npm install && npm run build` locally or in CI.
2. Upload the contents of `dist/` to the target domain's public directory.
3. Ensure directory-index routing is enabled so `/kontakt/` serves `/kontakt/index.html`.
4. Configure the form endpoint (PHP or external HTTPS form endpoint) and rebuild with `PUBLIC_FORM_ENDPOINT`.
5. Verify `robots.txt`, `sitemap-index.xml`, canonical tags and one real form delivery on the public host.

## Pre-launch content check

Compare the new site side by side with `hdsplock.pl`. Confirm that each launch service page has a distinct search intent, title, H1, intro and body copy. Do not add mass-generated location pages. Confirm all equipment values and company facts against source materials before changing them.

## Performance / accessibility check

Run Lighthouse/PageSpeed against the deployed preview on representative mobile and desktop profiles. Confirm keyboard navigation, visible focus, reduced-motion behavior, responsive image crops, no broken links and no unexpected layout shift.
