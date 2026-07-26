import type { Metadata } from "next";
import { legalDisclaimer } from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Use | ${SITE_NAME}`,
  description: `Placeholder terms of use for ${SITE_NAME}.`,
};

/**
 * Placeholder page — no real terms of use exist yet. Ship this obvious
 * placeholder rather than inventing legal text; replace before launch with
 * counsel-reviewed copy.
 */
export default function TermsPage() {
  return (
    <div className="container-max py-64">
      <p className="mb-16 font-sans text-label font-weight-semibold uppercase tracking-eyebrow text-gold-600">
        Placeholder — pending legal review
      </p>
      <h1 className="mb-24 font-serif text-h2 text-navy-950">Terms of Use</h1>

      <div className="flex max-w-[65ch] flex-col gap-16 font-sans text-body text-slate-700">
        <p>
          This page is a structural placeholder. It does not yet contain reviewed terms of use and should not be
          relied on as a legal document.
        </p>
        <p>
          Complete terms will describe acceptable use of this site, the limits of the information provided here, and
          the relationship between {SITE_NAME} and the independent treatment programs it may refer families to.
        </p>
      </div>

      <div className="mt-40 rounded-card border-token-default bg-white p-24">
        <p className="font-sans text-body-s text-slate-700">{legalDisclaimer}</p>
      </div>
    </div>
  );
}
