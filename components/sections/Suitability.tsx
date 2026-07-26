import { AlertTriangle, Check, X } from "lucide-react";
import { SECTION_IDS } from "@/lib/constants";
import { suitability as content } from "@/lib/content";

/**
 * Section 9, "Who This Is For" (02-page-structure.md): two columns —
 * "suitable when" and "may not be suitable when" — plus the emergency
 * note. Content is verbatim from 05-content-en.md's "Suitability" section.
 */
export function Suitability() {
  return (
    <section id={SECTION_IDS.suitability} className="bg-off-white py-104 tablet:py-128">
      <div className="container-max">
        <div className="grid grid-cols-1 gap-40 desktop-small:grid-cols-2 desktop-small:gap-64">
          <div>
            <h2 className="font-serif text-h3 text-navy-950">{content.heading}</h2>
            <ul className="mt-24 flex flex-col gap-16">
              {content.suitableList.map((item) => (
                <li key={item} className="flex items-start gap-12">
                  <span className="mt-2 flex size-24 shrink-0 items-center justify-center rounded-pill bg-success/10 text-success">
                    <Check aria-hidden className="size-14" />
                  </span>
                  <span className="font-sans text-body text-navy-900">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-h3 text-navy-950">{content.heading2}</h2>
            <ul className="mt-24 flex flex-col gap-16">
              {content.unsuitableList.map((item) => (
                <li key={item} className="flex items-start gap-12">
                  <span className="mt-2 flex size-24 shrink-0 items-center justify-center rounded-pill bg-error/10 text-error">
                    <X aria-hidden className="size-14" />
                  </span>
                  <span className="font-sans text-body text-navy-900">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-40 flex items-start gap-12 rounded-card border-token-default bg-white p-24 shadow-card-low">
          <AlertTriangle aria-hidden className="mt-2 size-20 shrink-0 text-warning" />
          <p className="font-sans text-body-s font-weight-semibold text-navy-900">{content.emergencyNote}</p>
        </div>
      </div>
    </section>
  );
}
