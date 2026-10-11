# KALTRUCK Professional Layout Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing KALTRUCK Astro site into a professionally composed premium industrial website with consistent alignment, spacing, proportions and responsive behavior while preserving the current content, SEO structure and visual identity.

**Architecture:** Keep the current static Astro component structure and solve the visual issues primarily through a shared layout system in global styles plus focused component-level refinements. The work is split into five reviewable stages so each stage can be tested and committed independently before the next one builds on it.

**Tech Stack:** Astro 5, CSS, TypeScript, Vitest, Playwright

**Spec:** `docs/superpowers/specs/2026-10-11-professional-layout-polish-design.md`

## Global Constraints

- Preserve the dark industrial / cinematic KALTRUCK identity, warm gold accent, white typography and authentic HDS photography.
- Preserve existing information architecture, service routes, SEO intent, metadata, JSON-LD and static Astro architecture.
- Large desktop max content width should be approximately 1440 px.
- Primary editorial grid is 12 columns; split sections normally use stable 5/7, 6/6 or 7/5 ratios.
- Avoid arbitrary offsets and oversized empty black regions with no compositional purpose.
- Laptop widths around 1366–1600 px are the critical responsive target.
- Mobile must use a clean one-column flow with stable side padding and tap-friendly controls.
- No SEO copy, routing or structured-data behavior changes unless required for layout semantics.
- Existing Vitest, Playwright and production Astro build must remain green.

## Review Focus

- 1366–1600 px laptop widths: hero typography, navigation and media must not collide or feel cramped.
- 900–1080 px transition range: desktop/mobile navigation must never disappear simultaneously.
- Long headings and body copy: no horizontal overflow or unreadable line lengths.
- External realization photography with varied source dimensions: crops must remain intentional and stable.
- JavaScript-disabled navigation and reduced-motion behavior must remain usable after layout changes.

---

### Task 1: Establish the shared editorial grid and spacing system

**Files:**
- Modify: `src/styles/global.css`
- Modify if needed: `src/styles/tokens.css`
- Test: `tests/launch-audit.spec.ts`

**Interfaces:**
- Consumes: existing `.container`, `.section`, `.section-title`, `.lead`, `.btn` utilities.
- Produces: a stable shared container, spacing scale and reusable grid utilities that later component tasks rely on.

- [ ] **Step 1: Add a failing browser assertion for horizontal overflow at representative widths**

Extend `tests/launch-audit.spec.ts` so `/` is checked at 1920, 1440, 1366, 1024 and 390 px and asserts `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.

- [ ] **Step 2: Run the focused Playwright test and confirm the new assertions expose the current layout risk**

Run: `npx playwright test tests/launch-audit.spec.ts --project=chromium`
Expected: existing checks pass and at least one newly added responsive assertion fails before the layout system is refined, or the test is demonstrably capable of detecting overflow by temporary local perturbation.

- [ ] **Step 3: Implement the shared layout system**

In `src/styles/global.css`, refine `.container`, `.section`, `.section-title`, `.lead` and spacing behavior; add reusable 12-column/editorial utilities only where they reduce repeated component CSS. Keep the content max width around 1440 px and use fluid side padding that remains comfortable on laptop and mobile widths.

- [ ] **Step 4: Verify focused tests and production build**

Run: `npm run test:run && npx playwright test tests/launch-audit.spec.ts --project=chromium && npm run build`
Expected: all commands PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/styles/tokens.css tests/launch-audit.spec.ts
git commit -m "style: establish premium layout grid and spacing"
```

### Task 2: Refine header, hero and capability transition

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/MobileMenu.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/CapabilityStrip.astro`
- Test: `tests/navigation.spec.ts`
- Test: `tests/launch-audit.spec.ts`

**Interfaces:**
- Consumes: shared container and spacing system from Task 1.
- Produces: a header/hero/capability composition whose axes match the rest of the site and whose navigation remains available at all breakpoints.

- [ ] **Step 1: Add a failing navigation breakpoint test**

Extend `tests/navigation.spec.ts` with viewport checks at 899, 900, 1024, 1079 and 1080 px. At every width, assert that at least one primary navigation mechanism is visible and the quote CTA remains reachable.

- [ ] **Step 2: Run the navigation test and confirm the breakpoint gap is caught**

Run: `npx playwright test tests/navigation.spec.ts --project=chromium`
Expected: FAIL on any width where neither desktop nor mobile navigation is available.

- [ ] **Step 3: Align header and mobile menu breakpoints**

Use one intentional breakpoint shared by `Header.astro` and `MobileMenu.astro`; align logo, nav, phone and CTA to the same page grid and tighten desktop spacing without changing labels or routes.

- [ ] **Step 4: Refine hero composition**

In `Hero.astro`, preserve the current multi-line H1 and gold accent but constrain max-width, line-height, vertical anchoring and CTA spacing so it remains balanced at 1920, 1440 and 1366 px. Keep full-viewport impact and retain the scroll indicator only where it does not compete with content.

- [ ] **Step 5: Refine capability strip**

In `CapabilityStrip.astro`, align all four values directly to the shared grid, equalize internal spacing and reduce the disconnected-table appearance without changing the values.

- [ ] **Step 6: Verify navigation, launch audit and build**

Run: `npm run test:run && npx playwright test tests/navigation.spec.ts tests/launch-audit.spec.ts --project=chromium && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.astro src/components/MobileMenu.astro src/components/Hero.astro src/components/CapabilityStrip.astro tests/navigation.spec.ts tests/launch-audit.spec.ts
git commit -m "style: refine hero and navigation alignment"
```

### Task 3: Rebuild homepage editorial and service-story composition

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/ServiceStory.astro`
- Modify: `src/components/EquipmentSection.astro`
- Modify: `src/components/ProcessSteps.astro`
- Modify: `src/components/FAQ.astro`
- Modify: `src/components/CTASection.astro`
- Test: `tests/launch-audit.spec.ts`

**Interfaces:**
- Consumes: shared grid, spacing and hero/header axes from Tasks 1–2.
- Produces: a consistent homepage section rhythm and reusable service-story split behavior.

- [ ] **Step 1: Add homepage structural assertions**

In `tests/launch-audit.spec.ts`, assert the homepage retains exactly one H1, the expected service-story media remain present, and all primary sections remain within the page width at laptop and mobile viewports.

- [ ] **Step 2: Run the focused audit before implementation**

Run: `npx playwright test tests/launch-audit.spec.ts --project=chromium`
Expected: existing semantics remain green; new geometry checks identify any current overflow or unstable section sizing.

- [ ] **Step 3: Recompose the intro section in `src/pages/index.astro`**

Turn “Ciężkie rzeczy zostaw nam” into a controlled editorial split using defined column spans. Reduce dead vertical area while preserving generous whitespace and existing copy.

- [ ] **Step 4: Standardize `ServiceStory.astro`**

Use stable 5/7 or 6/6 text/media ratios, consistent media aspect ratios, exact alternating alignment and content-driven height. Preserve service copy, links and image sources.

- [ ] **Step 5: Bring equipment, process, FAQ and CTA onto the same rhythm**

Adjust only composition, spacing and type scale in `EquipmentSection.astro`, `ProcessSteps.astro`, `FAQ.astro` and `CTASection.astro`; preserve semantics and copy.

- [ ] **Step 6: Verify homepage behavior and build**

Run: `npm run test:run && npx playwright test tests/launch-audit.spec.ts --project=chromium && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/components/ServiceStory.astro src/components/EquipmentSection.astro src/components/ProcessSteps.astro src/components/FAQ.astro src/components/CTASection.astro tests/launch-audit.spec.ts
git commit -m "style: rebuild service section composition"
```

### Task 4: Polish gallery and supporting page layouts

**Files:**
- Modify: `src/components/ProjectGallery.astro`
- Modify: `src/layouts/ServiceLayout.astro`
- Modify as needed: `src/pages/realizacje.astro`
- Modify as needed: `src/pages/sprzet.astro`
- Modify as needed: `src/pages/o-nas.astro`
- Modify as needed: `src/pages/kontakt.astro`
- Modify as needed: `src/pages/wycena.astro`
- Modify: `src/components/QuoteForm.astro`
- Modify: `src/components/Footer.astro`
- Test: `tests/launch-audit.spec.ts`

**Interfaces:**
- Consumes: shared grid and spacing utilities from Task 1 and the refined component rhythm from Task 3.
- Produces: consistent supporting pages and a controlled modular realization gallery.

- [ ] **Step 1: Add supporting-page responsive smoke checks**

For `/realizacje/`, `/sprzet/`, `/o-nas/`, `/kontakt/`, `/wycena/` and one service route, assert no horizontal overflow at 1440, 1024 and 390 px; keep the existing canonical/H1/image-dimension checks.

- [ ] **Step 2: Run the supporting-page audit before implementation**

Run: `npx playwright test tests/launch-audit.spec.ts --project=chromium`
Expected: new responsive assertions expose any supporting-page width problems while existing semantic checks remain intact.

- [ ] **Step 3: Replace the arbitrary gallery zig-zag**

In `ProjectGallery.astro`, remove the 80 px alternating vertical offset and inconsistent start columns. Use a controlled 12-column modular pattern where feature cards can span 7 columns and supporting cards 5 columns, with consistent gutters and a clean single-column mobile sequence.

- [ ] **Step 4: Normalize service and supporting page composition**

Update `ServiceLayout.astro` plus only the supporting pages that need local adjustments so headline spacing, readable text width, media treatment and CTA spacing match the homepage system. Do not alter SEO titles, descriptions, canonicals or structured data.

- [ ] **Step 5: Refine quote form and footer alignment**

In `QuoteForm.astro` and `Footer.astro`, align controls/content to the shared grid, preserve required fields and form fallback behavior, and ensure mobile controls remain comfortably tappable.

- [ ] **Step 6: Verify all browser checks and build**

Run: `npm run test:run && npx playwright test --project=chromium && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/ProjectGallery.astro src/layouts/ServiceLayout.astro src/pages/realizacje.astro src/pages/sprzet.astro src/pages/o-nas.astro src/pages/kontakt.astro src/pages/wycena.astro src/components/QuoteForm.astro src/components/Footer.astro tests/launch-audit.spec.ts
git commit -m "style: polish gallery and supporting sections"
```

### Task 5: Final responsive polish and branch verification

**Files:**
- Modify only as required by verification: `src/styles/global.css`, affected component/page styles
- Modify if needed: `tests/navigation.spec.ts`, `tests/launch-audit.spec.ts`
- No content or SEO changes unless a regression is discovered.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: release-ready responsive layout branch with green unit tests, browser tests and production build.

- [ ] **Step 1: Verify representative viewport widths**

Run browser checks at 1920, 1440, 1366, 1024, 768 and 390 px. Inspect hero, header/nav, intro, service stories, gallery, form and footer for overflow, collisions, awkward crops and dead vertical regions.

- [ ] **Step 2: Fix only issues found by the verification pass**

Prefer shared CSS corrections over one-off per-width hacks. Keep the design system stable and avoid introducing new visual concepts.

- [ ] **Step 3: Run the complete verification suite**

Run: `npm run test:run && npx playwright test --project=chromium && npm run build`
Expected: Vitest PASS, Playwright PASS, Astro static build PASS.

- [ ] **Step 4: Check source diff quality**

Run: `git diff --check main...HEAD`
Expected: no whitespace errors.

- [ ] **Step 5: Commit final responsive corrections**

```bash
git add src tests
git commit -m "style: finalize responsive layout and visual rhythm"
```

- [ ] **Step 6: Open a pull request**

Open a PR from `style/professional-layout-polish` to `main` summarizing the layout-system changes and verification results. Do not merge until CI is green and the user has explicitly approved the final visual result.
