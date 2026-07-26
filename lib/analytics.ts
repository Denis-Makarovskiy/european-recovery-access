/**
 * Typed analytics helpers for the event list in
 * 06-interactions-and-analytics.md.
 *
 * Hard rules (do not relax these when wiring up new events):
 * - Every event name below must match 06-interactions-and-analytics.md.
 * - Properties are restricted to the allow-listed, non-identifying keys in
 *   `AnalyticsProperties` — never pass names, phone numbers, emails or
 *   clinical free text. `sanitizeProperties` also strips/truncates at
 *   runtime as a second line of defense against accidental misuse. This
 *   applies equally to both analytics sinks below (GA4 and Yandex Metrica).
 * - When `NEXT_PUBLIC_GA_ID` is unset, or `window.gtag` is unavailable
 *   (e.g. server-side, ad blockers, before the script loads), every call
 *   is a no-op.
 * - Same rule for Yandex Metrica: when `NEXT_PUBLIC_YM_ID` is unset, or
 *   `window.ym` is unavailable, every call is a no-op.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (counterId: number, action: string, ...rest: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";
export const IS_ANALYTICS_CONFIGURED = GA_ID.length > 0;

export const YM_ID = process.env.NEXT_PUBLIC_YM_ID?.trim() ?? "";
export const IS_YM_CONFIGURED = YM_ID.length > 0;

export type AnalyticsEventName =
  | "page_view"
  | "hero_cta_click"
  | "call_click"
  | "assessment_start"
  | "assessment_step_complete"
  | "assessment_complete"
  | "lead_submit"
  | "lead_submit_error"
  | "scheduler_open"
  | "scheduler_booking_complete"
  | "faq_open"
  | "scroll_50"
  | "scroll_90";

/**
 * Allow-listed, non-PII event properties (06-interactions-and-analytics.md,
 * "Event properties"). `main_concern` and `urgency` are the fixed chip
 * labels from the assessment (e.g. "Alcohol", "This week") — never the
 * patient's free-text description.
 */
export interface AnalyticsProperties {
  device_category?: "mobile" | "tablet" | "desktop";
  country?: string;
  traffic_source?: string;
  campaign?: string;
  urgency?: string;
  main_concern?: string;
  assessment_step?: number;
}

const ALLOWED_KEYS = [
  "device_category",
  "country",
  "traffic_source",
  "campaign",
  "urgency",
  "main_concern",
  "assessment_step",
] as const;

/** Keys that must never appear in an analytics payload, even by accident. */
const BLOCKED_KEY_PATTERN = /name|phone|email|address|dob|birth|ssn|note|message|free.?text/i;

const MAX_STRING_VALUE_LENGTH = 60;

function sanitizeProperties(properties?: AnalyticsProperties): Record<string, string | number> {
  if (!properties) return {};
  const clean: Record<string, string | number> = {};
  for (const key of ALLOWED_KEYS) {
    const value = properties[key];
    if (value === undefined || value === null) continue;
    if (BLOCKED_KEY_PATTERN.test(key)) continue;
    if (typeof value === "number") {
      clean[key] = value;
    } else if (typeof value === "string") {
      clean[key] = value.slice(0, MAX_STRING_VALUE_LENGTH);
    }
  }
  return clean;
}

/** Low-level event dispatcher. Prefer the named helpers below in components. */
export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsProperties): void {
  if (typeof window === "undefined") return;
  const clean = sanitizeProperties(properties);

  if (IS_ANALYTICS_CONFIGURED && typeof window.gtag === "function") {
    window.gtag("event", name, clean);
  }

  if (IS_YM_CONFIGURED && typeof window.ym === "function") {
    window.ym(Number(YM_ID), "reachGoal", name, clean);
  }
}

export const trackPageView = (properties?: AnalyticsProperties) => trackEvent("page_view", properties);
export const trackHeroCtaClick = (properties?: AnalyticsProperties) => trackEvent("hero_cta_click", properties);
export const trackCallClick = (properties?: AnalyticsProperties) => trackEvent("call_click", properties);
export const trackAssessmentStart = (properties?: AnalyticsProperties) => trackEvent("assessment_start", properties);
export const trackAssessmentStepComplete = (assessmentStep: number, properties?: AnalyticsProperties) =>
  trackEvent("assessment_step_complete", { ...properties, assessment_step: assessmentStep });
export const trackAssessmentComplete = (properties?: AnalyticsProperties) =>
  trackEvent("assessment_complete", properties);
export const trackLeadSubmit = (properties?: AnalyticsProperties) => trackEvent("lead_submit", properties);
export const trackLeadSubmitError = (properties?: AnalyticsProperties) =>
  trackEvent("lead_submit_error", properties);
export const trackSchedulerOpen = (properties?: AnalyticsProperties) => trackEvent("scheduler_open", properties);
export const trackSchedulerBookingComplete = (properties?: AnalyticsProperties) =>
  trackEvent("scheduler_booking_complete", properties);
export const trackFaqOpen = (properties?: AnalyticsProperties) => trackEvent("faq_open", properties);
export const trackScroll50 = (properties?: AnalyticsProperties) => trackEvent("scroll_50", properties);
export const trackScroll90 = (properties?: AnalyticsProperties) => trackEvent("scroll_90", properties);
