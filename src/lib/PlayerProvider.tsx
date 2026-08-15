import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { queue } from '../data/artists'
import {
  DEFAULT_SORT,
  emptyFilters,
  matchesFilters,
  PlayerContext,
  sortQueue,
  type Filters,
  type Sort,
} from './player'
import { sessionStart } from './session'
import { seededShuffle } from './shuffle'
import { useYouTubePlayer } from './useYouTubePlayer'

/**
 * Player state lives above the router so audio survives navigation, moving
 * from /artists to /credits must not stop the song. The hidden YouTube iframe
 * is created once, here, and never unmounted while the app is alive.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useYouTubePlayer()
  const { nowPlaying, play, cue, hasCue, endedCount, status } = player

  const [filters, setFiltersState] = useState<Filters>(emptyFilters)
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT)
  const [shuffleOn, setShuffleOn] = useState(false)
  /** Bumped to force a fresh order, see lib/shuffle.ts for why it's seeded. */
  const [seed, setSeed] = useState(1)

  const activeQueue = useMemo(() => queue.filter((item) => matchesFilters(item, filters)), [filters])

  /**
   * Hand edits layered over the derived order.
   *
   * The queue stays *derived* from the filters, the sort and the shuffle; these
   * two are an overlay on top of it rather than a replacement for it. That way
   * changing a filter cannot be silently undone by a stale hand-built list, and
   * the edits can be dropped in one move.
   */
  const [removed, setRemoved] = useState<string[]>([])
  const [manualOrder, setManualOrder] = useState<string[] | null>(null)

  const playOrder = useMemo(() => {
    const ordered = sortQueue(activeQueue, sort)
    const base = shuffleOn ? seededShuffle(ordered, seed) : ordered
    const kept = removed.length ? base.filter((item) => !removed.includes(item.key)) : base

    if (!manualOrder) return kept

    // Respect the hand order for anything still present, then append whatever
    // the filters have since let back in, so a new song is never swallowed.
    const rank = new Map(manualOrder.map((key, i) => [key, i]))
    return [...kept].sort((a, b) => {
      const ra = rank.get(a.key) ?? Number.MAX_SAFE_INTEGER
      const rb = rank.get(b.key) ?? Number.MAX_SAFE_INTEGER
      return ra - rb
    })
  }, [shuffleOn, activeQueue, seed, sort, removed, manualOrder])

  const removeFromQueue = useCallback((key: string) => {
    setRemoved((current) => (current.includes(key) ? current : [...current, key]))
  }, [])

  const moveInQueue = useCallback(
    (key: string, delta: -1 | 1) => {
      const keys = playOrder.map((item) => item.key)
      const from = keys.indexOf(key)
      const to = from + delta
      if (from === -1 || to < 0 || to >= keys.length) return
      ;[keys[from], keys[to]] = [keys[to], keys[from]]
      setManualOrder(keys)
    },
    [playOrder],
  )

  const reorderQueue = useCallback((keys: string[]) => setManualOrder(keys), [])

  const resetQueue = useCallback(() => {
    setRemoved([])
    setManualOrder(null)
  }, [])

  const setFilters = useCallback((next: Filters) => {
    setFiltersState(next)
    // A different set of songs deserves a clean queue; carrying removals across
    // a filter change would hide songs the reader just asked to see.
    setRemoved([])
    setManualOrder(null)
    // A new filter set deserves a new shuffle, otherwise re-filtering replays
    // the same order over a smaller list.
    setSeed((s) => s + 1)
  }, [])

  const clearFilters = useCallback(() => setFilters(emptyFilters), [setFilters])

  const toggleShuffle = useCallback(() => {
    setShuffleOn((on) => !on)
    setSeed((s) => s + 1)
  }, [])

  const step = useCallback(
    (delta: number) => {
      const order = playOrder.length ? playOrder : queue
      if (!order.length) return

      const current = nowPlaying ? order.findIndex((item) => item.key === nowPlaying.key) : -1
      // If the current song isn't in the active set (filters changed under it),
      // step from the start rather than jumping somewhere arbitrary.
      const from = current === -1 ? (delta > 0 ? -1 : 0) : current

      // Walk past anything that won't embed. Bounded by the queue length so a
      // roster of entirely unplayable tracks can't spin here forever.
      for (let hop = 1; hop <= order.length; hop++) {
        const at = (((from + delta * hop) % order.length) + order.length) % order.length
        const item = order[at]
        if (!item.track.unplayable) {
          play(item.artist, item.track)
          return
        }
      }
    },
    [playOrder, nowPlaying, play],
  )

  const next = useCallback(() => step(1), [step])
  const previous = useCallback(() => step(-1), [step])

  /**
   * Where the current set starts. Random per session rather than always the
   * top of the roster, but fixed for as long as the page is open, so leaving a
   * page and coming back does not hand you a different song.
   */
  const startKey = `${filters.moods.join(',')}|${filters.genres.join(',')}|${filters.familyOnly}`

  const firstOf = useCallback(
    (order: typeof queue) => {
      const playable = order.filter((item) => !item.track.unplayable)
      if (!playable.length) return null
      return playable[sessionStart(startKey, playable.length)]
    },
    [startKey],
  )

  const playFirstOf = useCallback(
    (order: typeof queue) => {
      const first = firstOf(order)
      if (first) play(first.artist, first.track)
    },
    [firstOf, play],
  )

  const playFiltered = useCallback(() => playFirstOf(playOrder), [playOrder, playFirstOf])

  const startFromTop = useCallback(
    () => playFirstOf(playOrder.length ? playOrder : queue),
    [playOrder, playFirstOf],
  )

  // Put the opening song on the deck straight away, so the player reads as a
  // loaded tape rather than an empty one.
  const booted = useRef(false)
  useEffect(() => {
    if (booted.current) return
    booted.current = true
    // Only fill an empty deck. `cue` replaces unconditionally so that changing
    // the mood can swap the suggestion, and child effects run before parent
    // ones, so a page that starts its own song on mount (Ekantha does) would
    // otherwise have it overwritten here. `hasCue()` is a ref, so it is already
    // true by the time this runs; `nowPlaying` would still read null.
    if (hasCue()) return
    const first = firstOf(queue)
    if (first) cue(first.artist, first.track)
  }, [cue, firstOf, hasCue])

  // Changing the mood changes what is on the deck. Picking "late night" and
  // being left holding the previous suggestion makes the choice feel inert, so
  // the top of the new set is loaded straight away: played if something was
  // already playing, cued if not.
  const lastFiltersRef = useRef(filters)
  useEffect(() => {
    if (lastFiltersRef.current === filters) return
    lastFiltersRef.current = filters

    const first = firstOf(playOrder)
    if (!first) return
    if (status === 'playing') play(first.artist, first.track)
    else cue(first.artist, first.track)
  }, [filters, playOrder, status, play, cue, firstOf])

  /**
   * One attempt at starting the tape, per page load.
   *
   * This lived in HomePage and fired on every mount, so navigating back to the
   * front page called `play()` on the song already playing, which that function
   * treats as a re-tap and therefore *pauses*. Owning it here means it happens
   * exactly once, whatever the reader browses.
   *
   * Browsers block unmuted autoplay without a gesture, so it stays an attempt;
   * the play control is the guarantee.
   */
  const autoAttempted = useRef(false)
  useEffect(() => {
    if (autoAttempted.current || !nowPlaying || status !== 'idle') return
    autoAttempted.current = true
    play(nowPlaying.artist, nowPlaying.track)
  }, [nowPlaying, status, play])

  // Roll on to the next song when one finishes. Guarded by a ref so the effect
  // can't re-fire for an end it already handled.
  const handledEndRef = useRef(endedCount)
  useEffect(() => {
    if (endedCount === handledEndRef.current) return
    handledEndRef.current = endedCount
    next()
  }, [endedCount, next])

  return (
    <PlayerContext.Provider
      value={{
        ...player,
        activeQueue,
        playOrder,
        index: nowPlaying ? playOrder.findIndex((item) => item.key === nowPlaying.key) : -1,
        filters,
        setFilters,
        sort,
        setSort,
        removeFromQueue,
        moveInQueue,
        reorderQueue,
        resetQueue,
        queueEdited: removed.length > 0 || manualOrder !== null,
        clearFilters,
        shuffleOn,
        toggleShuffle,
        next,
        previous,
        playFiltered,
        startFromTop,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
