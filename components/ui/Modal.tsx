"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** "center" for a standard dialog, "bottomSheet" for the mobile full-width sheet pattern. */
  variant?: "center" | "bottomSheet";
  className?: string;
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal/bottom-sheet (used e.g. for the mobile hero-form entry
 * point per 02-page-structure.md). Handles Escape-to-close, a basic focus
 * trap, body scroll locking and prefers-reduced-motion, and renders through
 * a portal so it always sits above the sticky header.
 */
export function Modal({ open, onClose, title, children, variant = "center", className = "" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // One-time flag so the portal only renders after hydration (document
    // isn't available during SSR) — the standard exception to "don't
    // setState synchronously in an effect".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const panelPositionClasses =
    variant === "bottomSheet"
      ? "inset-x-0 bottom-0 w-full rounded-t-panel"
      : "inset-x-16 top-1/2 max-w-(--size-form-card-max) -translate-y-1/2 rounded-panel tablet:inset-x-auto tablet:left-1/2 tablet:-translate-x-1/2";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-navy-950/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={["focus-ring absolute bg-white p-24 shadow-card-high", panelPositionClasses, className].join(
              " ",
            )}
            initial={variant === "bottomSheet" ? { y: "100%" } : { opacity: 0, y: 16 }}
            animate={variant === "bottomSheet" ? { y: 0 } : { opacity: 1, y: 0 }}
            exit={variant === "bottomSheet" ? { y: "100%" } : { opacity: 0, y: 16 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeInOut" }}
          >
            <div className="mb-16 flex items-start justify-between gap-16">
              <h2 className="font-serif text-h4 text-navy-950">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="focus-ring tap-target flex items-center justify-center rounded-control text-navy-700 hover:bg-slate-100"
              >
                <X aria-hidden className="size-20" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
