"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
 * Matches the panel's `duration-200` transition below (the backdrop fades
 * faster, at `duration-150`; unmounting is keyed off the longer of the two
 * so the panel is never ripped out of the DOM mid-transition). This is a
 * ceiling, not a fixed wait for every user: app/globals.css forces every
 * transition-duration to 0.01ms under `prefers-reduced-motion: reduce`, and
 * the reduced-motion check further down shortens this same JS-side unmount
 * delay to match, so nothing lingers invisibly in the DOM longer than it has
 * to for those users either.
 */
const TRANSITION_MS = 200;

/**
 * Accessible modal/bottom-sheet (used e.g. for the mobile hero-form entry
 * point per 02-page-structure.md). Handles Escape-to-close, a basic focus
 * trap, body scroll locking and prefers-reduced-motion, and renders through
 * a portal so it always sits above the sticky header.
 *
 * Previously built on framer-motion's `AnimatePresence`/`motion.div`. This
 * was the dependency's only other use in the repo besides Accordion.tsx (see
 * that file's doc comment), so replacing both drops framer-motion out of the
 * bundle entirely. Modal only ever animates a fade (backdrop) and a
 * fade+slide-or-slide (panel), which plain CSS transitions reproduce
 * exactly. The one thing a library's exit-animation manager gives for free —
 * keeping content mounted for the closing transition instead of yanking it
 * out immediately — is reproduced by hand via the `rendered`/`visible` state
 * below.
 */
export function Modal({ open, onClose, title, children, variant = "center", className = "" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // One-time flag so the portal only renders after hydration (document
    // isn't available during SSR) — the standard exception to "don't
    // setState synchronously in an effect".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Drives the enter/exit transition. On open: mount immediately, then flip
  // to the "visible" (transitioned-in) classes on the next paint so the
  // transition has an initial state to animate from — setting both in the
  // same tick would never render the "before" frame. On close: flip back to
  // the hidden classes right away and only unmount once the CSS transition
  // has had time to finish, mirroring AnimatePresence's exit-then-remove
  // behavior.
  useEffect(() => {
    if (open) {
      // Synchronizing `rendered`/`visible` to the `open` prop is exactly what
      // this effect exists to do (there is no other point to derive them
      // from), so this is the same sanctioned exception as the `mounted`
      // flag above rather than the "should've been computed during render"
      // case the lint rule normally guards against.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRendered(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    }

    setVisible(false);
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = setTimeout(() => setRendered(false), reduceMotion ? 0 : TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

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

  if (!mounted || !rendered) return null;

  const panelPositionClasses =
    variant === "bottomSheet"
      ? "inset-x-0 bottom-0 w-full rounded-t-panel"
      : "inset-x-16 top-1/2 max-w-(--size-form-card-max) -translate-y-1/2 rounded-panel tablet:inset-x-auto tablet:left-1/2 tablet:-translate-x-1/2";

  const panelVisibilityClasses =
    variant === "bottomSheet"
      ? visible
        ? "translate-y-0 opacity-100"
        : "translate-y-full opacity-0"
      : visible
        ? "opacity-100"
        : "opacity-0";

  // Center variant keeps its permanent -50% vertical-centering translate
  // (the -translate-y-1/2 in panelPositionClasses above, combined at
  // tablet+ with tablet:-translate-x-1/2 for horizontal centering) and
  // layers a small enter/exit slide on top by overriding just the
  // --tw-translate-y custom property Tailwind's translate utilities read
  // from. Tailwind v4 emits `translate: var(--tw-translate-x)
  // var(--tw-translate-y)` (a dedicated CSS property, not folded into
  // `transform`), so overriding only that one variable composes cleanly
  // with panelPositionClasses's own translate classes instead of clobbering
  // them the way replacing the whole `transform`/`translate` value would.
  const panelSlideStyle: CSSProperties | undefined =
    variant === "center" ? ({ "--tw-translate-y": visible ? "-50%" : "calc(-50% + 16px)" } as CSSProperties) : undefined;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-navy-950/60 transition duration-150 ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={panelSlideStyle}
        className={[
          "focus-ring absolute bg-white p-24 shadow-card-high transition duration-200 ease-in-out",
          panelPositionClasses,
          panelVisibilityClasses,
          className,
        ].join(" ")}
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
      </div>
    </div>,
    document.body,
  );
}
