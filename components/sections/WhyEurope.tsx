import { Clock, Compass, ShieldCheck, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SECTION_IDS } from "@/lib/constants";
import { whyEurope as content } from "@/lib/content";

const ICONS = [Clock, Compass, ShieldCheck, UserCheck];

/**
 * Section 4, "Why Families Choose Europe" (02-page-structure.md): heading +
 * intro, then 4 equal benefit cards with a 56px icon circle, 20-24px title
 * and 2-3 lines of body text. Uses the shared `Card` "benefit" variant,
 * which already implements the 16px radius / 32px padding / low shadow /
 * hover translateY(-6px)-on-pointer-devices treatment from 04-ui-kit.md.
 */
export function WhyEurope() {
  return (
    <section id={SECTION_IDS.whyEurope} className="py-104 tablet:py-128">
      <div className="container-max">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-h2 text-navy-950">{content.heading}</h2>
          <p className="mt-16 font-sans text-body-l text-slate-700">{content.intro}</p>
        </div>

        <div className="mt-48 grid grid-cols-1 gap-24 tablet:grid-cols-2 desktop-small:grid-cols-4">
          {content.cards.map((card, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <Card key={card.title} variant="benefit">
                <span className="flex size-(--size-icon-circle) items-center justify-center rounded-pill bg-gold-100 text-gold-600">
                  <Icon aria-hidden className="size-24" />
                </span>
                <h3 className="mt-24 font-serif text-h4 text-navy-950">{card.title}</h3>
                <p className="mt-12 font-sans text-body-s text-slate-700">{card.body}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
