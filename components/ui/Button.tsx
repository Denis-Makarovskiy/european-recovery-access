import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "darkSecondary" | "link";

const baseClasses =
  "focus-ring inline-flex tap-target items-center justify-center gap-8 rounded-control " +
  "font-sans text-button font-weight-button transition-colors duration-150 " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none disabled:pointer-events-none";

const sizeClasses = "h-(--size-control-mobile) tablet:h-(--size-control) px-24";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-300 active:bg-gold-600 " +
    "disabled:bg-slate-200 disabled:text-slate-500",
  // 04-ui-kit.md specifies a "Navy 100 tint" hover — no such shade exists in
  // design-tokens.json (navy only goes down to navy-700), so slate-100 (the
  // closest neutral light tint on the palette) is used instead.
  secondary:
    "bg-transparent border border-navy-700 text-navy-800 hover:bg-slate-100 " +
    "disabled:border-slate-300 disabled:text-slate-500",
  // 04-ui-kit.md gives literal rgba border/hover values with no matching
  // token; approximated here via Tailwind's opacity modifier on the white
  // color token (border-white/45, hover:bg-white/8) rather than a hardcoded rgba.
  darkSecondary:
    "bg-transparent border border-white/45 text-white hover:bg-white/8 " +
    "disabled:border-white/20 disabled:text-white/40",
  link: "h-auto min-h-0 w-auto min-w-0 px-0 text-navy-800 underline-offset-4 hover:underline disabled:text-slate-500",
};

interface ButtonContentProps {
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children: ReactNode;
}

function ButtonContent({ loading, icon, iconPosition = "end", children }: ButtonContentProps) {
  return (
    <>
      {loading && <Loader2 aria-hidden className="size-16 animate-spin" />}
      {!loading && icon && iconPosition === "start" && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === "end" && icon}
    </>
  );
}

function classNames(variant: ButtonVariant, className?: string) {
  return [baseClasses, variant === "link" ? "" : sizeClasses, variantClasses[variant], className ?? ""]
    .filter(Boolean)
    .join(" ");
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    ButtonContentProps {
  variant?: ButtonVariant;
  className?: string;
}

/**
 * Native <button>. Presentational only — no "use client" — so it can be
 * imported from a server component (e.g. as a static submit trigger inside
 * a client form) without adding to the client bundle on its own.
 */
export function Button({
  variant = "primary",
  loading = false,
  icon,
  iconPosition,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(variant, className)}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      <ButtonContent loading={loading} icon={icon} iconPosition={iconPosition}>
        {children}
      </ButtonContent>
    </button>
  );
}

export interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">,
    ButtonContentProps {
  variant?: ButtonVariant;
  className?: string;
  href: string;
}

/** Same visual system as `Button`, rendered as an <a> for navigation/CTAs. */
export function ButtonLink({
  variant = "primary",
  loading = false,
  icon,
  iconPosition,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={classNames(variant, className)} aria-disabled={loading || undefined} {...props}>
      <ButtonContent loading={loading} icon={icon} iconPosition={iconPosition}>
        {children}
      </ButtonContent>
    </a>
  );
}
