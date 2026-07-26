import { CreditCard, Globe2, Languages, ShieldCheck } from "lucide-react";
import { SECTION_IDS } from "@/lib/constants";
import { trustStrip as content } from "@/lib/content";

const ICONS = [ShieldCheck, Languages, CreditCard, Globe2];

/**
 * Section 3, "Trust Strip" (02-page-structure.md): four compact icon+text
 * items directly below the hero. Purely presentational, no client state.
 */
export function TrustStrip() {
  return (
    <section id={SECTION_IDS.trustStrip} aria-label="Trust indicators" className="border-b border-token-default bg-white py-32">
      <div className="container-max grid grid-cols-1 gap-24 tablet:grid-cols-2 desktop-small:grid-cols-4">
        {content.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <div key={item} className="flex items-center gap-12">
              <span className="flex size-40 shrink-0 items-center justify-center rounded-pill bg-gold-100 text-gold-600">
                <Icon aria-hidden className="size-20" />
              </span>
              <span className="font-sans text-body-s font-weight-semibold text-navy-900">{item}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
