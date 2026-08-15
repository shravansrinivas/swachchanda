import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { queue, songTitle, type Bilingual } from '../data/artists'
import {
  canFullscreen,
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
} from '../lib/fullscreen'
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
  const song = nowPlaying?.song
  const artist = nowPlaying?.artist
  const title: Bilingual = song ? songTitle(song) : { en: t.idleLabel, kn: t.idleLabel }
  const artistName: Bilingual = nowPlaying?.billing ?? { en: t.idleHint, kn: t.idleHint }

  // Arriving in a silent room defeats the point. If nothing is playing, start
  // something, preferring the songs tagged for sitting still with. Navigating
  // here is itself a gesture, so the browser will normally allow it.
  const started = useRef(false)
  useEffect(() => {
    if (started.current || status === 'playing') return
    started.current = true

    const candidates = queue.filter((item) => !item.song.unplayable)
    const focused = candidates.filter((item) => item.song.moods.includes('focus'))
    const pool = focused.length ? focused : candidates
    if (!pool.length) return

    const pick = pool[sessionStart('ekantha', pool.length)]
    play(pick)
  }, [status, play])

  /**
   * Fullscreen, tracked rather than assumed.
   *
   * The reader can leave fullscreen by ways this component never hears about,
   * Escape, F11, the window controls, so the button's label follows the
   * browser's own event instead of a flag we set when we asked.
   */
  const [full, setFull] = useState(isFullscreen)
  useEffect(() => {
    const sync = () => setFull(isFullscreen())
    document.addEventListener('fullscreenchange', sync)
    // Leaving the room gives the screen back. Someone who navigates away with
    // the back button should not find the browser still swallowed.
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      exitFullscreen()
    }
  }, [])

  const toggleFullscreen = () => (isFullscreen() ? exitFullscreen() : enterFullscreen())

  /**
   * Keep the keyboard pointed at this page.
   *
   * A key only reaches us while focus is inside our own document. The YouTube
   * iframe takes focus when playback starts, and once it has, Escape goes to
   * YouTube and this page never sees it: the one room whose whole promise is
   * that you can leave it becomes the one you cannot leave with the keyboard.
   *
   * The window blurs at the moment focus crosses into the iframe, which is the
   * signal to take it back. Focusing the room itself, rather than a control,
   * keeps Space free for play/pause instead of re-triggering a button.
   */
  const roomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    roomRef.current?.focus({ preventScroll: true })
    const reclaim = () => {
      const active = document.activeElement
      if (!(active instanceof HTMLIFrameElement)) return
      active.blur()
      roomRef.current?.focus({ preventScroll: true })
    }
    window.addEventListener('blur', reclaim)
    return () => window.removeEventListener('blur', reclaim)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement)?.closest('input, textarea')
      if (typing) return

      if (event.key === 'Escape') {
        // In fullscreen, Escape belongs to the browser: it gives the screen
        // back, and that is all it should do. Leaving the room as well would
        // make one key do two things and land the reader on the front page when
        // they only wanted their window back. A second press leaves.
        if (isFullscreen()) return
        event.preventDefault()
        navigate('/')
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        toggleFullscreen()
      } else if (event.key === ' ') {
        event.preventDefault()
        if (nowPlaying) toggle()
        else startFromTop()
      } else if (event.key === 'ArrowRight') seekBy(10)
      else if (event.key === 'ArrowLeft') seekBy(-10)
      else if (event.key === 'ArrowDown') next()
      else if (event.key === 'ArrowUp') previous()
    }
    // Capture phase: this listener runs before anything inside the page can
    // stop the event, so leaving never depends on what happens to have focus.
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [navigate, nowPlaying, toggle, startFromTop, seekBy, next, previous])

  return (
    <div
      ref={roomRef}
      tabIndex={-1}
      className="flex min-h-[100svh] flex-col px-5 pt-5 pb-10 outline-none"
    >
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between">
        <p className={`stamp text-dial/85 ${kn ? 'kn tracking-normal' : ''}`}>
          {t.ekanthaName} · {t.ekanthaNameAlt}
        </p>
        <div className="flex items-center gap-2">
          {/* Only where the browser will actually grant it. iOS Safari does not
              implement fullscreen on elements, and a button that does nothing
              is worse than no button. */}
          {canFullscreen() && (
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={full ? t.fullscreenExit : t.fullscreenEnter}
              title={`${full ? t.fullscreenExit : t.fullscreenEnter} (F)`}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-dust/30 text-dust transition-colors hover:border-dial hover:text-dial"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {full ? (
                  <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
                ) : (
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                )}
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 rounded-full border border-dust/30 px-3.5 py-1.5 text-sm text-dust transition-colors hover:border-dial hover:text-dial ${kn ? 'kn' : 'font-display'}`}
          >
            {t.ekanthaLeave}
            {/* Says out loud that the key works, which is worth more here than
                anywhere else on the site. */}
            <kbd className="hidden rounded border border-dust/30 px-1.5 py-0.5 font-mono text-[10px] text-dust/80 sm:inline">
              esc
            </kbd>
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center">
        <CassetteBody
          progress={progress}
          playing={playing}
          threading={status === 'loading'}
          side={t.ekanthaTagline}
          title={title}
          artist={artistName}
          coverId={song?.youtubeId}
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
            {nowPlaying?.billing[lang]}
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
