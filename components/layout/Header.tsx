"use client";

import { useEffect, useState } from "react";
import { Lock, Menu, Phone, X } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { ButtonLink } from "@/components/ui/Button";
import { NAV_ITEMS, SECTION_IDS, ADMISSIONS_PHONE_HREF, ADMISSIONS_PHONE_DISPLAY } from "@/lib/constants";
import { nav as navContent } from "@/lib/content";
import { trackCallClick } from "@/lib/analytics";

const SCROLL_THRESHOLD = 24;

/**
 * Sticky site header. Matches design-refs/landing-desktop-mockup.png, which
 * shows a solid white header from first paint (the hero image sits below
 * it, not behind it) — so unlike the "transparent at load" option described
 * in 02-page-structure.md, this always renders white and only gains the
 * bottom border/shadow after SCROLL_THRESHOLD px, per that same doc.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 h-(--layout-header-height) bg-white transition-shadow duration-200",
        scrolled ? "border-b border-token-default shadow-header" : "",
      ].join(" ")}
    >
      <div className="container-max flex h-full items-center justify-between gap-16">
        <a href={`#${SECTION_IDS.hero}`} className="focus-ring flex items-center gap-8 rounded-control">
          <BrandMark size={40} />
          <span className="font-serif leading-tight text-navy-950">
            <span className="block text-body-s font-weight-semibold tracking-eyebrow">EUROPEAN</span>
            <span className="block text-body-s font-weight-semibold tracking-eyebrow">RECOVERY ACCESS</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden desktop-small:flex desktop-small:items-center desktop-small:gap-32">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring tap-target flex items-center rounded-control font-sans text-body-s font-weight-semibold text-navy-900 hover:underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden desktop-small:flex desktop-small:items-center desktop-small:gap-24">
          <span className="flex items-center gap-8 font-sans text-body-s font-weight-semibold text-navy-800">
            <Lock aria-hidden className="size-16 text-gold-600" />
            {navContent.utility}
          </span>
          <a
            href={ADMISSIONS_PHONE_HREF}
            onClick={() => trackCallClick({ device_category: "desktop" })}
            className="focus-ring tap-target flex items-center rounded-control font-sans text-body-s font-weight-semibold text-navy-800 hover:underline"
          >
            Call Admissions
          </a>
          <ButtonLink href={`#${SECTION_IDS.assessment}`} variant="primary" className="hidden desktop:inline-flex">
            {navContent.cta}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-8 desktop-small:hidden">
          <a
            href={ADMISSIONS_PHONE_HREF}
            onClick={() => trackCallClick({ device_category: "mobile" })}
            aria-label={`Call Admissions, ${ADMISSIONS_PHONE_DISPLAY}`}
            className="focus-ring tap-target flex items-center justify-center rounded-control text-navy-900"
          >
            <Phone aria-hidden className="size-20" />
          </a>
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="focus-ring tap-target flex items-center justify-center rounded-control text-navy-900"
          >
            <Menu aria-hidden className="size-24" />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="container-max flex h-(--layout-header-height) items-center justify-between">
            <BrandMark size={36} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="focus-ring tap-target flex items-center justify-center rounded-control text-navy-900"
            >
              <X aria-hidden className="size-24" />
            </button>
          </div>

          <nav aria-label="Mobile" className="container-max flex flex-1 flex-col gap-8 pt-24">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="focus-ring tap-target flex items-center rounded-control py-16 font-sans text-h4 font-weight-semibold text-navy-950"
              >
                {item.label}
              </a>
            ))}
            <span className="mt-16 flex items-center gap-8 font-sans text-body-s font-weight-semibold text-navy-800">
              <Lock aria-hidden className="size-16 text-gold-600" />
              {navContent.utility}
            </span>
          </nav>

          <div className="container-max sticky bottom-0 flex flex-col gap-12 border-t border-token-default bg-white py-24">
            <ButtonLink
              href={`#${SECTION_IDS.assessment}`}
              variant="primary"
              className="w-full"
              onClick={() => setDrawerOpen(false)}
            >
              {navContent.cta}
            </ButtonLink>
            <ButtonLink
              href={ADMISSIONS_PHONE_HREF}
              variant="secondary"
              className="w-full"
              onClick={() => {
                trackCallClick({ device_category: "mobile" });
                setDrawerOpen(false);
              }}
            >
              Call Admissions
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
