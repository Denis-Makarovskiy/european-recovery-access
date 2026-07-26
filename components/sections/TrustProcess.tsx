import { Clock3, Receipt, Target, Users } from "lucide-react";
import { SECTION_IDS } from "@/lib/constants";
import { trustProcess as content } from "@/lib/content";

const ICONS = [Users, Target, Receipt, Clock3];

/**
 * Section 8, "Why Trust the Process" (02-page-structure.md), labelled
 * "Trust section" in 05-content-en.md. Uses process-evidence copy only —
 * no numeric metric is rendered here because none appears in that source
 * copy (per CLAUDE.md's constraint against publishing unverified numbers).
 */
export function TrustProcess() {
  return (
    <section id={SECTION_IDS.trustProcess} className="bg-white py-104 tablet:py-128">
      <div className="container-max">
        <h2 className="text-center font-serif text-h2 text-navy-950">{content.heading}</h2>

        <div className="mt-48 grid grid-cols-1 gap-32 tablet:grid-cols-2 desktop-small:grid-cols-4">
          {content.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div key={item.title} className="text-center tablet:text-left">
                <span className="mx-auto flex size-(--size-icon-circle) items-center justify-center rounded-pill bg-navy-900 text-gold-300 tablet:mx-0">
                  <Icon aria-hidden className="size-24" />
                </span>
                <h3 className="mt-16 font-serif text-h4 text-navy-950">{item.title}</h3>
                <p className="mt-8 font-sans text-body-s text-slate-700">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
