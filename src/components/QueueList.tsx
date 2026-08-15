import { useEffect, useRef, useState } from 'react'
import { trackTitle } from '../data/artists'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'
import { BiText } from './Bilingual'

/**
 * The queue, drawn as a stack of cassette spines.
 *
 * Each row is the edge of a tape as it would look filed in a case: an inked
 * spine down the left, a paper label with the handwriting on it, reel holes at
 * the end. The one playing has its reels lit.
 *
 * Shows the *whole* order rather than only what is ahead, so the songs already
 * played stay visible and reachable; the current one is highlighted and scrolled
 * to. Skipping back to something you just heard is a normal thing to want.
 *
 * Reordering works two ways. Dragging the grip handle is the direct one, and it
 * is deliberately bound to the handle rather than the whole row: the list sits
 * in a scrolling column inside a scrolling sheet, and a whole-row drag would
 * fight both. The arrow buttons remain because drag is unusable from a keyboard
 * and awkward with assistive tech.
 */
export function QueueList() {
  const { t, kn } = useLanguage()
  const {
    playOrder,
    nowPlaying,
    status,
    play,
    removeFromQueue,
    moveInQueue,
    reorderQueue,
    resetQueue,
    queueEdited,
  } = usePlayer()

  const listRef = useRef<HTMLUListElement>(null)
  const [dragKey, setDragKey] = useState<string | null>(null)
  /** Live preview order while a drag is in flight. */
  const [preview, setPreview] = useState<string[] | null>(null)

  // Keep the playing row in view as the queue advances, but never yank the list
  // while the reader is dragging in it.
  //
  // Sets scrollTop by hand rather than calling scrollIntoView: that scrolls
  // *every* scrollable ancestor, so opening the deck would drag the whole sheet
  // to wherever the current row happened to be, putting the tape and its
  // transport off screen.
  useEffect(() => {
    if (dragKey) return
    const list = listRef.current
    const row = list?.querySelector<HTMLElement>('[data-current="true"]')
    if (!list || !row) return

    const rowTop = row.offsetTop - list.offsetTop
    const rowBottom = rowTop + row.offsetHeight
    if (rowTop < list.scrollTop) list.scrollTop = rowTop
    else if (rowBottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = rowBottom - list.clientHeight
    }
  }, [nowPlaying?.key, dragKey])

  if (playOrder.length === 0) return null

  const keys = preview ?? playOrder.map((item) => item.key)
  const byKey = new Map(playOrder.map((item) => [item.key, item]))
  const rows = keys.map((key) => byKey.get(key)).filter((item) => item !== undefined)

  const onHandleDown = (key: string) => (event: React.PointerEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setDragKey(key)

    let order = playOrder.map((item) => item.key)

    const move = (moveEvent: PointerEvent) => {
      const list = listRef.current
      if (!list) return
      // Work out which row the pointer is over by comparing against each row's
      // midpoint, rather than tracking offsets, so it stays correct when the
      // list scrolls mid-drag.
      const items = [...list.querySelectorAll<HTMLElement>('[data-key]')]
      const target = items.findIndex((el) => {
        const box = el.getBoundingClientRect()
        return moveEvent.clientY < box.top + box.height / 2
      })
      const to = target === -1 ? items.length - 1 : target
      const at = order.indexOf(key)
      if (to === at || to < 0) return
      const next = [...order]
      next.splice(at, 1)
      next.splice(to, 0, key)
      order = next
      setPreview(next)
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      setDragKey(null)
      setPreview(null)
      reorderQueue(order)
    }

    // Bound to the window, not the handle, and without pointer capture: the
    // live preview reorders the list, so React moves the handle's own DOM node
    // mid-drag, which drops any capture set on it and kills the gesture.
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex shrink-0 items-baseline justify-between gap-2">
        <p className={`stamp text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>{t.queueHeading}</p>
        {queueEdited && (
          <button
            type="button"
            onClick={resetQueue}
            className={`font-mono text-[10px] text-dust underline underline-offset-2 transition-colors hover:text-dial ${kn ? 'kn' : ''}`}
          >
            {t.queueReset}
          </button>
        )}
      </div>

      <ul ref={listRef} className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {rows.map((item, i) => {
          const active = nowPlaying?.key === item.key
          const playing = active && status === 'playing'
          const dragging = dragKey === item.key
          const played = !active && nowPlaying ? i < rows.findIndex((r) => r.key === nowPlaying.key) : false

          return (
            <li
              key={item.key}
              data-key={item.key}
              data-current={active || undefined}
              className={`flex items-stretch overflow-hidden rounded-[3px] border transition-colors ${
                active ? 'border-dial/50 bg-deck' : 'border-dust/15 bg-deck/60'
              } ${dragging ? 'opacity-60 ring-1 ring-dial/60' : ''} ${played ? 'opacity-65' : ''}`}
            >
              <span
                aria-hidden="true"
                className={`w-[3px] shrink-0 ${active ? 'bg-dial' : 'bg-dust/25'}`}
              />

              {/* Grip. Owns the drag so the list can still be scrolled. */}
              <span
                onPointerDown={onHandleDown(item.key)}
                role="button"
                tabIndex={-1}
                aria-label={t.queueDrag}
                title={t.queueDrag}
                className="flex w-5 shrink-0 cursor-grab touch-none items-center justify-center text-dust/60 transition-colors hover:text-dial active:cursor-grabbing"
              >
                <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
                  {[2, 7, 12].map((y) => (
                    <g key={y}>
                      <circle cx="2.5" cy={y} r="1.1" fill="currentColor" />
                      <circle cx="7.5" cy={y} r="1.1" fill="currentColor" />
                    </g>
                  ))}
                </svg>
              </span>

              <button
                type="button"
                onClick={() => play(item.artist, item.track)}
                aria-current={active || undefined}
                disabled={item.track.unplayable}
                className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pl-1 text-left disabled:opacity-40"
              >
                <span className="stamp w-4 shrink-0 text-dust/75">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1 rounded-[2px] bg-label/90 px-2 py-1">
                  <BiText
                    value={trackTitle(item.track)}
                    className="hand text-[1rem] font-bold"
                    secondaryClassName="text-tape/70"
                  />
                  <BiText
                    value={item.artist.name}
                    className="hand text-[0.78rem]"
                    secondaryClassName="text-tape/65"
                  />
                </span>

                <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
                  <span
                    className={`block h-2 w-2 rounded-full ${active ? 'bg-dial' : 'bg-dust/30'} ${
                      playing ? 'reel-spinning' : ''
                    }`}
                  />
                  <span
                    className={`block h-2 w-2 rounded-full ${active ? 'bg-dial/60' : 'bg-dust/20'}`}
                  />
                </span>
              </button>

              <span className="flex shrink-0 flex-col justify-center gap-px pr-1">
                <QueueAction
                  label={t.queueUp}
                  onClick={() => moveInQueue(item.key, -1)}
                  disabled={i === 0}
                >
                  <path d="M6 15l6-6 6 6" />
                </QueueAction>
                <QueueAction
                  label={t.queueDown}
                  onClick={() => moveInQueue(item.key, 1)}
                  disabled={i === rows.length - 1}
                >
                  <path d="M6 9l6 6 6-6" />
                </QueueAction>
                <QueueAction label={t.queueRemove} onClick={() => removeFromQueue(item.key)}>
                  <path d="M6 6l12 12M18 6L6 18" />
                </QueueAction>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function QueueAction({
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
      className="grid h-5 w-5 place-items-center rounded text-dust/75 transition-colors hover:text-dial disabled:opacity-25 disabled:hover:text-dust/75"
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  )
}
