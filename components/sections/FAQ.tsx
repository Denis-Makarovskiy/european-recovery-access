"use client";

import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { ADMISSIONS_PHONE_HREF, SECTION_IDS } from "@/lib/constants";
import { faq as content } from "@/lib/content";
import { trackFaqOpen } from "@/lib/analytics";

const ITEMS: AccordionItem[] = content.map((item, index) => ({
  id: `faq-${index}`,
  question: item.question,
  answer: item.answer,
}));

// Split into two visually balanced columns for the desktop 2-column layout.
// Each column is its own Accordion instance, so "one item open at a time"
// holds within each column (04-ui-kit.md's Accordion contract); nothing in
// the spec requires cross-column exclusivity for a 2-column FAQ layout.
const MID = Math.ceil(ITEMS.length / 2);
const COLUMN_1 = ITEMS.slice(0, MID);
const COLUMN_2 = ITEMS.slice(MID);

/**
 * Section 11, "FAQ" (02-page-structure.md): accessible accordion, all 10
 * Q&A from 05-content-en.md, 2 columns desktop / 1 column mobile. Client
 * component only because it wires `onItemOpen` to `trackFaqOpen` — a
 * function prop can't cross the server/client boundary into the (client)
 * `Accordion` primitive from a server component.
 */
export function FAQ() {
  function handleOpen(item: AccordionItem) {
    trackFaqOpen();
    void item;
  }

  return (
    <section id={SECTION_IDS.faq} className="bg-white py-104 tablet:py-128">
      <div className="container-max">
        <h2 className="text-center font-serif text-h2 text-navy-950">Frequently asked questions</h2>

        <div className="mt-48 grid grid-cols-1 gap-x-48 desktop-small:grid-cols-2">
          <Accordion items={COLUMN_1} onItemOpen={handleOpen} />
          <Accordion items={COLUMN_2} onItemOpen={handleOpen} />
        </div>

        <p className="mt-40 text-center font-sans text-body-s text-slate-700">
          Have more questions?{" "}
          <a
            href={ADMISSIONS_PHONE_HREF}
            className="focus-ring tap-target inline-flex items-center justify-center rounded-control px-8 font-weight-semibold text-navy-900 underline underline-offset-4"
          >
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
}
