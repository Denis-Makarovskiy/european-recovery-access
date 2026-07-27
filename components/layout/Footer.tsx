import { BrandMark } from "@/components/ui/BrandMark";
import { NAV_ITEMS, ADMISSIONS_PHONE_DISPLAY, ADMISSIONS_PHONE_HREF, SITE_NAME } from "@/lib/constants";
import { footer as footerContent } from "@/lib/content";

/**
 * Footer links carry the 44px minimum tap target required by
 * 07-codex-technical-spec.md; the row gap is tightened to compensate so the
 * columns stay visually dense.
 */
const footerLink =
  "focus-ring inline-flex items-center tap-target rounded-control font-sans text-body-s hover:underline";

/** Static site footer: 4 columns + the mandatory disclaimer, verbatim from 05-content-en.md. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-max grid grid-cols-1 gap-40 py-64 tablet:grid-cols-2 desktop-small:grid-cols-4">
        <div>
          <div className="flex items-center gap-8">
            <BrandMark size={32} />
            <span className="font-serif text-body-l font-weight-semibold">{SITE_NAME}</span>
          </div>
          <p className="mt-16 font-sans text-body-s text-slate-300">{footerContent.descriptor}</p>
          <p className="mt-16 font-sans text-body-s text-slate-300">{footerContent.companyLine1}</p>
          <p className="mt-8 font-sans text-body-s text-slate-300">{footerContent.companyLine2}</p>
        </div>

        <div>
          <h3 className="mb-16 font-sans text-label font-weight-semibold uppercase tracking-eyebrow text-slate-300">
            Navigation
          </h3>
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={footerLink}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/professionals/" className={footerLink}>
                For Professionals
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-16 font-sans text-label font-weight-semibold uppercase tracking-eyebrow text-slate-300">
            Contact
          </h3>
          <ul className="flex flex-col gap-4 font-sans text-body-s">
            <li>
              <a href={ADMISSIONS_PHONE_HREF} className={footerLink}>
                {ADMISSIONS_PHONE_DISPLAY}
              </a>
            </li>
            <li className="text-slate-300">Admissions coordination for the US and Canada</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-16 font-sans text-label font-weight-semibold uppercase tracking-eyebrow text-slate-300">
            Legal
          </h3>
          <ul className="flex flex-col gap-4">
            <li>
              <a href="/privacy" className={footerLink}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className={footerLink}>
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-max flex flex-col gap-16 py-24 desktop-small:flex-row desktop-small:items-center desktop-small:justify-between">
          <p className="font-sans text-body-s text-slate-300">{footerContent.disclaimer}</p>
          <p className="whitespace-nowrap font-sans text-body-s text-slate-300">
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
