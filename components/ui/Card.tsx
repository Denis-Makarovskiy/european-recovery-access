import type { HTMLAttributes } from "react";

export type CardVariant = "benefit" | "form" | "panel" | "scenario";

const variantClasses: Record<CardVariant, string> = {
  // 04-ui-kit.md "Benefit card": white, 16px radius, 32px padding, low
  // shadow, hover lift on pointer devices. No exact "-6px" spacing token
  // exists, so the closest token (space-8) is used for the hover lift.
  benefit: "rounded-card bg-white p-32 shadow-card-low transition-transform duration-150 hover:-translate-y-8",
  // "Form card": navy-900 surface, white text, 24px radius, high shadow,
  // 32-40px padding, 440-480px width band.
  form: "rounded-panel bg-navy-900 p-32 tablet:p-40 text-white shadow-card-high min-w-(--size-form-card-min) max-w-(--size-form-card-max)",
  // "Assessment panel": off-white/white, 24px radius, 24px mobile padding,
  // 40-56px desktop padding (approximated with the 40/48 tokens available).
  panel: "rounded-panel bg-off-white p-24 tablet:p-40 desktop:p-48",
  // "Scenario card": white, left gold rule, compact padding.
  scenario: "border-l-4 border-gold-500 bg-white py-16 pl-24 pr-16",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

/** Generic surface primitive covering the 4 card treatments in 04-ui-kit.md. */
export function Card({ variant = "benefit", className = "", ...props }: CardProps) {
  return <div className={[variantClasses[variant], className].join(" ")} {...props} />;
}
