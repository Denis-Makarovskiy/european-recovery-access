"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  /**
   * "boxed" — each item is a bordered card with internal padding, matching
   * design-refs/landing-desktop-mockup.png. "flush" — the bottom-border-only
   * treatment described in 04-ui-kit.md, for use inside a container that
   * already provides its own padding.
   */
  variant?: "boxed" | "flush";
  /** Called when an item is opened — wire this up to `trackFaqOpen` from lib/analytics.ts. */
  onItemOpen?: (item: AccordionItem) => void;
}

/**
 * Accessible accordion (04-ui-kit.md "Accordion" + 07-codex-technical-spec.md
 * "FAQ"): only one item open at a time, aria-expanded/aria-controls kept in
 * sync, smooth height transition under 220ms, and honours
 * prefers-reduced-motion.
 *
 * Previously animated the open/close height with framer-motion
 * (AnimatePresence + motion.div animating height: 0 -> "auto"). That was
 * this repo's only other use of framer-motion besides Modal.tsx (see that
 * file's doc comment), so replacing both drops the dependency out of the
 * bundle entirely. Plain CSS can't transition to/from `height: auto`
 * directly, so this uses the standard CSS Grid workaround instead: a
 * `grid-template-rows: 0fr` -> `1fr` transition on the wrapper, which lets
 * the browser interpolate the *track* size against the panel's actual
 * content height without ever having to read/measure it in JS. The
 * previously-conditionally-mounted panel is now always in the DOM (so it can
 * transition rather than pop in/out) but is `aria-hidden` and clipped via
 * `overflow-hidden` while closed, keeping it out of the accessibility tree
 * and tab order exactly as when it was unmounted — screen-reader/keyboard
 * behavior is unchanged, only the always-present static HTML is new (a
 * incidental accessibility/SEO improvement: closed answers are now in the
 * static markup, just visually collapsed, instead of absent).
 * prefers-reduced-motion is honoured for free: app/globals.css already
 * forces every transition-duration to 0.01ms under that media query, so no
 * separate JS check is needed here.
 */
export function Accordion({ items, className = "", variant = "boxed", onItemOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const isBoxed = variant === "boxed";

  const listClasses = isBoxed ? "flex flex-col gap-12" : "";
  const itemClasses = isBoxed
    ? "rounded-card border-token-default bg-white px-20 tablet:px-24"
    : "border-b border-token-default";

  function toggle(item: AccordionItem) {
    setOpenId((current) => {
      const next = current === item.id ? null : item.id;
      if (next) onItemOpen?.(item);
      return next;
    });
  }

  return (
    <div className={`${listClasses} ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${item.id}-panel`;
        const triggerId = `${item.id}-trigger`;

        return (
          <div key={item.id} className={itemClasses}>
            <h3 className="text-inherit">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item)}
                // 04-ui-kit.md specifies an 18px question; body-l (20px) is the
                // nearest token — h4 (22px) overshot it noticeably.
                className="focus-ring flex w-full tap-target items-center justify-between gap-16 py-20 text-left font-sans text-body-l font-weight-semibold text-navy-950"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <Minus aria-hidden className="size-20 shrink-0 text-gold-600" />
                ) : (
                  <Plus aria-hidden className="size-20 shrink-0 text-navy-700" />
                )}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="pb-20 pt-4 font-sans text-body text-slate-700">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
