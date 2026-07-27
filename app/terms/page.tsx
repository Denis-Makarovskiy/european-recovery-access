import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Use — European Recovery Access",
  description: `Terms of use for ${SITE_NAME}: who we are, what we are not, costs, responsibilities and governing law.`,
};

/**
 * Terms of Use — verbatim from drafts/legal/terms-of-use.md (owner-approved
 * final text), minus its "DRAFT" heading and status blockquote. Structure
 * (headings/paragraphs/lists) is reproduced as JSX rather than via a
 * markdown renderer, per implementation constraints.
 */
export default function TermsPage() {
  return (
    <div className="container-max py-64">
      <h1 className="mb-8 font-serif text-h2 text-navy-950">Terms of Use</h1>
      <p className="mb-40 font-sans text-body-s italic text-slate-500">Last updated: July 27, 2026</p>

      <div className="flex max-w-[65ch] flex-col gap-32 font-sans text-body text-slate-700">
        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Who we are</h2>
          <p>
            This website is operated by MK REHAB DOO (&ldquo;European Recovery Access&rdquo;). We are an independent
            placement and admissions coordination service: we help families identify European addiction-treatment
            programs, check availability, and coordinate admission, travel and family communication.
          </p>
        </section>

        <section className="rounded-card border-token-default bg-white p-24 shadow-card-low">
          <h2 className="mb-12 font-serif text-h4 text-navy-950">What we are not</h2>
          <ul className="flex list-disc flex-col gap-8 pl-20">
            <li>
              <strong className="font-weight-semibold text-navy-900">We are not a medical provider.</strong> All
              clinical services — assessment, detoxification, treatment — are provided by the independent treatment
              programs you may be admitted to, under their own licenses and terms.
            </li>
            <li>
              <strong className="font-weight-semibold text-navy-900">We are not an emergency service.</strong> If
              someone is in immediate danger, call 911 or your local emergency number.
            </li>
            <li>
              <strong className="font-weight-semibold text-navy-900">Nothing on this site is medical advice.</strong>{" "}
              Information here is general and does not replace consultation with a qualified clinician.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">No guarantees</h2>
          <p>
            Program availability and admission depend on clinical suitability, travel readiness and provider
            capacity. We do not guarantee admission within any specific timeframe, and we do not guarantee treatment
            outcomes or recovery. Any figures on this site describe our coordination process, not clinical results.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Costs</h2>
          <p>
            Treatment costs are set by the treatment programs; coordination fees are ours. You receive the
            applicable program and coordination costs in writing before making any commitment. Treatment is
            private-pay; insurance reimbursement, if any, is a matter between you and your insurer.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Your responsibilities</h2>
          <p>
            You confirm that information you submit is accurate and that you are legally entitled to share the
            information you provide about another person. Travel documents, visas and fitness to travel remain the
            traveller&rsquo;s responsibility; we assist with coordination but cannot guarantee entry to any country.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, our liability in connection with this website and our
            coordination services is limited to the coordination fees you have paid us. We are not liable for acts
            or omissions of treatment programs, carriers or other third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Governing law</h2>
          <p>
            These terms are governed by the laws of Montenegro. Disputes are subject to the courts of Montenegro.
          </p>
        </section>

        <p>
          <strong className="font-weight-semibold text-navy-950">Contact:</strong> MK REHAB DOO, Vojina Katnića,
          ulaz C-14, stan 19, Podgorica, Montenegro, montenegrorehab@gmail.com, +1 (478) 309-7957.
        </p>
      </div>
    </div>
  );
}
