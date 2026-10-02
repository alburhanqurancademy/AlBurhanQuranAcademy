type Props = {
  /** The resolved detail — undefined while it is still loading. */
  value?: string;
  /** Width of the placeholder bar, e.g. "w-32". Match the real text's length. */
  width?: string;
  className?: string;
};

// Renders a contact detail, or a pulsing placeholder of roughly the same size
// while it loads — so a stale fallback number is never shown in its place.
export default function ContactValue({ value, width = "w-28", className = "" }: Props) {
  if (value) return <>{value}</>;

  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[0.85em] align-[-0.05em] rounded-sm bg-white/20 animate-pulse ${width} ${className}`}
    />
  );
}
