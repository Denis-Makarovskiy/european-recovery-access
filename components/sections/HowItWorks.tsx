import { Building2, ClipboardList, Handshake, Phone, Plane } from "lucide-react";
import { SECTION_IDS } from "@/lib/constants";
import { howItWorks as content } from "@/lib/content";

const ICONS = [Phone, ClipboardList, Building2, Plane, Handshake];

/**
 * Section 6, "How It Works" (02-page-structure.md): 5-step timeline —
 * horizontal with a connecting line on desktop, vertical on mobile. Each
 * step: numbered circle with icon, title, short description.
 *
 * The connecting line is a single decorative bar (dashed, token border
 * color) shown only at the desktop-small breakpoint and up, positioned
 * through the circle centers at `top-24` (half of the `size-48` circle) so
 * it lines up with the circles without any arbitrary pixel math. Below that
 * breakpoint the numbered circles stack vertically without a connector,
 * which reads cleanly as a simple ordered list.
 */
export function HowItWorks() {
  return (
    <section id={SECTION_IDS.howItWorks} className="bg-white py-104 tablet:py-128">
      <div className="container-max">
        <h2 className="text-center font-serif text-h2 text-navy-950">{content.heading}</h2>

        <div className="relative mt-64">
          <div
            aria-hidden
            className="absolute inset-x-0 top-24 hidden border-t-2 border-dashed border-slate-300 desktop-small:block"
          />

          <ol className="relative grid grid-cols-1 gap-40 desktop-small:grid-cols-5 desktop-small:gap-24">
            {content.steps.map((step, index) => {
              const Icon = ICONS[index % ICONS.length];
              return (
                <li key={step.title} className="relative flex gap-16 desktop-small:flex-col desktop-small:items-center desktop-small:text-center">
                  <span className="relative z-10 flex size-48 shrink-0 items-center justify-center rounded-pill bg-navy-900 font-sans text-body-s font-weight-bold text-white">
                    {index + 1}
                  </span>
                  <div className="pt-4 desktop-small:pt-0">
                    <Icon aria-hidden className="size-20 text-gold-600 desktop-small:mx-auto" />
                    <h3 className="mt-8 font-serif text-h4 text-navy-950">{step.title}</h3>
                    <p className="mt-8 font-sans text-body-s text-slate-700">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
