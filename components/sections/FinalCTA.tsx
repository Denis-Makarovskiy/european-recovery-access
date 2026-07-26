"use client";

import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ADMISSIONS_PHONE_HREF, SECTION_IDS } from "@/lib/constants";
import { finalCta as content } from "@/lib/content";
import { trackCallClick, trackHeroCtaClick } from "@/lib/analytics";

/**
 * Section 12, "Final CTA" (02-page-structure.md): dark navy section over
 * the same token-based gradient used in the hero (no separate asset
 * exists), headline + support line + two buttons.
 */
export function FinalCTA() {
  return (
    <section id={SECTION_IDS.finalCta} className="hero-gradient-placeholder py-104 tablet:py-128">
      <div className="container-max text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-h2 text-white">{content.headline}</h2>
        <p className="mx-auto mt-16 max-w-2xl font-sans text-body-l text-white/85">{content.body}</p>

        <div className="mt-32 flex flex-col items-center justify-center gap-16 tablet:flex-row">
          <ButtonLink
            href={`#${SECTION_IDS.assessment}`}
            variant="primary"
            onClick={() => trackHeroCtaClick({ device_category: "desktop" })}
          >
            {content.primaryCta}
          </ButtonLink>
          <ButtonLink
            href={ADMISSIONS_PHONE_HREF}
            variant="darkSecondary"
            icon={<Phone aria-hidden className="size-16" />}
            iconPosition="start"
            onClick={() => trackCallClick({ device_category: "desktop" })}
          >
            {content.secondaryCta}
          </ButtonLink>
        </div>

        <p className="mt-24 font-sans text-body-s text-white/70">{content.microcopy}</p>
      </div>
    </section>
  );
}
