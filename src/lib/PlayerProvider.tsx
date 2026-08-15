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
   * changing a filter cannot be silently undone by a stale hand-built list.
   *
   * They deliberately survive a filter change. Arranging a queue is work, and
   * having it thrown away for picking a different mood was the single most
   * annoying thing the deck did. The overlay shape is what makes that safe:
   * `manualOrder` ranks whatever is present and appends the rest, so a song the
   * new mood brings in is never swallowed.
   *
   * `removed` surviving does mean a song you dropped stays dropped even after
   * you pick a mood it belongs to, so the list can be quietly shorter than the
   * filter claims. That is the accepted cost, and `resetQueue` is offered the
   * whole time there is anything to undo.
   */
  const [removed, setRemoved] = useState<string[]>([])
  const [manualOrder, setManualOrder] = useState<string[] | null>(null)

  const playOrder = useMemo(() => {
    const ordered = sortQueue(activeQueue, sort)
    const base = shuffleOn ? seededShuffle(ordered, seed) : ordered
    const kept = removed.length ? base.filter((item) => !removed.includes(item.key)) : base

    // A hand order is not applied while shuffling. Ranking the songs it names
    // would put them back in that exact sequence and leave shuffle doing
    // nothing, which is why the queue hides its reorder controls under shuffle.
    // The arrangement is kept, not discarded: turn shuffle off and it returns.
    if (!manualOrder || shuffleOn) return kept

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

  /**
   * Set when the filter change was itself a request to hear something, so the
   * effect below can act on the *new* order rather than the stale one. A ref
   * rather than state: it is read once by the effect that the same change
   * schedules, and must not cause a render of its own.
   */
  const playOnNextFilters = useRef(false)

  const setFilters = useCallback((next: Filters, andPlay = false) => {
    playOnNextFilters.current = andPlay
    setFiltersState(next)
    // Hand edits are not touched here. They used to be cleared on the argument
    // that a different set of songs deserves a clean queue, which sounded right
    // and meant that dragging a queue into shape and then picking a mood threw
    // the arrangement away. `resetQueue` is the way back, and it is offered
    // whenever there is anything to reset.
    //
    // The shuffle order is still regenerated: re-filtering without it replays
    // the same sequence over a smaller list, which reads as broken shuffle.
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
        if (!item.song.unplayable) {
          play(item)
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
      const playable = order.filter((item) => !item.song.unplayable)
      if (!playable.length) return null
      return playable[sessionStart(startKey, playable.length)]
    },
    [startKey],
  )

  const playFirstOf = useCallback(
    (order: typeof queue) => {
      const first = firstOf(order)
      if (first) play(first)
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
    if (first) cue(first)
  }, [cue, firstOf, hasCue])

  /**
   * What a change of filters does to the deck, which depends entirely on where
   * the change came from.
   *
   * Called with `andPlay` (the front page, Ekantha) the mood *is* the request:
   * there is no other control on those screens, so the new set starts. Called
   * without it (the song list, the filter sheet) it is a filter over a view
   * being read, and it only cues: the song list used to jump you off whatever
   * you were listening to the moment you touched a chip.
   *
   * Cueing while something plays is deliberately skipped. `cue()` moves the
   * label without loading anything, so cueing over a running song would leave
   * the deck naming one song while a different one came out of the speaker.
   *
   * Every other state cues, including `loading`. Guarding that one too looked
   * safer and was worse: the boot autoplay attempt holds `loading` for up to
   * six seconds, so a mood tapped in the first moments after arriving left the
   * deck showing a song from the set you had just moved away from. `cue()`
   * pauses the player, which covers the case that guard was for.
   */
  const lastFiltersRef = useRef(filters)
  useEffect(() => {
    if (lastFiltersRef.current === filters) return
    lastFiltersRef.current = filters

    const andPlay = playOnNextFilters.current
    playOnNextFilters.current = false

    const first = firstOf(playOrder)
    if (!first) return

    if (andPlay) {
      // `play()` toggles when handed the song it is already playing, so a mood
      // whose set opens on the current song would pause it. Nothing to do:
      // that song is what was asked for and it is already sounding.
      if (nowPlaying?.key === first.key && status === 'playing') return
      play(first)
      return
    }

    if (status === 'playing') return
    cue(first)
  }, [filters, playOrder, status, nowPlaying, play, cue, firstOf])

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
    play(nowPlaying)
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
