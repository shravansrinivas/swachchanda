/**
 * The signature element. A cassette reel that turns while audio plays and
 * holds still when it doesn't. Used at 3 sizes: in the player button, beside
 * the now-playing text, and as the marker on the active track row.
 */
export function TapeReel({
  spinning,
  size = 20,
  className = '',
}: {
  spinning: boolean
  size?: number
  className?: string
}) {
  const spokes = [0, 60, 120, 180, 240, 300]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`${spinning ? 'reel-spinning' : 'reel-stopped'} ${className}`}
    >
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.25" opacity="0.5" />
      {spokes.map((angle) => (
        <line
          key={angle}
          x1="12"
          y1="12"
          x2="12"
          y2="3.5"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          transform={`rotate(${angle} 12 12)`}
          opacity="0.85"
        />
      ))}
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.15" className="fill-tape" />
    </svg>
  )
}
