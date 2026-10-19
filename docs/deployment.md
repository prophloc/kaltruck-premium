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

## Google Reviews on plockhds.pl (required for the cPanel ZIP)

The reviews drawer uses **Maps JavaScript API + Places API (New)** in the browser, with the KALTRUCK Google Place ID. A working local `.env` file is **not** uploaded to GitHub Actions and cannot configure an already compiled `dist/` on cPanel.

**One-time setup in GitHub:**

1. Open [repository Actions secrets](https://github.com/prophloc/kaltruck-premium/settings/secrets/actions).
2. In **Repository secrets**, select **New repository secret**.
3. Set name exactly `KALTRUCK_GOOGLE_MAPS_API_KEY`; paste the working Google Maps **browser API key** as its value. Never commit this value into the repository.
4. In Google Cloud, ensure the project has **billing enabled**, **Maps JavaScript API** and **Places API (New)** enabled. Restrict application use to HTTP referrers including `https://plockhds.pl/*` and `https://www.plockhds.pl/*` (plus the relevant localhost referrer for development). Restrict API access to the required APIs.
5. Open **Actions → Prepare plockhds.pl cPanel package → Run workflow**, then download the new `plockhds-cpanel-ready` artifact, unpack its inner ZIP into the domain's document root on cPanel.

The workflow now **fails** rather than producing a ZIP when the secret is absent or not embedded in `dist/index.html`. Do **not** redeploy an older package that passed before this validation existed.

**Quick production check:** open `https://plockhds.pl/`, expand the **OPINIE** drawer, and verify the star rating and review list. If the drawer says it cannot load reviews (rather than requesting the key), check the browser console for `[KALTRUCK GOOGLE REVIEWS]` and verify the referrer restrictions, billing, and enabled APIs. To check configuration without exposing the key, run:

```js
Boolean(document.querySelector('[data-google-reviews]')?.getAttribute('data-api-key'))
```

A `true` result confirms only that a key was compiled into the page, not that Google accepted it.

**Manual local build:** set `PUBLIC_SITE_URL=https://plockhds.pl` and `PUBLIC_GOOGLE_MAPS_API_KEY` in a private local `.env` before `npm run build`. The production build intentionally fails if the key is missing.

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
