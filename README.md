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
8. `design-tokens.json` — machine-readable design tokens.

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

| Variable | Purpose |
| --- | --- |
| `LEAD_WEBHOOK_URL` | Server-side webhook the `/api/lead` route (added in a later task) posts leads to. |
| `RESEND_API_KEY` | API key if lead delivery goes through Resend instead of/alongside the webhook. |
| `ADMISSIONS_EMAIL` | Inbox that should receive lead notifications. |
| `NEXT_PUBLIC_ADMISSIONS_PHONE` | Real admissions phone number, e.g. `+1 833 123 4567`. |
| `NEXT_PUBLIC_SCHEDULER_URL` | External call-scheduling URL (e.g. Calendly). |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID; leave empty to disable analytics entirely. |

### Quality gates

```bash
npm run build       # production build
npx tsc --noEmit     # type-check
npm run lint         # ESLint
```

### Deployment

The app is a standard Next.js App Router project and deploys to any Next.js-compatible host (Vercel, or a Node server via `next build && next start`). Set the environment variables above in the hosting provider before going live, and replace the placeholder domain in `lib/constants.ts` (`SITE_URL`) with the real production domain so canonical/Open Graph URLs are correct.

### What's implemented so far

- Project scaffold, Tailwind v4 theme fully mapped from `design-tokens.json`, fonts, global metadata/JSON-LD, layout shell (header, footer, mobile sticky bar), and the shared `components/ui/*` primitives.
- `app/page.tsx` renders a placeholder `<section>` for every section in `02-page-structure.md`, in order, with the correct `id` so navigation and anchors already work.
- Not yet implemented (left for subsequent tasks): the actual page sections (`components/sections/*`), the multi-step assessment form, and `app/api/lead/route.ts`.
