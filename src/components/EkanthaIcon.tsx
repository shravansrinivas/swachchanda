/**
 * Headphones, for Ekantha.
 *
 * The previous icon was the four-corner "expand" glyph, which everywhere else
 * on the web means fullscreen. Ekantha is not a fullscreen toggle, it is a
 * quieter room, and headphones say sitting down with something in a way an
 * expand arrow never will.
 */
export function EkanthaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Band over the head */}
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      {/* Earcups */}
      <path d="M4 14h2.2a1 1 0 0 1 1 1v3.6a1 1 0 0 1-1 1H5.4A1.4 1.4 0 0 1 4 18.2V14Z" fill="currentColor" stroke="none" />
      <path d="M20 14h-2.2a1 1 0 0 0-1 1v3.6a1 1 0 0 0 1 1h1.2a1.4 1.4 0 0 0 1.4-1.4V14Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
