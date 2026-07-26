export interface BrandMarkProps {
  size?: number;
  className?: string;
  /** Set to false (and it will render a <title>) when the mark appears without the wordmark next to it. */
  decorative?: boolean;
}

/**
 * Inline shield-with-wheat brand mark, approximating design-refs/brand-logo-
 * sheet.png (no logo asset file exists yet). Colors are wired to the navy
 * and gold tokens via CSS variables, not hardcoded hex values, so it stays
 * in sync with app/globals.css if the palette ever changes.
 *
 * Geometry is a simplified, hand-built approximation (shield outline with a
 * white inset ring + a stylised wheat stalk) — not a pixel trace of the
 * reference sheet.
 */
export function BrandMark({ size = 40, className = "", decorative = true }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
    >
      {decorative ? null : <title>European Recovery Access</title>}

      {/* Outer shield: white ring */}
      <path
        d="M50 4 L90 18 V50 C90 74 72 90 50 96 C28 90 10 74 10 50 V18 Z"
        fill="var(--color-white)"
      />
      {/* Inner shield: navy body */}
      <path
        d="M50 10 L83 22 V50 C83 70 68 83 50 88 C32 83 17 70 17 50 V22 Z"
        fill="var(--color-navy-900)"
      />

      {/* Wheat stalk */}
      <g fill="var(--color-gold-500)">
        <rect x="48.5" y="38" width="3" height="42" rx="1.5" fill="var(--color-gold-600)" />

        <path d="M50 78 C42 76 36 70 38 62 C45 63 50 69 50 78 Z" />
        <path d="M50 78 C58 76 64 70 62 62 C55 63 50 69 50 78 Z" />

        <path d="M50 66 C42.5 64 37 58.5 39 51 C45.5 52 50 58 50 66 Z" />
        <path d="M50 66 C57.5 64 63 58.5 61 51 C54.5 52 50 58 50 66 Z" />

        <path d="M50 54 C43.5 52.3 39 47.5 40.5 41 C46 41.8 50 47 50 54 Z" />
        <path d="M50 54 C56.5 52.3 61 47.5 59.5 41 C54 41.8 50 47 50 54 Z" />

        <path d="M50 44 C46 42 43.5 38 45 33 C48.5 34.2 50 39 50 44 Z" />
        <path d="M50 44 C54 42 56.5 38 55 33 C51.5 34.2 50 39 50 44 Z" />
      </g>
    </svg>
  );
}
