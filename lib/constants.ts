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
 * No real number exists yet. NEXT_PUBLIC_ADMISSIONS_PHONE is empty in
 * .env.example on purpose — until it is set, the UI must show an obvious
 * placeholder rather than a fabricated number. `IS_PHONE_CONFIGURED` lets
 * components decide whether to disable/hide the "Call Admissions" action.
 */
const rawPhone = process.env.NEXT_PUBLIC_ADMISSIONS_PHONE?.trim() ?? "";
export const IS_PHONE_CONFIGURED = rawPhone.length > 0;
export const ADMISSIONS_PHONE_DISPLAY = IS_PHONE_CONFIGURED
  ? rawPhone
  : "+1 (000) 000-0000"; // TODO(task 2/3): replace once a real admissions line is provisioned.
export const ADMISSIONS_PHONE_HREF = `tel:${(IS_PHONE_CONFIGURED ? rawPhone : "+10000000000").replace(
  /[^\d+]/g,
  "",
)}`;

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

export const SITE_NAME = "European Recovery Access";

/**
 * Canonical origin placeholder.
 *
 * No production domain has been registered/confirmed yet. This is not an
 * env var from 07-codex-technical-spec.md — it is a deliberate literal
 * placeholder to swap for the real domain before launch (see app/layout.tsx
 * metadataBase / canonical usage).
 */
export const SITE_URL = "https://www.example-placeholder.com"; // TODO: replace with the real production domain.
