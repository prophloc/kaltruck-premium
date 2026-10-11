# KALTRUCK Premium

Second KALTRUCK / Transport HDS Kalwasińscy website, designed as a premium cinematic industrial experience while keeping static HTML, strong SEO and direct quote/phone conversion paths.

## Stack

Astro, TypeScript, CSS, Vitest and Playwright. The site is static-first and intentionally avoids a heavy client-side framework.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

Production checks:

```bash
npm run test:run
npx playwright test
npm run build
```

## Structure

`src/pages` contains launch routes, `src/content/services` holds service SEO content, `src/content/realizations` describes authentic KALTRUCK project imagery, and reusable visual sections live in `src/components`.

The canonical production origin and form submit endpoint are environment-driven. See `docs/deployment.md` before launch.
