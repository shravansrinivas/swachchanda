import { useLanguage } from '../lib/language'

/**
 * What the deck shows when nothing can load: a cassette with its tape chewed
 * out and spilling loose.
 *
 * It stands in for the cassette rather than appearing beside it, so the failure
 * reads as the same object in a different state rather than as an error bolted
 * onto a working player. Same shell, same screws, same reels; the tape has just
 * come out.
 */
export function TapeJam({
  title,
  body,
  onRetry,
  retryLabel,
}: {
  title: string
  body: string
  onRetry?: () => void
  retryLabel?: string
}) {
  const { kn } = useLanguage()

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="grain relative overflow-hidden rounded-lg border border-dust/25 bg-deck px-3 pt-3 pb-4 shadow-[0_20px_50px_-22px_rgb(0_0_0/0.95)]">
        {[
          'left-1.5 top-1.5',
          'right-1.5 top-1.5',
          'left-1.5 bottom-1.5',
          'right-1.5 bottom-1.5',
        ].map((position) => (
          <span
            key={position}
            aria-hidden="true"
            className={`absolute ${position} h-1.5 w-1.5 rounded-full bg-tape/80 ring-1 ring-dust/20`}
          />
        ))}

        <svg
          viewBox="0 0 300 150"
          className="mx-auto block w-full max-w-[260px]"
          role="img"
          aria-label={title}
        >
          {/* Shell */}
          <rect
            x="30"
            y="14"
            width="240"
            height="92"
            rx="7"
            className="fill-tape/80 stroke-dust/30"
            strokeWidth="1.5"
          />
          {/* Label strip */}
          <rect x="42" y="24" width="216" height="26" rx="2" className="fill-label/25" />

          {/* Reel windows, one wound, one empty because the tape came out. */}
          <circle cx="98" cy="76" r="19" className="fill-tape stroke-dust/25" strokeWidth="1.2" />
          <circle cx="202" cy="76" r="19" className="fill-tape stroke-dust/25" strokeWidth="1.2" />
          <circle cx="98" cy="76" r="13" className="fill-dust/45" />
          <circle cx="98" cy="76" r="5" className="fill-dial/70" />
          <circle cx="202" cy="76" r="5" className="fill-dial/40" />

          {/* The tape itself, pulled out of the shell and gone slack. */}
          <path
            d="M202 95 C 206 128, 246 118, 236 138 C 228 152, 196 140, 172 132
               C 140 121, 108 148, 82 132 C 62 120, 74 104, 96 100"
            fill="none"
            className="stroke-dust/70"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M186 104 C 168 124, 140 112, 122 126"
            fill="none"
            className="stroke-dust/35"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <p
          className={`mt-3 text-center text-[1.05rem] text-label ${kn ? 'kn-display' : 'font-display font-medium'}`}
        >
          {title}
        </p>
        <p
          className={`mx-auto mt-1.5 max-w-[34ch] text-center text-sm leading-relaxed text-dust ${kn ? 'kn' : ''}`}
        >
          {body}
        </p>

        {onRetry && retryLabel && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onRetry}
              className={`rounded-full border border-dial/50 px-4 py-2 text-sm text-dial transition-colors hover:bg-dial hover:text-tape ${kn ? 'kn' : 'font-display'}`}
            >
              {retryLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
