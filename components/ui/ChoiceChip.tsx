import type { ButtonHTMLAttributes } from "react";
import { Check } from "lucide-react";

export interface ChoiceChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  selected?: boolean;
  children: React.ReactNode;
}

/**
 * Selectable answer chip used by the assessment (04-ui-kit.md "Selection
 * chips"). A native <button type="button"> with aria-pressed gives full
 * keyboard support (Tab to focus, Enter/Space to toggle) with no extra ARIA
 * wiring required. Grouping into a single-select question is the
 * responsibility of the parent (radiogroup semantics can be added there if
 * a step is strictly single-answer).
 */
export function ChoiceChip({ selected = false, className = "", children, ...props }: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={[
        "focus-ring tap-target flex min-h-(--size-chip-min) items-center justify-center gap-8 rounded-control px-16 py-8",
        "text-center font-sans text-body-s font-weight-semibold transition-colors",
        selected
          ? "border-token-selected bg-gold-100 text-navy-950"
          : "border-token-default bg-white text-navy-900 hover:border-gold-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...props}
    >
      {selected && <Check aria-hidden className="size-16 shrink-0 text-gold-600" />}
      <span>{children}</span>
    </button>
  );
}
