type Props = {
  /** Tile size in px — smaller = denser lattice. */
  size?: number;
  /** Line opacity. Keep it low so the pattern stays a texture, not a subject. */
  opacity?: number;
  /** Line colour. White by default so it reads on any dark/green surface. */
  color?: string;
  /** Stroke thickness of the lattice lines. */
  strokeWidth?: number;
  /** Extra classes — use for masks, insets or blend modes per section. */
  className?: string;
};

// Star centred at (0,0): outer points at r=28.28, inner at r=21.65.
const STAR =
  "M28.28 0 L20 8.28 L20 20 L8.28 20 L0 28.28 L-8.28 20 L-20 20 L-20 8.28 " +
  "L-28.28 0 L-20 -8.28 L-20 -20 L-8.28 -20 L0 -28.28 L8.28 -20 L20 -20 L20 -8.28 Z";

/**
 * Shared Islamic geometric line overlay (8-pointed khatam lattice).
 * Absolutely positioned — drop it inside any `relative` section:
 *   <section className="relative overflow-hidden">
 *     <IslamicPatternOverlay />
 *     ...
 *   </section>
 */
export default function IslamicPatternOverlay({
  size = 80,
  opacity = 0.1,
  color = "#ffffff",
  strokeWidth = 0.5,
  className = "",
}: Props) {
  // Deterministic id: identical settings share one <pattern>, different ones don't collide.
  const patternId = `islamic-pattern-${size}-${strokeWidth}-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={patternId}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          viewBox="0 0 80 80"
        >
          <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
            {/* Star at the tile centre */}
            <path d={STAR} transform="translate(40 40)" />
            {/* Corner stars — clipped by the tile, they join up across repeats */}
            <path d={STAR} transform="translate(0 0)" />
            <path d={STAR} transform="translate(80 0)" />
            <path d={STAR} transform="translate(0 80)" />
            <path d={STAR} transform="translate(80 80)" />
            {/* Diamonds bridging the star tips */}
            <path d="M51.72 0 L40 11.72 L28.28 0 L40 -11.72 Z" />
            <path d="M51.72 80 L40 91.72 L28.28 80 L40 68.28 Z" />
            <path d="M11.72 40 L0 51.72 L-11.72 40 L0 28.28 Z" />
            <path d="M91.72 40 L80 51.72 L68.28 40 L80 28.28 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
