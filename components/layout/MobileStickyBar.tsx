import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ADMISSIONS_PHONE_HREF, SECTION_IDS } from "@/lib/constants";
import { nav as navContent } from "@/lib/content";

/**
 * Bottom action bar for small screens (02-page-structure.md "Mobile sticky
 * bar"): Call + Check Availability, visible below the tablet breakpoint,
 * padded for the iOS home-indicator safe area. Purely presentational (no
 * client state), so no "use client" directive is needed here.
 */
export function MobileStickyBar() {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-token-default bg-white pt-12 tablet:hidden">
      <div className="flex gap-12 px-16">
        <ButtonLink href={ADMISSIONS_PHONE_HREF} variant="secondary" className="flex-1" icon={<Phone aria-hidden className="size-16" />} iconPosition="start">
          Call
        </ButtonLink>
        <ButtonLink href={`#${SECTION_IDS.assessment}`} variant="primary" className="flex-1">
          {navContent.cta}
        </ButtonLink>
      </div>
    </div>
  );
}
