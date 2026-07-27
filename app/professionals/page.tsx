import type { Metadata } from "next";
import { Mail, Phone, ShieldAlert } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ADMISSIONS_PHONE_DISPLAY, ADMISSIONS_PHONE_HREF } from "@/lib/constants";
import { professionals as content } from "@/lib/content";

export const metadata: Metadata = {
  // Per-page canonical: the root layout sets "/" for the whole site,
  // which is wrong for subpages; metadataBase resolves this to the full URL.
  alternates: { canonical: "/professionals/" },
  title: "For Professionals — European Recovery Access",
  description:
    "You are often the first call a family makes. When the right next step is treatment and local programs are full, too close to home, or already tried, we give you a European option you can put on the table the same day.",
};

const ADMISSIONS_EMAIL = "admissions@recoveryeurope.com";

/**
 * /professionals — standalone static page for interventionists, family
 * attorneys/family offices and physicians/therapists. Copy is verbatim from
 * 05-content-en.md, "For Professionals page (/professionals)"; structure
 * follows the pattern in app/privacy/page.tsx and app/terms/page.tsx
 * (server component, own `metadata`, tokens-only styling, no client JS).
 */
export default function ProfessionalsPage() {
  return (
    <div className="py-64 tablet:py-104">
      <div className="container-max">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sans text-eyebrow font-weight-semibold uppercase tracking-eyebrow text-gold-600">
            {content.eyebrow}
          </p>
          <h1 className="mt-16 font-serif text-h1-mobile text-navy-950 tablet:text-display-l">{content.h1}</h1>
          <p className="mt-24 font-sans text-body-l text-slate-700">{content.intro}</p>
        </div>

        {/* Audience cards */}
        <div className="mt-64 grid grid-cols-1 gap-24 tablet:grid-cols-3">
          {content.audienceCards.map((card) => (
            <Card key={card.label} variant="benefit">
              <p className="font-sans text-eyebrow font-weight-semibold uppercase tracking-eyebrow text-gold-600">
                {card.label}
              </p>
              <h2 className="mt-16 font-serif text-h4 text-navy-950">{card.title}</h2>
              <p className="mt-12 font-sans text-body-s text-slate-700">{card.body}</p>
            </Card>
          ))}
        </div>

        {/* How it works with you */}
        <div className="mt-104">
          <h2 className="text-center font-serif text-h2 text-navy-950">{content.howItWorksHeading}</h2>
          <ol className="mx-auto mt-48 flex max-w-3xl flex-col gap-24">
            {content.howItWorksSteps.map((step, index) => (
              <li key={step.lead} className="flex items-start gap-16">
                <span className="flex size-40 shrink-0 items-center justify-center rounded-pill bg-navy-900 font-sans text-body-s font-weight-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-8 font-sans text-body text-navy-900">
                  <strong className="font-weight-semibold text-navy-950">{step.lead}</strong> — {step.rest}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* What we do not do — legal safeguard, kept visually distinct and verbatim. */}
        <div className="mx-auto mt-104 max-w-3xl">
          <div className="flex flex-col gap-16 rounded-card border-2 border-error/40 bg-white p-24 tablet:p-32 shadow-card-low">
            <div className="flex items-center gap-12">
              <ShieldAlert aria-hidden className="size-24 shrink-0 text-error" />
              <h2 className="font-serif text-h4 text-navy-950">{content.whatWeDoNotDoHeading}</h2>
            </div>
            <ul className="flex flex-col gap-12 pl-4">
              {content.whatWeDoNotDoItems.map((item) => (
                <li key={item.rest} className="font-sans text-body text-navy-900">
                  {item.lead && <strong className="font-weight-semibold text-navy-950">{item.lead} </strong>}
                  {item.rest}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-104 rounded-panel bg-navy-950 p-32 text-center tablet:p-64">
          <h2 className="font-serif text-h3 text-white">{content.ctaHeading}</h2>
          <p className="mx-auto mt-16 max-w-2xl font-sans text-body-l text-white/85">{content.ctaBody}</p>
          <div className="mt-32 flex flex-col items-center justify-center gap-16 tablet:flex-row">
            <ButtonLink
              href={ADMISSIONS_PHONE_HREF}
              variant="primary"
              icon={<Phone aria-hidden className="size-16" />}
              iconPosition="start"
            >
              {content.ctaCallLabel} · {ADMISSIONS_PHONE_DISPLAY}
            </ButtonLink>
            <ButtonLink
              href={`mailto:${ADMISSIONS_EMAIL}`}
              variant="darkSecondary"
              icon={<Mail aria-hidden className="size-16" />}
              iconPosition="start"
            >
              {content.ctaEmailLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
