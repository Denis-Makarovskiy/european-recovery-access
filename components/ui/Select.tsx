import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  id: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  wrapperClassName?: string;
}

/**
 * Native <select>, styled to match Input. Kept as a plain native element
 * (rather than a custom listbox) so it works with screen readers and mobile
 * pickers out of the box with zero extra JS.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    id,
    options,
    placeholder,
    hint,
    error,
    required,
    wrapperClassName = "",
    className = "",
    defaultValue,
    ...props
  },
  ref,
) {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="mb-8 block font-sans text-label font-weight-semibold text-navy-900">
        {label}
        {required && (
          <span aria-hidden className="text-error">
            {" "}
            *
          </span>
        )}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          required={required}
          defaultValue={defaultValue ?? ""}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={[
            "focus-ring block h-(--size-control) w-full appearance-none rounded-control border-token-interactive",
            "bg-white px-16 pr-40 font-sans text-body text-navy-950 transition-colors",
            "focus:border-gold-600 disabled:bg-slate-100 disabled:text-slate-500",
            error ? "border border-error focus:border-error" : "",
            className,
          ].join(" ")}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-16 top-1/2 size-16 -translate-y-1/2 text-slate-500"
        />
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-8 font-sans text-body-s text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-8 font-sans text-body-s text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
