import { useId } from "react";

export interface ProgressProps {
  step: number;
  total: number;
  className?: string;
}

/**
 * Assessment progress indicator (04-ui-kit.md "Progress indicator"):
 * "Step X of Y" label over a 4px navy-800 track with a gold-500 fill.
 */
export function Progress({ step, total, className = "" }: ProgressProps) {
  const percent = total > 0 ? Math.min(100, Math.max(0, (step / total) * 100)) : 0;
  // Lighthouse a11y fix: the visible "Step X of Y" label wasn't
  // programmatically associated with the progressbar (aria-valuetext alone
  // doesn't satisfy axe's aria-progressbar-name rule), so screen readers
  // announced it with no name. aria-labelledby ties it to that same label.
  const labelId = useId();

  return (
    <div className={className}>
      <p id={labelId} className="mb-8 font-sans text-label font-weight-semibold text-navy-800">
        Step {step} of {total}
      </p>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuetext={`Step ${step} of ${total}`}
        aria-labelledby={labelId}
        className="h-4 w-full overflow-hidden rounded-pill bg-navy-800"
      >
        <div
          className="h-full rounded-pill bg-gold-500 transition-[width] duration-200 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
