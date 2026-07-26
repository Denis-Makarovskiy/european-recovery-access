import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "focus-ring block w-full rounded-control border-token-interactive bg-white px-16 " +
  "font-sans text-body text-navy-950 placeholder:text-slate-500 transition-colors " +
  "focus:border-gold-600 disabled:bg-slate-100 disabled:text-slate-500";

const errorClasses = "border border-error focus:border-error";

interface FieldChromeProps {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  required?: boolean;
  wrapperClassName?: string;
}

function FieldLabel({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="mb-8 block font-sans text-label font-weight-semibold text-navy-900">
      {label}
      {required && (
        <span aria-hidden className="text-error">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

function FieldMessages({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} role="alert" className="mt-8 font-sans text-body-s text-error">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className="mt-8 font-sans text-body-s text-slate-500">
        {hint}
      </p>
    );
  }
  return null;
}

export type InputProps = FieldChromeProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

/**
 * Text/email/tel input (covers the "Text, Email, Tel" field types from
 * 04-ui-kit.md — pass `type="email" | "tel" | "text"` etc). Always renders a
 * visible <label>; forwards its ref so it can be registered with React Hook
 * Form in a later task.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, hint, error, required, wrapperClassName = "", className = "", ...props },
  ref,
) {
  return (
    <div className={wrapperClassName}>
      <FieldLabel id={id} label={label} required={required} />
      <input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={[fieldBase, "h-(--size-control)", error ? errorClasses : "", className].join(" ")}
        {...props}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
});

export type TextareaProps = FieldChromeProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

/** Multi-line variant of the same field chrome, for the "Textarea" field type. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, id, hint, error, required, wrapperClassName = "", className = "", rows = 4, ...props },
  ref,
) {
  return (
    <div className={wrapperClassName}>
      <FieldLabel id={id} label={label} required={required} />
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={[fieldBase, "py-12", error ? errorClasses : "", className].join(" ")}
        {...props}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
});
