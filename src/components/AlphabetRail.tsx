import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../lib/language'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * The A to Z rail down the right edge, the way a long list on a phone has
 * offered one for fifteen years.
 *
 * It is a *shortcut*, never the only way through: everything it reaches is
 * reachable by scrolling, and the list works identically with the rail hidden.
 * That is what lets it be as small as it is.
 *
 * Two gestures, because the familiar control has two. Tapping a letter jumps to
 * it. Dragging down the rail scrubs, moving the list continuously under your
 * thumb, with the letter shown in a bubble beside it since a thumb covers the
 * rail it is dragging. The scrub scrolls instantly rather than smoothly: at
 * smooth, the list is still easing towards D while the thumb is at K.
 *
 * Letters with nothing behind them are dimmed and skipped rather than removed,
 * so the alphabet keeps its shape and a letter never moves under your thumb
 * mid-drag.
 *
 * It stays out of the way until the page is scrolled. Fixed to the viewport and
 * always on, it sat over the search box, the mood chips and the count, which is
 * the part of the page that is *not* the list. Waiting until the list is what
 * you are looking at costs nothing: at the top of the page the first row is
 * already on screen and there is nothing to jump to yet.
 *
 * The letters are sized against the viewport height rather than set to a fixed
 * size, because the rail has to hold all twenty-six whatever the window is:
 * clamped, twenty-six lines come to roughly 60svh, so it fills the space it has
 * on a short phone and grows into something a mouse can actually hit on a
 * desktop. A fixed 9px was legible on a phone at arm's length and a nuisance
 * with a pointer.
 */
const SHOW_AFTER_PX = 120
export function AlphabetRail({
  available,
  onPick,
}: {
  /** Letters that have at least one row. Others render dimmed and inert. */
  available: Set<string>
  onPick: (letter: string, smooth: boolean) => void
}) {
  const { t, kn } = useLanguage()
  const railRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** Which letter is under this point, by geometry rather than by hit target. */
  const letterAt = (clientY: number): string | null => {
    const rail = railRef.current
    if (!rail) return null
    const box = rail.getBoundingClientRect()
    const ratio = (clientY - box.top) / box.height
    const index = Math.floor(ratio * LETTERS.length)
    return LETTERS[Math.min(LETTERS.length - 1, Math.max(0, index))] ?? null
  }

  const scrub = (clientY: number, smooth: boolean) => {
    const letter = letterAt(clientY)
    if (!letter || !available.has(letter)) return
    setActive(letter)
    onPick(letter, smooth)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    event.preventDefault()
    setDragging(true)
    scrub(event.clientY, false)

    const move = (e: PointerEvent) => scrub(e.clientY, false)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      setDragging(false)
      setActive(null)
    }
    // On the window, as with the queue's drag handle: the rail is narrow and a
    // thumb wanders off it constantly, and a gesture that dies the moment it
    // leaves an 18px column is not a scrubber.
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  return (
    <>
      {/* The letter under the thumb, shown clear of the rail because the thumb
          is on top of the rail. */}
      {dragging && active && shown && (
        <span
          aria-hidden="true"
          className="pointer-events-none fixed top-1/2 right-12 z-50 grid h-16 w-16 -translate-y-1/2 place-items-center rounded-full border border-dial/40 bg-tape/95 font-display text-3xl text-dial backdrop-blur-md sm:right-20 sm:h-20 sm:w-20 sm:text-4xl"
        >
          {active}
        </span>
      )}

      <nav
        aria-label={t.alphabetLabel}
        ref={railRef}
        onPointerDown={onPointerDown}
        aria-hidden={!shown}
        className={`fixed top-1/2 right-0 z-40 flex -translate-y-1/2 touch-none flex-col justify-center py-2 pr-1 pl-1.5 transition-opacity duration-200 select-none sm:pr-2 sm:pl-3 ${
          shown ? 'opacity-100' : 'pointer-events-none opacity-0'
        } ${dragging ? 'bg-tape/70 backdrop-blur-sm' : ''}`}
      >
        {LETTERS.map((letter) => {
          const has = available.has(letter)
          return (
            <button
              key={letter}
              type="button"
              // Not a tab stop while hidden: twenty-six of these in the way of
              // the keyboard, for a control nobody can see, is worse than none.
              disabled={!has || !shown}
              tabIndex={shown ? undefined : -1}
              // The pointer gesture above owns dragging; this is the keyboard
              // and assistive-tech path, and the plain tap.
              onClick={() => onPick(letter, true)}
              aria-label={t.jumpToLetter(letter)}
              className={`w-6 rounded-sm text-center font-mono text-[clamp(11px,1.6svh,15px)] leading-[1.5] transition-colors sm:w-8 ${
                has ? 'text-dust hover:bg-dial/15 hover:text-dial' : 'text-dust/25'
              } ${active === letter ? 'bg-dial/20 text-dial' : ''} ${kn ? 'kn' : ''}`}
            >
              {letter}
            </button>
          )
        })}
      </nav>
    </>
  )
}
