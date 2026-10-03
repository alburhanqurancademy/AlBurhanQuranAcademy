type Fade = "none" | "bottom" | "top" | "both";

type Props = {
  /** Tile size in px — smaller = denser lattice. */
  size?: number;
  /** Line opacity. Keep it low so the pattern stays a texture, not a subject. */
  opacity?: number;
  /** Line colour. White by default so it reads on any dark/green surface. */
  color?: string;
  /** Stroke thickness of the lattice lines. */
  strokeWidth?: number;
  /** Where the lattice itself dissolves. */
  fade?: Fade;
  /**
   * Settles the whole section — pattern, glows and all — into this colour at
   * the bottom, so the next section starts flat. `null` skips the band.
   */
  blendTo?: string | null;
  /** Height of that band, as a Tailwind height class. */
  blendHeight?: string;
  /** Extra classes on the pattern layer — use for insets, z-index or blend modes. */
  className?: string;
};

// Star centred at (0,0): outer points at r=28.28, inner at r=21.65.
const STAR =
  "M28.28 0 L20 8.28 L20 20 L8.28 20 L0 28.28 L-8.28 20 L-20 20 L-20 8.28 " +
  "L-28.28 0 L-20 -8.28 L-20 -20 L-8.28 -20 L0 -28.28 L8.28 -20 L20 -20 L20 -8.28 Z";

// Masks that taper the lattice off to nothing, so it meets the next section's
// flat background without a visible edge where the pattern stops.
const FADES: Record<Fade, string | undefined> = {
  none: undefined,
  bottom: "linear-gradient(to bottom, #000 0%, #000 45%, rgba(0,0,0,0) 100%)",
  top: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 55%, #000 100%)",
  both: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 35%, #000 65%, rgba(0,0,0,0) 100%)",
};

/**
 * Shared Islamic geometric line overlay (8-pointed khatam lattice).
 * Absolutely positioned — drop it inside any `relative overflow-hidden`
 * section, after the background glows and before the content:
 *   <section className="relative overflow-hidden">
 *     ...glows...
 *     <IslamicPatternOverlay />
 *     <div className="relative z-10">...content...</div>
 *   </section>
 */
export default function IslamicPatternOverlay({
  size = 80,
  opacity = 0.12,
  color = "#ffffff",
  strokeWidth = 1,
  fade = "bottom",
  blendTo = "var(--color-black)",
  blendHeight = "h-40",
  className = "",
}: Props) {
  // Deterministic id: identical settings share one <pattern>, different ones don't collide.
  const patternId = `islamic-pattern-${size}-${strokeWidth}-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  const mask = FADES[fade];

  return (
    <>
      <svg
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        style={{ opacity, maskImage: mask, WebkitMaskImage: mask }}
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

      {blendTo && (
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 ${blendHeight} pointer-events-none ${className}`}
          style={{ background: `linear-gradient(to bottom, transparent, ${blendTo})` }}
        />
      )}
    </>
  );
}
