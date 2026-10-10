# KALTRUCK Premium Website — Design Specification

Date: 2026-10-10
Status: Proposed for user review

## 1. Goal

Build a second KALTRUCK / Kalwasińscy website that preserves the company's real identity and service credibility while reaching prospects from a more premium, modern and cinematic angle than the existing hdsplock.pl site.

The new site must not be a visual clone of webbuilding.lv or of the current hdsplock.pl site. webbuilding.lv is used only as a reference for atmosphere: full-screen photography, dark premium treatment, restrained navigation, strong typography, smooth motion and high visual confidence.

Success means:
- a visibly more modern and premium first impression;
- strong conversion paths to phone/contact/quote;
- a technically fast, crawlable and indexable static site;
- original page copy and information architecture so the second website can target adjacent search intent instead of merely duplicating the current site;
- reuse of authentic KALTRUCK photos and verified company/service facts from the existing materials;
- maintainability through a clean Astro component architecture.

## 2. Brand and visual direction

Brand remains KALTRUCK / Kalwasińscy.

Direction: **premium / cinematic industrial**.

Visual language:
- charcoal / near-black base;
- white and muted warm-neutral text;
- one restrained accent color derived from current branding rather than multiple competing accents;
- large photographic sections using real HDS work images;
- strong display typography with generous spacing;
- subtle gradients and glass effects only where they improve readability;
- minimal decorative chrome;
- motion limited to purposeful reveal, image parallax/scale and section transitions;
- reduced-motion support for accessibility.

The site should feel like a serious heavy-transport operator presented with the visual confidence of a premium engineering/industrial brand, not like a generic template or construction-company theme.

## 3. Homepage composition

### 3.1 Header

Transparent over the hero, becoming a solid/dark glass navigation bar after scroll.

Primary navigation:
- Usługi
- Realizacje
- Sprzęt
- O nas
- Kontakt

Persistent high-priority CTA:
- phone action;
- "Wyceń transport" button.

Mobile header uses a compact menu and keeps a direct phone/quote action easy to reach.

### 3.2 Hero

Near full viewport height with authentic HDS photography.

Primary message concept:

> TRANSPORT, KTÓRY  
> PODNOSI WIĘCEJ.

Support line:

> Transport HDS • załadunek • rozładunek • montaż  
> Płock • Mazowsze • cała Polska

Primary CTA: "Wyceń transport"
Secondary CTA: direct phone call.

Hero image selection must prioritize a frame that clearly communicates vehicle + crane + real operation and remains legible under responsive crops.

### 3.3 Trust / capability strip

A short, non-cluttered strip immediately after the hero with verified signals such as operating area, experience, equipment/capability facts and direct response availability. Only values supported by existing company materials will be used.

### 3.4 Signature service stories

Large alternating photographic sections instead of small generic cards. Initial themes:
- transport kontenerów;
- prefabrykaty i konstrukcje;
- maszyny i urządzenia;
- rozładunek i precyzyjne ustawienie;
- transport przemysłowy / specjalistyczny.

Each section combines a short conversion-focused summary with a link to a dedicated landing page.

### 3.5 Equipment / capability section

A visually technical block showing verified equipment parameters and use cases. It should answer the practical question: "czy ten sprzęt da radę z moim ładunkiem?"

No invented figures. Parameters will be copied only from confirmed source material and normalized into a consistent presentation.

### 3.6 Realizations gallery

Authentic project photography is a core differentiator.

Homepage gallery:
- curated masonry/editorial grid;
- responsive image sizes;
- meaningful alt text;
- lightweight modal or detail link rather than a heavy JS gallery framework;
- categories where useful.

Dedicated realizations page will provide a broader library with category filtering only if it remains fast and useful.

### 3.7 Process

Four concise steps:
1. Kontakt / zapytanie
2. Ocena ładunku i warunków
3. Wycena i termin
4. Transport + ustawienie / montaż

Purpose: reduce uncertainty and make requesting a quote feel simple.

### 3.8 SEO content block and FAQ

A substantial but visually controlled content section below the highly visual areas. This is where the page can answer high-intent HDS questions without making the hero feel text-heavy.

FAQ should be written from real customer-intent questions and be eligible for structured data only when the visible FAQ matches the markup exactly.

### 3.9 Final conversion section

Strong full-width close with direct choice:
- call now;
- send quote request.

## 4. Information architecture

Initial launch structure:

- `/` — premium homepage
- `/transport-hds/`
- `/wynajem-hds/`
- `/transport-kontenerow/`
- `/transport-prefabrykatow/`
- `/transport-maszyn/`
- `/rozladunek-hds/`
- `/sprzet/`
- `/realizacje/`
- `/o-nas/`
- `/kontakt/`
- `/wycena/`

Local landing pages are intentionally not mass-generated at launch. They should be added only where there is unique, useful local content and a real commercial reason to target the location.

## 5. SEO strategy

The second website should complement, not duplicate, hdsplock.pl.

Principles:
- new original copy rather than paragraph-level rewrites of existing pages;
- distinct primary keyword intent per page;
- internal linking based on service/customer journey;
- unique title, meta description, H1 and intro per route;
- canonical tags pointing to each page's own canonical URL unless a deliberate consolidation decision is made;
- Organization/LocalBusiness data based only on verified company details;
- Service schema where appropriate;
- BreadcrumbList on nested pages;
- FAQPage only for genuine visible FAQ sections;
- XML sitemap and robots.txt generated from the actual site routes;
- Open Graph/Twitter metadata and a consistent social image;
- descriptive image file names and alt text;
- no doorway-page strategy or thin city-page multiplication.

Before launch, both sites should be reviewed side by side for overlapping titles, H1s, paragraphs and page intent.

## 6. Technical architecture

Framework: **Astro**.

Rationale:
- static-first output ideal for a service website;
- excellent crawlability and page-speed potential;
- component reuse without shipping a large client-side runtime;
- easy deployment to standard hosting/cPanel as static output;
- straightforward progressive enhancement for motion, menus and gallery interactions.

Expected project structure:

```text
src/
  components/
    Header.astro
    Hero.astro
    ServiceStory.astro
    CapabilityStrip.astro
    EquipmentSection.astro
    ProjectGallery.astro
    ProcessSteps.astro
    FAQ.astro
    CTASection.astro
    Footer.astro
  layouts/
    BaseLayout.astro
    ServiceLayout.astro
  pages/
    index.astro
    transport-hds.astro
    ...
  content/
    services/
    realizations/
  styles/
    global.css
    tokens.css
public/
  images/
  icons/
```

Client-side JavaScript should be kept minimal. Astro islands are only justified for genuinely interactive pieces.

## 7. Content and asset migration

Use current hdsplock.pl materials as a factual source, not as a page-template source.

The existing package contains strong authentic image sets across categories including containers, steel/concrete prefabricates, frame houses, transformers, industrial transport, cable drums, agricultural machinery, building materials, lighting installation and other HDS operations.

Migration rules:
- preserve original source photos;
- select hero/gallery images intentionally rather than bulk-copying every image into first paint;
- convert and resize derivatives to modern formats during the build pipeline where practical;
- keep originals available for future re-crops;
- remove unused legacy page assets from the new site bundle;
- carry company phone/contact details only after verifying them against the current source before launch.

## 8. Performance requirements

Targets:
- static HTML for primary content;
- responsive `srcset`/Astro image optimization;
- hero image preloading only when justified;
- lazy loading below the fold;
- local/self-hosted fonts where licensing permits, or system/optimized web fonts;
- no large animation library unless native CSS/Web Animations cannot achieve the approved effect;
- avoid autoplay video in the initial version;
- no layout shift from images;
- Lighthouse/PageSpeed work as an explicit pre-launch step.

## 9. Accessibility and usability

- semantic headings and landmarks;
- visible keyboard focus;
- sufficient text/background contrast;
- alt text tied to image purpose;
- accessible mobile menu;
- form labels and validation messages;
- `prefers-reduced-motion` handling;
- phone links use `tel:` and primary CTAs remain obvious on mobile.

## 10. Quote/contact flow

The quote flow must remain short. Initial form fields should cover only what is materially useful for pricing/contact, for example:
- name/company;
- phone/email;
- what is being transported/handled;
- origin/destination or location;
- optional dimensions/weight;
- preferred date;
- message.

Exact backend mechanism will depend on the target hosting environment. The current PHP mail solution may be replaced or retained only after reviewing deliverability and server capabilities.

## 11. Git workflow

Repository history should be intentionally human-readable.

Recommended workflow:
- `main` remains deployable;
- implementation happens on focused feature branches or a single launch branch with logically separated commits;
- commits describe one coherent change;
- no generated build output committed unless the deployment target specifically requires it.

Example commit progression:
- `chore: initialize Astro project`
- `chore: add design tokens and global layout`
- `feat: build cinematic hero and navigation`
- `feat: add service story sections`
- `feat: add equipment and capability section`
- `feat: build responsive realizations gallery`
- `feat: add quote and contact flow`
- `seo: add service metadata and structured data`
- `perf: optimize project imagery and loading`
- `a11y: improve navigation and reduced motion support`
- `docs: add deployment and content guide`

Commits should reflect actual work completed; commit messages will not be manufactured merely to imitate activity.

## 12. Testing and acceptance

Before launch:
- production Astro build passes;
- no broken internal links;
- forms validated end-to-end on target hosting;
- responsive checks at representative mobile/tablet/desktop widths;
- keyboard navigation check;
- structured data validation;
- sitemap/robots/canonical review;
- metadata uniqueness review;
- image alt and sizing review;
- comparison against current hdsplock.pl to avoid accidental content duplication;
- Lighthouse/PageSpeed review with fixes for material issues.

## 13. Out of scope for first launch

To keep the first release focused:
- custom CMS/admin panel;
- customer accounts;
- live vehicle tracking;
- pricing calculator based on route/weight;
- mass-generated location pages;
- autoplay background video;
- complex 3D/WebGL effects.

These can be considered later if there is evidence they would improve conversion or operations.

## 14. Open deployment decision

The visual/technical design is approved in principle. One implementation detail remains intentionally open until setup: the destination domain and hosting/cPanel environment for the second website. This does not block component development, but it does affect final canonical URLs, form delivery, deployment automation and production configuration.
