# KALTRUCK Professional Layout Polish — Design Spec

## Goal

Refine the existing KALTRUCK premium Astro site so it keeps the current dark industrial / cinematic identity, but reads as a professionally art-directed website rather than a rough first-pass layout. The focus is composition, spacing, alignment, visual rhythm and responsive consistency across the full site.

## What stays

- Existing KALTRUCK visual identity: charcoal/black background, warm gold accent, white typography, authentic HDS photography.
- Strong oversized hero typography and cinematic photography.
- Existing information architecture, service routes, SEO intent, metadata and content structure.
- Existing static Astro architecture and minimal-JS approach.

## Problems to solve

### 1. Inconsistent content axes
Different sections currently use related but not always identical horizontal alignment. The result is that hero copy, statistics, section headings, body copy and media sometimes appear to float independently.

### 2. Excessive empty space
Several sections create large dead areas between content blocks. The problem is not the use of whitespace itself, but that the whitespace does not consistently reinforce hierarchy or composition.

### 3. Uncontrolled section proportions
Image and text blocks use differing visual ratios. Some sections become too tall while others feel compressed, creating an uneven page rhythm.

### 4. Gallery composition is too arbitrary
The current gallery deliberately offsets alternating cards and mixes widths. That gives an experimental zig-zag effect instead of a controlled premium editorial grid.

### 5. Desktop scale needs stronger constraints
At large desktop widths, typography and media can become visually oversized relative to the available composition, while on laptop widths the same rules can feel cramped.

### 6. Responsive behavior needs to feel designed, not merely stacked
Tablet and mobile layouts should retain the same hierarchy and rhythm rather than simply collapsing desktop columns.

## Layout system

### Core grid
Use one shared page container and consistent content axes across the full site.

- Large desktop max content width: approximately 1440 px.
- Standard side padding: fluid, but never visually cramped.
- Primary editorial grid: 12 columns.
- Text/media split sections should normally use stable ratios such as 5/7, 6/6 or 7/5 depending on content emphasis.
- Avoid arbitrary horizontal offsets unless they serve a clear compositional purpose.

### Vertical rhythm
Introduce a predictable spacing scale for section gaps, internal block gaps and text groupings.

- Hero-to-stats transition should be visually intentional.
- Major sections should generally use one of two spacing densities: standard or feature.
- Avoid large unoccupied black regions with no visual function.

## Typography

### Hero
Keep the current aggressive headline character, but constrain it so it feels composed.

- Preserve the multi-line headline and gold accent line.
- Improve max-width, line-height and placement relative to the image focal point.
- Prevent the heading from visually colliding with the crane/background at common laptop widths.

### Section headings
Use a more consistent heading scale so sections relate to each other.

- Large editorial headings remain prominent.
- Body copy should have a stable readable width.
- Eyebrows should align consistently with their related headings.

## Header

- Align the logo, navigation, phone number and CTA to the same horizontal grid as the page content.
- Preserve the dark/glass premium treatment.
- Tighten spacing so navigation looks deliberate rather than loosely distributed.
- Ensure the desktop-to-mobile breakpoint has no gap where neither desktop nor mobile navigation is available.

## Homepage composition

### Hero
- Maintain full-viewport cinematic impact.
- Improve text anchoring and bottom spacing.
- Keep CTA pair but balance widths and spacing.
- Preserve scroll indicator only where it supports composition.

### Capability strip
- Keep the four values, but align them directly to the site grid.
- Use equal visual weight and consistent internal spacing.
- Reduce any impression that the strip is a disconnected table.

### Intro / “Ciężkie rzeczy zostaw nam”
Turn this into a controlled editorial split.

- Heading occupies a defined column block.
- Supporting copy aligns to a complementary column.
- Reduce empty dead area above/below.
- Keep generous whitespace, but make it intentional.

### Service storytelling
Standardize each service story into a coherent visual system.

- Stable image ratio.
- Stable text width.
- Alternation can remain, but alignment should be exact.
- Section heights should follow content, not oversized arbitrary minimums.

### Equipment / process / FAQ / CTA
Use the same page grid and section rhythm. These blocks should feel like one site system rather than independent modules.

## Realizations gallery

Replace the current zig-zag layout with a controlled modular gallery.

Recommended composition:
- 12-column editorial grid.
- Feature cards may span 7 columns and supporting cards 5 columns.
- Keep asymmetry, but remove arbitrary 80 px vertical offsets and inconsistent start columns.
- Maintain consistent card gutters and metadata spacing.
- Standardize media ratios while allowing selected feature cards to be larger.
- Mobile becomes a clean single-column sequence.

## Supporting pages

Apply the same polish system to:
- service landing pages,
- equipment,
- about,
- contact,
- quote form,
- realizations.

Each page should share:
- identical page width logic,
- headline spacing,
- text widths,
- media treatment,
- CTA spacing,
- footer alignment.

## Responsive behavior

### Large desktop
Use generous scale, but preserve readable composition and prevent ultra-wide drift.

### Laptop
This is the critical breakpoint because the current layout looks least controlled here. Headlines, image blocks and navigation must remain balanced around 1366–1600 px widths.

### Tablet
Convert split layouts into compact two-column or stacked compositions without excessive vertical gaps.

### Mobile
- One-column flow.
- Reduced but still strong hero typography.
- Stable side padding.
- Full-width media where useful.
- Buttons remain easy to tap and never crowd the viewport.

## Technical approach

Prioritize reusable CSS/system changes instead of one-off per-section patches.

Likely touched areas:
- `src/styles/global.css`
- shared design tokens if needed
- header/navigation components
- `Hero.astro`
- capability/stat components
- homepage section components
- `ProjectGallery.astro`
- shared service/page layouts
- responsive styles

No SEO copy, routing or structured-data behavior should be changed unless required for layout semantics.

## Verification

After implementation:
- production Astro build must pass,
- existing Vitest suite must pass,
- Playwright suite must pass,
- add/adjust browser checks for critical responsive navigation/layout where useful,
- manually inspect at representative widths: 1920, 1440, 1366, tablet and mobile,
- verify no horizontal overflow, broken image crops or navigation gaps.

## Commit strategy

Use separate logical commits rather than one broad visual commit, for example:

1. `style: establish premium layout grid and spacing`
2. `style: refine hero and navigation alignment`
3. `style: rebuild service section composition`
4. `style: polish gallery and supporting sections`
5. `style: finalize responsive layout and visual rhythm`

## Success criteria

The finished site should still immediately feel like the same KALTRUCK concept, but with:
- stronger alignment,
- more intentional whitespace,
- cleaner section proportions,
- consistent visual hierarchy,
- a professional editorial grid,
- polished responsive behavior,
- no regressions to SEO, accessibility or static deployment.
