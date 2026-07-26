# European Recovery Access — MVP Design & Development Pack

This package contains the complete specification required to build the MVP landing page for a European addiction-treatment placement service targeting families in the United States and Canada.

## Contents

1. `01-product-brief.md` — positioning, audience, hypotheses and conversion goals.
2. `02-page-structure.md` — full landing-page architecture and desktop/mobile layout.
3. `03-design-system.md` — colors, typography, spacing, grids, shadows and responsive rules.
4. `04-ui-kit.md` — buttons, fields, cards, badges, accordions, quiz and component states.
5. `05-content-en.md` — production-ready English copy for every section.
6. `06-interactions-and-analytics.md` — form logic, quiz flow, events and success metrics.
7. `07-codex-technical-spec.md` — implementation brief for Next.js, TypeScript and Tailwind CSS.
8. `08-hero-image-brief.md` — generation brief and prompts for the hero background image.
9. `design-tokens.json` — machine-readable design tokens.

## MVP principle

The landing page must test one core hypothesis:

> Families in the US and Canada will request a confidential consultation when offered rapid, private access to suitable addiction-treatment programs in Europe.

The site must not present itself as a specific clinic. It is an independent placement and coordination service.

## Application setup (Next.js implementation)

This repository also contains the Next.js implementation of the landing page, scaffolded directly at the repo root (App Router, TypeScript strict, Tailwind CSS v4). The design/spec files above (`01`–`07`, `design-tokens.json`, `design-refs/`) remain the source of truth — see `app/globals.css` for the token → Tailwind theme mapping and `lib/content.ts` for the copy sourced from `05-content-en.md`.

### Requirements

- Node.js 20.20.2+ (see `.nvmrc`-equivalent: Node 20 LTS)
- npm 10+

### Local development

```bash
npm install
cp .env.example .env.local   # fill in the values you have; safe placeholders are used for the rest
npm run dev
```

Open http://localhost:3000.

### Environment variables

See `.env.example`. None are required to run the app locally — phone/scheduler links fall back to clearly-marked placeholders (`lib/constants.ts`) and analytics becomes a no-op when `NEXT_PUBLIC_GA_ID` is unset.

Lead delivery is configured in `worker/`, not here — the site has no server at runtime.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_LEAD_ENDPOINT` | URL of the deployed lead Worker; falls back to `/api/lead`, which no longer exists. |
| `NEXT_PUBLIC_ADMISSIONS_PHONE` | Overrides the admissions phone number baked into `lib/constants.ts`. |
| `NEXT_PUBLIC_SCHEDULER_URL` | External call-scheduling URL (e.g. Calendly). |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID; leave empty to disable analytics entirely. |

### Quality gates

```bash
npm run build       # production build
npx tsc --noEmit     # type-check
npm run lint         # ESLint
```

### What's implemented

- Tailwind v4 theme mapped from `design-tokens.json`, fonts, global metadata and Organization JSON-LD, layout shell (header, footer, mobile sticky bar) and the shared `components/ui/*` primitives.
- Every section of `02-page-structure.md` except section 10: hero with consultation form, trust strip, why Europe, four-step assessment, how it works, what's included, trust process, suitability, FAQ, final CTA. Section 10 (testimonials) is deliberately absent — no approved copy exists and none may be invented.
- Lead capture posts to the Cloudflare Worker in `worker/`; the site itself has no server at runtime.

### Known placeholders

`SITE_URL` in `lib/constants.ts`, the admissions phone, the scheduler URL, the privacy and terms copy, and the hero photograph's licensing all still need real values before launch. See `WORKLOG.md` for the current open list.

## Deployment (GitHub Pages)

The app builds to a static export (`output: "export"` in `next.config.ts`) and deploys via `.github/workflows/deploy.yml` on every push to `main` (or manually via `workflow_dispatch`). There is no server at runtime — the lead-capture forms in `components/sections/Hero.tsx` and `components/sections/Assessment.tsx` POST directly to an external Cloudflare Worker instead of a Next.js route handler. That Worker lives in `worker/` and is built and deployed separately (its own CI, its own env/secrets) — it is not part of this static build.

### Required repository variables

Set these under the repo's **Settings > Secrets and variables > Actions > Variables** tab (not Secrets — they are all public, client-exposed `NEXT_PUBLIC_*` values baked into the static build):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_LEAD_ENDPOINT` | Full URL of the deployed lead-capture Worker, e.g. `https://leads.example.workers.dev`. |
| `NEXT_PUBLIC_BASE_PATH` | `/<repo-name>` for a GitHub Pages *project* page; empty for a custom domain or a user/organization pages repo. See below. |
| `NEXT_PUBLIC_ADMISSIONS_PHONE` | Real admissions phone number. |
| `NEXT_PUBLIC_SCHEDULER_URL` | External call-scheduling URL. |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID (optional; analytics is a no-op if unset). |
| `NEXT_PUBLIC_YM_ID` | Yandex Metrica counter number (optional; Metrica is a no-op if unset). |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag verification content (optional; tag is omitted if unset). |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Yandex Webmaster meta-tag verification content (optional; tag is omitted if unset). |

### basePath: project pages vs. a custom domain

GitHub Pages serves a repository that isn't a user/organization `*.github.io` repo (or that isn't behind a custom domain) at `https://<user>.github.io/<repo>/` — every route and asset needs a `/<repo>` prefix, or links and `_next` assets 404. `next.config.ts` reads `NEXT_PUBLIC_BASE_PATH` and applies it to both `basePath` and `assetPrefix`.

- **Project pages** (no custom domain): set `NEXT_PUBLIC_BASE_PATH=/<repo-name>`.
- **Custom domain, or a `<user>.github.io` user/organization pages repo**: leave `NEXT_PUBLIC_BASE_PATH` empty — the site is served from the origin root and needs no prefix.

`public/.nojekyll` is included so GitHub Pages serves the `_next/` directory as-is instead of running it through Jekyll (which ignores underscore-prefixed paths by default).

### Analytics and search console verification

Each of these is enabled independently by setting the matching repository variable (see the table above); leave any of them empty to keep that feature off.

- **GA4** — set `NEXT_PUBLIC_GA_ID`.
- **Yandex Metrica** — set `NEXT_PUBLIC_YM_ID`. Metrica's Webvisor session-replay feature is deliberately hard-disabled in `components/analytics/YandexMetrica.tsx` regardless of env vars, because it would record keystrokes in this site's forms, which collect names, phone numbers and health-related answers about a person's addiction.
- **Google Search Console** — set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the `content` value of the HTML-tag verification method.
- **Yandex Webmaster** — set `NEXT_PUBLIC_YANDEX_VERIFICATION` to the `content` value of its meta-tag verification method.

### Running locally against a local Worker

If you're also running the Worker from `worker/` locally (typically via `wrangler dev`, default port 8787), point the site at it instead of a production endpoint:

```bash
NEXT_PUBLIC_LEAD_ENDPOINT=http://localhost:8787 npm run dev
```

Without `NEXT_PUBLIC_LEAD_ENDPOINT` set, the forms fall back to POSTing to `/api/lead`, which no longer exists in this repo (`app/api/lead/route.ts` was removed — see `lib/constants.ts`'s `LEAD_ENDPOINT`/`IS_LEAD_ENDPOINT_CONFIGURED`) and will 404 unless a Worker (or equivalent) is actually reachable at that path.
