# KALTRUCK Premium Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a second, premium/cinematic KALTRUCK website in Astro that is fast, crawlable, conversion-focused, and intentionally distinct from hdsplock.pl while reusing only verified company facts and authentic project photography.

**Architecture:** Static-first Astro site with reusable page sections, content-driven service pages, minimal client-side JavaScript, centralized SEO/config data, and image optimization through Astro. The launch branch remains independently deployable; canonical host and form delivery are injected through configuration so component work is not blocked by the final hosting decision.

**Tech Stack:** Astro, TypeScript where useful for shared data contracts, CSS custom properties, Astro image optimization, Vitest for utility/content validation, Playwright for smoke/accessibility/navigation checks, npm scripts for build/lint/test.

**Spec:** `docs/superpowers/specs/2026-10-10-kaltruck-premium-site-design.md`

## Global Constraints

- Brand remains KALTRUCK / Kalwasińscy.
- Visual direction is premium / cinematic industrial, not a clone of webbuilding.lv or hdsplock.pl.
- Use only verified company facts and authentic KALTRUCK imagery from source materials.
- Primary content must render as static HTML.
- Client-side JavaScript must remain minimal and justified by interaction needs.
- No autoplay background video, heavy animation framework, custom CMS, mass-generated city pages, or WebGL/3D in v1.
- All service pages require unique title, meta description, H1, intro, and search intent.
- FAQ structured data may exist only when visible FAQ content matches it exactly.
- Canonicals, sitemap, robots, Open Graph and structured data must be production-ready before launch.
- Respect `prefers-reduced-motion`, keyboard access, visible focus, semantic headings, form labels, and `tel:` actions.
- `main` must remain deployable; implementation uses logically separated commits.
- Do not commit generated build output unless the chosen deployment target requires it.

## Review Focus

- Missing production domain: development must still build with a safe placeholder/base URL and make the canonical host a single configuration change.
- Missing or unverified company facts: UI must omit unknown values instead of rendering invented placeholders as facts.
- Broken image references or unsupported crops: every page must degrade without layout shift and all critical images must have dimensions/alt text.
- JavaScript disabled or reduced-motion enabled: primary content, navigation links, phone CTA and quote path must remain usable.
- Duplicate SEO content between service routes: automated checks must catch repeated titles/H1s/intros before launch.

---

### Task 1: Project foundation and quality gates

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/config/site.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `tests/site-config.test.ts`

**Interfaces:**
- Produces: `siteConfig` with `brandName`, `legalName`, `siteUrl`, `phone`, `email`, `serviceArea`, and social-image defaults.
- Produces: `BaseLayout` props `{ title, description, canonicalPath, image?, noindex? }`.

- [ ] **Step 1: Write failing config tests**

Create `tests/site-config.test.ts` asserting that `siteConfig.brandName === 'KALTRUCK'`, `siteUrl` is a valid absolute URL, and unverified optional facts may be `undefined` but never fake sentinel strings such as `TODO`, `123`, or `example.com` in production mode.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --run tests/site-config.test.ts`
Expected: FAIL because project/config does not exist yet.

- [ ] **Step 3: Initialize Astro and base layout**

Create the Astro project, central site config, CSS tokens, global reset/typography, and `BaseLayout` with canonical/meta/OG hooks. Keep production host configurable via environment with a safe local fallback for development only.

- [ ] **Step 4: Verify**

Run: `npm test -- --run tests/site-config.test.ts && npm run build`
Expected: tests PASS and Astro production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: initialize Astro site foundation"
```

### Task 2: Shared navigation, footer and accessibility shell

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/MobileMenu.astro`
- Create: `tests/navigation.spec.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `siteConfig` from Task 1.
- Produces: shared header/footer shell with primary routes and phone/quote CTA.

- [ ] **Step 1: Write failing navigation smoke test**

In `tests/navigation.spec.ts`, assert desktop and mobile render links for `Usługi`, `Realizacje`, `Sprzęt`, `O nas`, `Kontakt`, a quote CTA, and a `tel:` link when a verified phone exists. Assert the menu is keyboard reachable and the page remains navigable with JavaScript disabled.

- [ ] **Step 2: Run and confirm failure**

Run: `npx playwright test tests/navigation.spec.ts`
Expected: FAIL because shared navigation does not exist.

- [ ] **Step 3: Implement shell**

Build transparent-over-hero header with scroll-state styling, compact accessible mobile navigation, skip link, visible focus styles, and footer. Use tiny vanilla script only for menu/open-state and header scroll treatment.

- [ ] **Step 4: Verify**

Run: `npx playwright test tests/navigation.spec.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/layouts src/styles tests/navigation.spec.ts
git commit -m "feat: add accessible site navigation shell"
```

### Task 3: Homepage cinematic composition

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/CapabilityStrip.astro`
- Create: `src/components/ServiceStory.astro`
- Create: `src/components/EquipmentSection.astro`
- Create: `src/components/ProcessSteps.astro`
- Create: `src/components/CTASection.astro`
- Create: `src/pages/index.astro`
- Create: `tests/homepage.spec.ts`

**Interfaces:**
- Consumes: `BaseLayout`, `siteConfig`, verified content records.
- Produces: homepage sections with reusable props for later service pages.

- [ ] **Step 1: Write failing homepage test**

Assert one visible H1 containing `TRANSPORT, KTÓRY`, quote and phone CTAs, all five service-story themes, the four process steps, and no fabricated capability values when source data is absent.

- [ ] **Step 2: Run and confirm failure**

Run: `npx playwright test tests/homepage.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implement homepage**

Build near-full-height hero, capability strip, alternating editorial service stories, verified equipment/capability block, four-step process and final conversion section. Add CSS/native-motion reveals with `prefers-reduced-motion` fallbacks.

- [ ] **Step 4: Verify**

Run: `npx playwright test tests/homepage.spec.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/pages/index.astro tests/homepage.spec.ts
git commit -m "feat: build cinematic KALTRUCK homepage"
```

### Task 4: Service content model and dedicated SEO routes

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/services/*.md`
- Create: `src/layouts/ServiceLayout.astro`
- Create: `src/pages/transport-hds.astro`
- Create: `src/pages/wynajem-hds.astro`
- Create: `src/pages/transport-kontenerow.astro`
- Create: `src/pages/transport-prefabrykatow.astro`
- Create: `src/pages/transport-maszyn.astro`
- Create: `src/pages/rozladunek-hds.astro`
- Create: `tests/seo-uniqueness.test.ts`

**Interfaces:**
- Produces: service content schema `{ slug, title, metaDescription, h1, intro, body, serviceType, heroImage?, faq? }`.
- Produces: six launch service routes with distinct intent and metadata.

- [ ] **Step 1: Write failing uniqueness tests**

Assert all six services have unique `title`, `metaDescription`, `h1`, and `intro`, and none match the homepage H1. Reject empty fields and duplicate normalized values.

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- --run tests/seo-uniqueness.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement service model and pages**

Create typed content schema, original Polish copy for each approved route, service-specific CTA/internal links, and a reusable `ServiceLayout`. Keep facts conservative where source verification is incomplete.

- [ ] **Step 4: Verify**

Run: `npm test -- --run tests/seo-uniqueness.test.ts && npm run build`
Expected: PASS and all routes build.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content src/layouts/ServiceLayout.astro src/pages tests/seo-uniqueness.test.ts
git commit -m "feat: add SEO-focused service landing pages"
```

### Task 5: Realizations, equipment and supporting pages

**Files:**
- Create: `src/content/realizations/*.md`
- Create: `src/components/ProjectGallery.astro`
- Create: `src/pages/realizacje.astro`
- Create: `src/pages/sprzet.astro`
- Create: `src/pages/o-nas.astro`
- Create: `src/pages/kontakt.astro`
- Create: `tests/content-pages.spec.ts`
- Add: curated optimized images under `src/assets/images/` or `public/images/` according to Astro image needs.

**Interfaces:**
- Produces: realization records `{ title, category, image, alt, summary? }`.
- Produces: supporting routes required by the approved information architecture.

- [ ] **Step 1: Write failing content-page tests**

Assert routes return 200, gallery images have non-empty alt text and dimensions, categories render without client JS, and equipment page does not display values absent from verified source records.

- [ ] **Step 2: Run and confirm failure**

Run: `npx playwright test tests/content-pages.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Curate assets and build pages**

Select authentic source images intentionally, generate responsive derivatives through Astro where practical, implement editorial/masonry-style gallery without a heavy framework, and build equipment/about/contact routes.

- [ ] **Step 4: Verify**

Run: `npx playwright test tests/content-pages.spec.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/assets src/content/realizations src/components/ProjectGallery.astro src/pages tests/content-pages.spec.ts
git commit -m "feat: add realizations and company detail pages"
```

### Task 6: Quote flow with deployment-safe form adapter

**Files:**
- Create: `src/components/QuoteForm.astro`
- Create: `src/lib/form-config.ts`
- Create: `src/pages/wycena.astro`
- Create: `tests/quote-form.spec.ts`
- Modify: `src/pages/kontakt.astro`

**Interfaces:**
- Produces: form fields `name/company`, `phone/email`, `cargo`, `origin/destination`, optional `dimensions/weight`, `preferred date`, `message`.
- Produces: `formConfig` that selects a deployment-specific submit target without changing page markup.

- [ ] **Step 1: Write failing form tests**

Assert labels are associated with inputs, required contact/cargo fields validate, optional dimensions/date remain optional, the form works with a configured endpoint, and missing production endpoint never silently discards submissions.

- [ ] **Step 2: Run and confirm failure**

Run: `npx playwright test tests/quote-form.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implement form adapter and UI**

Build an accessible short quote form. Keep backend transport configurable so cPanel/PHP or an external form endpoint can be selected after hosting details are known. In production without an endpoint, show a clear phone/email fallback rather than pretending submission succeeded.

- [ ] **Step 4: Verify**

Run: `npx playwright test tests/quote-form.spec.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/QuoteForm.astro src/lib/form-config.ts src/pages tests/quote-form.spec.ts
git commit -m "feat: add quote and contact flow"
```

### Task 7: Structured SEO, sitemap, robots and FAQ

**Files:**
- Create: `src/components/FAQ.astro`
- Create: `src/lib/seo.ts`
- Create: `src/pages/robots.txt.ts`
- Add/configure sitemap integration in `astro.config.mjs`
- Create: `tests/structured-seo.test.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: applicable service/home pages

**Interfaces:**
- Produces: JSON-LD helpers for Organization/LocalBusiness, Service, BreadcrumbList and FAQPage.
- Consumes: only verified site/service data and visible FAQ items.

- [ ] **Step 1: Write failing SEO tests**

Assert canonical URLs derive from `siteConfig.siteUrl`, sitemap excludes noindex pages, robots points to sitemap, FAQ JSON-LD exactly matches rendered questions/answers, and service/breadcrumb schema uses the route's real content.

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- --run tests/structured-seo.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement SEO utilities and markup**

Add canonical/OG/Twitter defaults, schema helpers, visible FAQ blocks where useful, robots and sitemap. Do not emit LocalBusiness facts that are not verified.

- [ ] **Step 4: Verify**

Run: `npm test -- --run tests/structured-seo.test.ts && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/components/FAQ.astro src/lib/seo.ts src/pages/robots.txt.ts src/layouts src/pages tests/structured-seo.test.ts
git commit -m "seo: add metadata and structured data"
```

### Task 8: Performance, accessibility and launch readiness

**Files:**
- Create: `tests/launch-audit.spec.ts`
- Create: `README.md`
- Create: `docs/deployment.md`
- Modify: images/styles/components as audit findings require.

**Interfaces:**
- Consumes: complete site.
- Produces: reproducible launch checklist and deployment instructions.

- [ ] **Step 1: Add launch audit tests**

Assert no broken internal links across launch routes, one H1 per page, visible focus for keyboard navigation, reduced-motion disables non-essential animation, critical images have sizing, and all required routes respond successfully.

- [ ] **Step 2: Run full suite and record failures**

Run: `npm test -- --run && npx playwright test && npm run build`
Expected: any failures identify launch blockers.

- [ ] **Step 3: Fix material performance/accessibility issues**

Optimize oversized imagery, loading priorities, CSS/JS, focus states, motion and metadata based on measurable failures. Run Lighthouse/PageSpeed manually against a preview URL once deployment preview exists.

- [ ] **Step 4: Document deployment and content verification**

Document environment variables for canonical host/form endpoint, build command/output directory, cPanel/static-host deployment, and pre-launch side-by-side checks against hdsplock.pl for titles/H1/copy overlap.

- [ ] **Step 5: Final verification**

Run: `npm test -- --run && npx playwright test && npm run build`
Expected: all PASS. Then manually validate structured data, sitemap, robots, canonical URLs and form delivery on the target host.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "perf: finalize accessibility and launch readiness"
```

## Self-review result

- Spec coverage: homepage, service routes, supporting pages, authentic imagery, quote flow, SEO/schema, accessibility, performance and deployment are all mapped to tasks.
- Step granularity: each task has an independent failing test, implementation boundary, verification command and commit.
- Type/interface consistency: `siteConfig`, `BaseLayout`, service content schema, realization records and form config are defined before downstream use.
- Review Focus coverage: production-domain fallback (Tasks 1/7), missing facts (Tasks 1/3/5/7), images (Tasks 5/8), JS/reduced motion (Tasks 2/3/8), duplicate SEO copy (Task 4).
- Proportion: plan intentionally specifies interfaces and acceptance criteria without scripting component bodies.
