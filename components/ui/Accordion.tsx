"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
 * prefers-reduced-motion via framer-motion's `useReducedMotion`.
 */
export function Accordion({ items, className = "", variant = "boxed", onItemOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
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
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-20 pt-4 font-sans text-body text-slate-700">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
