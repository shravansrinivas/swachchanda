import type { Bilingual } from '../data/artists'

/**
 * The cassette.
 *
 * Capped and centred rather than filling whatever space it is given: stretched
 * across a desktop it stopped reading as an object and became a flat bar with
 * two dots on it.
 *
 * The artwork sits *behind* the label, held well back, plus a small stuck-on
 * corner print. A full-size thumbnail on the paper made the label look like a
 * media player row rather than something written on. The song and the artist
 * are handwritten over it in both scripts, off-level and in pen-blue ink, since
 * a real label is never quite straight and never quite the colour of print.
 */

const HUB = 7
const MIN_WOUND = 8.5
const MAX_WOUND = 19

export function CassetteReel({
  /** 0 to 1: how much tape is wound onto this reel. */
  wound,
  playing,
  /** Waiting for the song to load. Turns slowly rather than sitting dead. */
  threading = false,
  size = 44,
}: {
  wound: number
  playing: boolean
  threading?: boolean
  size?: number
}) {
  const radius = MIN_WOUND + Math.min(1, Math.max(0, wound)) * (MAX_WOUND - MIN_WOUND)
  const spokes = [0, 60, 120, 180, 240, 300]

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {/* Wound tape. Grows and shrinks, does not rotate. Needs real contrast
          against the dark window or it stops reading as tape at all. */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        className="fill-dust/60 transition-[r] duration-500 ease-linear"
      />
      <circle
        cx="24"
        cy="24"
        r={radius}
        className="stroke-label/25 transition-[r] duration-500 ease-linear"
        strokeWidth="0.9"
        fill="none"
      />

      {/* Hub and spokes. These are what turns. */}
      <g
        className={`spin-center ${
          playing ? 'reel-spinning' : threading ? 'reel-threading' : 'reel-stopped'
        }`}
      >
        <circle cx="24" cy="24" r={HUB} className="fill-tape" />
        {spokes.map((angle) => (
          <line
            key={angle}
            x1="24"
            y1="24"
            x2="24"
            y2="14.5"
            className="stroke-dial"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${angle} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="3.2" className="fill-dial" />
      </g>
    </svg>
  )
}

export function CassetteBody({
  progress,
  playing,
  threading = false,
  side,
  title,
  artist,
  coverId,
}: {
  progress: number
  playing: boolean
  /** Loading. The reels turn slowly and the counter runs a lit patch. */
  threading?: boolean
  side: string
  /** Song title in both scripts. */
  title: Bilingual
  /** Artist or band name in both scripts. */
  artist: Bilingual
  coverId?: string
}) {
  const bothTitle = title.kn && title.kn !== title.en
  const bothArtist = artist.kn && artist.kn !== artist.en

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="grain relative overflow-hidden rounded-lg border border-dust/25 bg-deck px-3 pt-3 pb-3.5 shadow-[0_20px_50px_-22px_rgb(0_0_0/0.95)]">
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

        {/* Paper label. */}
        <div className="relative mx-2 overflow-hidden rounded-[3px] bg-label text-tape">
          {coverId && (
            <>
              {/* Artwork as the paper's own tint, well behind the writing. */}
              <img
                src={`https://i.ytimg.com/vi/${coverId}/mqdefault.jpg`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-[1.5px]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-label/70" />
            </>
          )}

          {/* Print and writing on one baseline, rather than the print floating
              in a corner of its own. */}
          <div className="relative flex items-center gap-3 px-3.5 py-3">
            {coverId && (
              <span className="shrink-0 -rotate-2 rounded-[2px] bg-white p-[3px] shadow-[0_3px_8px_-2px_rgb(0_0_0/0.45)]">
                <img
                  src={`https://i.ytimg.com/vi/${coverId}/mqdefault.jpg`}
                  alt=""
                  aria-hidden="true"
                  className="block h-11 w-11 rounded-[1px] object-cover"
                />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="stamp text-[9px] text-tape/65">{side}</p>

              {/* Both scripts on one line: stacked, four handwritten lines read
                  as a paragraph rather than as a label. */}
              <p className="hand hand-tilt mt-0.5 flex min-w-0 items-baseline gap-1.5 text-[1.35rem] font-bold">
                <span className="truncate">{title.en}</span>
                {bothTitle && (
                  <>
                    <span aria-hidden="true" className="shrink-0 opacity-40">
                      ·
                    </span>
                    <span className="kn truncate text-[1.05rem]">{title.kn}</span>
                  </>
                )}
              </p>

              <p className="hand hand-second mt-0.5 flex min-w-0 items-baseline gap-1.5 text-[0.95rem]">
                <span className="truncate">{artist.en}</span>
                {bothArtist && (
                  <>
                    <span aria-hidden="true" className="shrink-0 opacity-40">
                      ·
                    </span>
                    <span className="kn truncate text-[0.85rem]">{artist.kn}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Reel window. */}
        <div className="mx-2 mt-2.5 flex items-center justify-between rounded-[3px] border border-dust/20 bg-tape/85 px-6 py-3">
          <CassetteReel wound={1 - progress} playing={playing} threading={threading} size={52} />

          <div
            aria-hidden="true"
            className="mx-3 h-[3px] flex-1 overflow-hidden rounded-full bg-dust/20"
          >
            {threading ? (
              <div className="tape-threading h-full w-1/3 rounded-full bg-dial/80" />
            ) : (
              <div
                className="h-full rounded-full bg-dial transition-[width] duration-500 ease-linear"
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              />
            )}
          </div>

          <CassetteReel wound={progress} playing={playing} threading={threading} size={52} />
        </div>
      </div>
    </div>
  )
}
