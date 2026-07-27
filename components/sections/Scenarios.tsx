import { Card } from "@/components/ui/Card";
import { SECTION_IDS } from "@/lib/constants";
import { scenarios as content } from "@/lib/content";

/**
 * Section 10 replacement, "Scenarios" (02-page-structure.md / 05-content-en.md):
 * three illustrative example situations in the "Scenario card" treatment from
 * 04-ui-kit.md (white, left gold rule, context label, problem statement,
 * service response) via `Card` variant="scenario". The subtitle explicitly
 * marking these as illustrative examples rather than client stories is a
 * legal safeguard (CLAUDE.md's constraint against invented client stories)
 * and must stay visibly rendered next to the heading, not just present in
 * markup.
 */
export function Scenarios() {
  return (
    <section id={SECTION_IDS.scenarios} className="bg-off-white py-104 tablet:py-128">
      <div className="container-max">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-h2 text-navy-950">{content.heading}</h2>
          <p className="mt-16 font-sans text-body-l text-slate-700">{content.subtitle}</p>
        </div>

        <div className="mt-48 grid grid-cols-1 gap-24 desktop-small:grid-cols-3">
          {content.cards.map((card) => (
            <Card key={card.context} variant="scenario" className="shadow-card-low">
              <p className="font-sans text-eyebrow font-weight-semibold uppercase tracking-eyebrow text-gold-600">
                {card.context}
              </p>
              <p className="mt-12 font-sans text-body text-navy-900">{card.situation}</p>
              <p className="mt-16 font-sans text-body-s text-slate-700">{card.response}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
