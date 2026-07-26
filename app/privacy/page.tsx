import type { Metadata } from "next";
import { legalDisclaimer } from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Placeholder privacy policy for ${SITE_NAME}.`,
};

/**
 * Placeholder page — no real privacy policy exists yet. Ship this obvious
 * placeholder rather than inventing legal text; replace before launch with
 * counsel-reviewed copy.
 */
export default function PrivacyPage() {
  return (
    <div className="container-max py-64">
      <p className="mb-16 font-sans text-label font-weight-semibold uppercase tracking-eyebrow text-gold-600">
        Placeholder — pending legal review
      </p>
      <h1 className="mb-24 font-serif text-h2 text-navy-950">Privacy Policy</h1>

      <div className="flex max-w-[65ch] flex-col gap-16 font-sans text-body text-slate-700">
        <p>
          This page is a structural placeholder. It does not yet contain a reviewed privacy policy and should not be
          relied on as a legal document.
        </p>
        <p>
          A complete policy will describe what information {SITE_NAME} collects through this site (such as the
          consultation and assessment forms), how it is used to respond to inquiries, who it may be shared with for
          coordination purposes, how long it is retained, and the choices available to visitors regarding their data.
        </p>
        <p>
          If you have a question about your information in the meantime, contact us using the details in the footer.
        </p>
      </div>

      <div className="mt-40 rounded-card border-token-default bg-white p-24">
        <p className="font-sans text-body-s text-slate-700">{legalDisclaimer}</p>
      </div>
    </div>
  );
}
