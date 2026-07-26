/**
 * Shared, non-content constants: navigation, section anchor ids, and
 * env-backed values that must never be hardcoded in components.
 *
 * Section order and ids follow 02-page-structure.md. Components that render
 * a given section must use the matching id from `SECTION_IDS` so header nav
 * links, the mobile sticky bar and any deep links keep working once the
 * real sections are built.
 */

export const SECTION_IDS = {
  hero: "hero",
  trustStrip: "trust-strip",
  whyEurope: "why-europe",
  assessment: "assessment",
  howItWorks: "how-it-works",
  included: "included",
  trustProcess: "trust-process",
  suitability: "suitability",
  scenarios: "scenarios",
  faq: "faq",
  finalCta: "final-cta",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Ordered list used by app/page.tsx to render sections/placeholders. */
export const SECTION_ORDER: SectionId[] = [
  SECTION_IDS.hero,
  SECTION_IDS.trustStrip,
  SECTION_IDS.whyEurope,
  SECTION_IDS.assessment,
  SECTION_IDS.howItWorks,
  SECTION_IDS.included,
  SECTION_IDS.trustProcess,
  SECTION_IDS.suitability,
  SECTION_IDS.scenarios,
  SECTION_IDS.faq,
  SECTION_IDS.finalCta,
];

export interface NavItem {
  label: string;
  href: `#${string}`;
}

/** Header + mobile drawer navigation, per 05-content-en.md "Header". */
export const NAV_ITEMS: NavItem[] = [
  { label: "Why Europe", href: `#${SECTION_IDS.whyEurope}` },
  { label: "How It Works", href: `#${SECTION_IDS.howItWorks}` },
  { label: "What's Included", href: `#${SECTION_IDS.included}` },
  { label: "FAQ", href: `#${SECTION_IDS.faq}` },
];

/**
 * Admissions phone number.
 *
 * The US admissions line is baked in as the default so the number is correct
 * even when NEXT_PUBLIC_ADMISSIONS_PHONE is not set in the build environment.
 * Setting that variable overrides it — useful for staging or a per-campaign
 * tracking number. The number is public by design; it is printed on the page.
 */
const DEFAULT_ADMISSIONS_PHONE = "+1 (478) 309-7957";
const rawPhone = process.env.NEXT_PUBLIC_ADMISSIONS_PHONE?.trim() || DEFAULT_ADMISSIONS_PHONE;
export const ADMISSIONS_PHONE_DISPLAY = rawPhone;
export const ADMISSIONS_PHONE_HREF = `tel:${rawPhone.replace(/[^\d+]/g, "")}`;

/**
 * Scheduler (e.g. Calendly-style booking) URL.
 *
 * No scheduler is configured yet. Falls back to the assessment section so
 * "Check Availability" style CTAs remain functional in the meantime, while
 * `IS_SCHEDULER_CONFIGURED` flags that the real external scheduler is not
 * wired up so callers can show a "coming soon" state if desired.
 */
const rawScheduler = process.env.NEXT_PUBLIC_SCHEDULER_URL?.trim() ?? "";
export const IS_SCHEDULER_CONFIGURED = rawScheduler.length > 0;
export const SCHEDULER_URL = IS_SCHEDULER_CONFIGURED
  ? rawScheduler
  : `#${SECTION_IDS.assessment}`; // TODO(task 2/3): point at the real scheduler once available.

/**
 * Lead submission endpoint.
 *
 * The site is a static export (see next.config.ts) with no server-side route
 * handler of its own, so lead POSTs go to an external Cloudflare Worker
 * (see worker/) instead of app/api/lead/route.ts (removed). Defaults to
 * "/api/lead" so local development against a restored Next.js route handler
 * would still work unmodified if one is ever added back.
 */
const rawLeadEndpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT?.trim() ?? "";
export const IS_LEAD_ENDPOINT_CONFIGURED = rawLeadEndpoint.length > 0;
export const LEAD_ENDPOINT = IS_LEAD_ENDPOINT_CONFIGURED ? rawLeadEndpoint : "/api/lead";

export const SITE_NAME = "European Recovery Access";

/**
 * Canonical origin, used for metadataBase, canonical links, Open Graph and
 * the Organization JSON-LD (see app/layout.tsx).
 *
 * The production domain is recoveryeurope.com. Until its DNS is pointed at
 * GitHub Pages the site is still served from the github.io project URL, so
 * this is overridable per build: set NEXT_PUBLIC_SITE_URL as a repository
 * variable to switch canonical URLs over without a code change.
 */
const DEFAULT_SITE_URL = "https://recoveryeurope.com";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/$/, "");
