import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy — European Recovery Access",
  description: `Privacy policy for ${SITE_NAME}: what information we collect, how it is used, where it travels and stored, and your rights.`,
};

/**
 * Privacy Policy — verbatim from drafts/legal/privacy-policy.md (owner-
 * approved final text), minus its "DRAFT" heading and status blockquote.
 * Structure (headings/paragraphs/lists) is reproduced as JSX rather than via
 * a markdown renderer, per implementation constraints.
 */
export default function PrivacyPage() {
  return (
    <div className="container-max py-64">
      <h1 className="mb-8 font-serif text-h2 text-navy-950">Privacy Policy</h1>
      <p className="mb-40 font-sans text-body-s italic text-slate-500">Last updated: July 27, 2026</p>

      <div className="flex max-w-[65ch] flex-col gap-32 font-sans text-body text-slate-700">
        <p>
          <strong className="font-weight-semibold text-navy-950">European Recovery Access</strong> (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) is an independent placement and admissions coordination service operated by MK REHAB DOO,
          registered in Montenegro, Vojina Katnića, ulaz C-14, stan 19, Podgorica, Montenegro. We are not a medical
          provider and not an emergency service.
        </p>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">What we collect</h2>
          <p>When you submit a form on this site, we collect only what you enter:</p>
          <ul className="mt-12 flex list-disc flex-col gap-8 pl-20">
            <li>your name and contact details (phone and/or email);</li>
            <li>your country and your relationship to the person who needs treatment;</li>
            <li>
              the answers you choose about the situation: main concern, urgency, patient age range, preferred
              callback time.
            </li>
          </ul>
          <p className="mt-12">
            We do not ask for, and ask you not to submit, medical records, diagnoses or other clinical documentation
            through this website.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">How your information is used</h2>
          <p>
            Solely to respond to your request: to contact you, assess whether our service fits the situation, and
            coordinate placement if you decide to proceed. We do not sell personal information and we do not use it
            for advertising.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">How your information travels and where it is stored</h2>
          <ul className="flex list-disc flex-col gap-8 pl-20">
            <li>
              The form is transmitted over an encrypted connection (HTTPS) to our intake endpoint, hosted on
              Cloudflare infrastructure.
            </li>
            <li>
              Your request is delivered to our admissions team as a message via the Telegram Bot API to a private,
              access-restricted admissions channel. Telegram Messenger Inc. acts as a transmission provider and
              stores delivered messages in its cloud infrastructure. We restrict access to this channel to
              admissions staff only.
            </li>
            <li>
              The intake endpoint keeps no database of submissions; a temporary technical counter (IP-based rate
              limiting) is retained for up to 10 minutes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Analytics</h2>
          <p>
            We may use aggregate analytics (Google Analytics 4 and Yandex Metrica) to understand site usage.
            Analytics never receives your name, phone number, email address or free-text answers; session replay is
            disabled.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Retention</h2>
          <p>
            Admissions correspondence is retained for 24 months and then deleted, unless you become a client, in
            which case records are kept as required for the engagement.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Your rights</h2>
          <p>
            Depending on your place of residence (including California under the CCPA and Canada under PIPEDA), you
            may request access to, correction of, or deletion of your personal information. Write to
            montenegrorehab@gmail.com and we will respond within 30 days. You may also ask us at any time to stop
            contacting you.
          </p>
        </section>

        <section className="rounded-card border-token-default bg-white p-24 shadow-card-low">
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Not an emergency service</h2>
          <p className="font-weight-semibold text-navy-900">
            If someone is in immediate danger, call 911 (US/Canada) or your local emergency number. This website and
            our service are not a crisis resource.
          </p>
        </section>

        <section>
          <h2 className="mb-12 font-serif text-h4 text-navy-950">Changes</h2>
          <p>We will post any changes to this policy on this page with an updated date.</p>
        </section>

        <p>
          <strong className="font-weight-semibold text-navy-950">Contact:</strong> MK REHAB DOO, Vojina Katnića,
          ulaz C-14, stan 19, Podgorica, Montenegro, montenegrorehab@gmail.com, +1 (478) 309-7957.
        </p>
      </div>
    </div>
  );
}
