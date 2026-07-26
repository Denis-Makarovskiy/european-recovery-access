import { CheckCircle2 } from "lucide-react";
import { SECTION_IDS } from "@/lib/constants";
import { included as content } from "@/lib/content";

/**
 * Section 7, "What's Included" (02-page-structure.md): 7 compact items on
 * an off-white band, plus the note clarifying clinical services are
 * provided by the selected program, not European Recovery Access.
 */
export function Included() {
  return (
    <section id={SECTION_IDS.included} className="bg-off-white py-104 tablet:py-128">
      <div className="container-max">
        <h2 className="text-center font-serif text-h2 text-navy-950">{content.heading}</h2>

        <ul className="mt-48 grid grid-cols-1 gap-20 tablet:grid-cols-2 desktop-small:grid-cols-4">
          {content.items.map((item) => (
            <li key={item} className="flex items-start gap-12 rounded-card bg-white p-20 shadow-card-low">
              <CheckCircle2 aria-hidden className="mt-2 size-20 shrink-0 text-gold-600" />
              <span className="font-sans text-body-s font-weight-semibold text-navy-900">{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-32 text-center font-sans text-body-s text-slate-500">{content.note}</p>
      </div>
    </section>
  );
}
