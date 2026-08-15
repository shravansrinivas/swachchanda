import { clock } from '../lib/clock'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'

/**
 * The readout on the deck, as one line rather than a grid of five labelled
 * cells. The grid was accurate and took a third of the panel to say very
 * little; the same figures fit on a single row of tabular mono.
 *
 * Every figure is real and comes from the player: elapsed and remaining from
 * the API's clock, the quality label from getPlaybackQuality(), the buffer from
 * getVideoLoadedFraction(). There is deliberately no bitrate: YouTube does not
 * expose one through the IFrame API, and printing a plausible "320 kbps" would
 * be a decoration pretending to be a measurement.
 */
export function TapeStats({ position, total }: { position: number; total: number }) {
  const { t, kn } = useLanguage()
  const { duration, buffered, quality, nowPlaying } = usePlayer()

  const known = duration > 0
  const parts = [
    quality && quality !== 'unknown' ? quality : null,
    known ? `${t.statsBuffer.toLowerCase()} ${Math.round(buffered * 100)}%` : null,
    position >= 0 && nowPlaying ? `${position + 1}/${total}` : null,
  ].filter(Boolean)

  if (!parts.length) return null

  return (
    <p
      className={`mt-2 text-center font-mono text-[11px] text-dust/85 tabular-nums ${kn ? 'kn' : ''}`}
    >
      {parts.join(' · ')}
    </p>
  )
}

/** Draggable position bar, with the buffered span shown behind the played span. */
export function SeekBar() {
  const { t } = useLanguage()
  const { currentTime, duration, buffered, seekTo, nowPlaying } = usePlayer()

  const known = duration > 0
  const pct = known ? (currentTime / duration) * 100 : 0

  return (
    <div className="mt-4">
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-dust/20">
          <div className="h-full bg-dust/30" style={{ width: `${buffered * 100}%` }} />
        </div>
        <div
          className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-dial"
          style={{ width: `${pct}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dial shadow-[0_0_0_3px_rgb(27_32_41/0.9)]"
          style={{ left: `${pct}%` }}
        />
        <input
          type="range"
          min={0}
          max={known ? Math.floor(duration) : 0}
          step={1}
          value={Math.floor(currentTime)}
          disabled={!known || !nowPlaying}
          onChange={(e) => seekTo(Number(e.target.value))}
          aria-label={t.seekLabel}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
        />
      </div>

      <div className="flex justify-between font-mono text-[11px] text-dust tabular-nums">
        <span>{clock(currentTime, Boolean(nowPlaying))}</span>
        <span>{clock(duration, known)}</span>
      </div>
    </div>
  )
}
