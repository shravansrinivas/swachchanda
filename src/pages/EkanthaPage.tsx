import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { queue, trackTitle, type Bilingual } from '../data/artists'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'
import { sessionStart } from '../lib/session'
import { CassetteBody } from '../components/Cassette'
import { MoodRow } from '../components/MoodRow'
import { SeekBar } from '../components/TapeStats'

/**
 * ಏಕಾಂತ, solitude. A quieter room inside the site.
 *
 * The tape, what is written on it, and the controls. No nav, no lists, no
 * counts. It is a route rather than a mode flag so it can be linked, shared and
 * left with the back button, and because player state lives above the router,
 * entering and leaving never interrupts the song.
 *
 * Leaving is deliberately offered three ways (a visible control, Escape, and
 * browser back), since a room you cannot obviously get out of is a trap.
 */
export function EkanthaPage() {
  const { t, kn, lang } = useLanguage()
  const { nowPlaying, status, progress, play, toggle, next, previous, seekBy, startFromTop } =
    usePlayer()
  const navigate = useNavigate()

  const playing = status === 'playing'
  const track = nowPlaying?.track
  const artist = nowPlaying?.artist
  const title: Bilingual = track ? trackTitle(track) : { en: t.idleLabel, kn: t.idleLabel }
  const artistName: Bilingual = artist?.name ?? { en: t.idleHint, kn: t.idleHint }

  // Arriving in a silent room defeats the point. If nothing is playing, start
  // something, preferring the songs tagged for sitting still with. Navigating
  // here is itself a gesture, so the browser will normally allow it.
  const started = useRef(false)
  useEffect(() => {
    if (started.current || status === 'playing') return
    started.current = true

    const candidates = queue.filter((item) => !item.track.unplayable)
    const focused = candidates.filter((item) => item.track.moods.includes('focus'))
    const pool = focused.length ? focused : candidates
    if (!pool.length) return

    const pick = pool[sessionStart('ekantha', pool.length)]
    play(pick.artist, pick.track)
  }, [status, play])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement)?.closest('input, textarea')
      if (typing) return

      if (event.key === 'Escape') navigate('/')
      else if (event.key === ' ') {
        event.preventDefault()
        if (nowPlaying) toggle()
        else startFromTop()
      } else if (event.key === 'ArrowRight') seekBy(10)
      else if (event.key === 'ArrowLeft') seekBy(-10)
      else if (event.key === 'ArrowDown') next()
      else if (event.key === 'ArrowUp') previous()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, nowPlaying, toggle, startFromTop, seekBy, next, previous])

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pt-5 pb-10">
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between">
        <p className={`stamp text-dial/85 ${kn ? 'kn tracking-normal' : ''}`}>
          {t.ekanthaName} · {t.ekanthaNameAlt}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`rounded-full border border-dust/30 px-3.5 py-1.5 text-sm text-dust transition-colors hover:border-dial hover:text-dial ${kn ? 'kn' : 'font-display'}`}
        >
          {t.ekanthaLeave}
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center">
        <CassetteBody
          progress={progress}
          playing={playing}
          side={t.ekanthaTagline}
          title={title}
          artist={artistName}
          coverId={track?.youtubeId}
        />

        <SeekBar />

        <div className="mt-5 flex items-center justify-center gap-2">
          <Control label={t.previous} onClick={previous} disabled={!nowPlaying}>
            <path d="M7 6v12M18 6l-8 6 8 6z" fill="currentColor" />
          </Control>
          <Control label={t.rewind} onClick={() => seekBy(-10)} disabled={!nowPlaying}>
            <path d="M12 6l-8 6 8 6zM21 6l-8 6 8 6z" fill="currentColor" />
          </Control>

          <button
            type="button"
            onClick={() => (nowPlaying ? toggle() : startFromTop())}
            aria-label={playing ? t.pause : t.play}
            title={playing ? t.pause : t.play}
            className="mx-2 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-dial/50 bg-dial/10 text-dial transition-colors hover:bg-dial hover:text-tape"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              {playing ? (
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
              ) : (
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              )}
            </svg>
          </button>

          <Control label={t.fastForward} onClick={() => seekBy(10)} disabled={!nowPlaying}>
            <path d="M12 6l8 6-8 6zM3 6l8 6-8 6z" fill="currentColor" />
          </Control>
          <Control label={t.next} onClick={next} disabled={!nowPlaying}>
            <path d="M17 6v12M6 6l8 6-8 6z" fill="currentColor" />
          </Control>
        </div>

        {artist && (
          <p className={`mt-6 text-center text-sm text-dust ${kn ? 'kn' : ''}`}>
            {artist.name[lang]}
          </p>
        )}

        <div className="mt-8">
          <MoodRow label="" />
        </div>
      </div>
    </div>
  )
}

function Control({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-dust transition-colors hover:text-dial disabled:opacity-30"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}
