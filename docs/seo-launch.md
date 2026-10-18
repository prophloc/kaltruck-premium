# KALTRUCK Premium — SEO launch checklist

## Before publishing

- Set `PUBLIC_SITE_URL` to the **final HTTPS origin** (e.g. `https://twoja-domena.pl`) before `npm run build`. Development `http://localhost:4321` must **never** be used in production.
- Keep the six individual service URLs distinct. Do not redirect them all to the homepage.
- Check the business address, phone numbers, service coverage, image rights and statements about equipment before release. Current schema address: Tokarska 40, 09-401 Płock.
- Check that the six service pages are useful and substantially different from the corresponding content on `hdsplock.pl`; do not copy whole passages from the original.
- If the original site remains live, treat Premium as a separate site with independent purpose and content. Do not point all canonicals at the old domain, and do not use aggressive city-page duplication to manufacture rankings.

## Build and verify

```bash
npm install
npm run test:run
npm run build
npx playwright test --project=chromium
```

After deploying to the final domain, verify these URLs in a browser or with `curl`:

- `https://<production-domain>/robots.txt`
- `https://<production-domain>/sitemap-index.xml`
- `https://<production-domain>/transport-hds/`
- `https://<production-domain>/transport-kontenerow/`

Check each page's canonical and rendered title. Sitemap, `robots.txt`, Organization/LocalBusiness, Open Graph and Service URLs must all use the final domain, not localhost or preview. Check that the canonical uses HTTPS and the actual preferred host.

Use Google's Rich Results Test to inspect the structured data; valid markup does not guarantee a rich result. Use Lighthouse/PageSpeed Insights to audit Core Web Vitals, particularly because some photographs load from `hdsplock.pl` and external map/review APIs can slow the page.

## Post-launch

1. Verify the **new** domain in Google Search Console, submit `/sitemap-index.xml`, and inspect indexing of every major service page.
2. Compare queries, impressions, clicks and indexed-page coverage after a few weeks. Do not treat a deployment as proof of ranking gains.
3. Monitor any keyword overlap with the original site. If both sites serve the same audience, compare queries before adding further overlapping pages.
4. Collect authentic project descriptions and original photographs for the service pages. Replace generic claims with measured, verified information when available.
5. Improve internal links from genuine realizations to their most relevant service page without changing the existing gallery experience.

**Note:** Google Search Console, live performance scores and rankings require access to the deployed site. They cannot be confirmed from this repository alone.
