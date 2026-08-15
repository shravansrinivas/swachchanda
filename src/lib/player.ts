import { createContext, useContext } from 'react'
import type { QueueItem } from '../data/artists'
import type { Genre, Mood } from '../data/taxonomy'
import type { YouTubePlayerApi } from './useYouTubePlayer'

/**
 * Context object and hook, kept apart from the provider component so fast
 * refresh keeps working (a module may export components or values, not both).
 */

export interface Filters {
  /** Empty means "any". Multiple selections are OR'd within a group. */
  genres: Genre[]
  moods: Mood[]
  /** Allowlist mode, only songs explicitly marked `childSafe`. */
  familyOnly: boolean
}

/**
 * How the tape is ordered.
 *
 * This orders the *queue*, not just the view, so what you read on /songs is
 * exactly what next and previous will walk. Alphabetical is the default: a
 * 63-song list in roster order is only navigable if you already know the
 * roster, and nobody does on their first visit.
 *
 * Comparison is on the romanised fields so the order does not shift when the
 * language picker does.
 */
export type Sort = 'roster' | 'title' | 'artist'

export const DEFAULT_SORT: Sort = 'title'

export const emptyFilters: Filters = { genres: [], moods: [], familyOnly: false }

export function sortQueue(items: QueueItem[], sort: Sort): QueueItem[] {
  if (sort === 'roster') return items
  const collator = new Intl.Collator('en', { sensitivity: 'base' })
  const key = (item: QueueItem) =>
    sort === 'title' ? item.song.title : `${item.billing.en} ${item.song.title}`
  return [...items].sort((a, b) => collator.compare(key(a), key(b)))
}

export interface PlayerValue extends YouTubePlayerApi {
  /** Roster filtered by `filters`, in roster order. */
  activeQueue: QueueItem[]
  /** What next/previous actually walk, `activeQueue`, reordered when shuffling. */
  playOrder: QueueItem[]
  /** Position of the current song within `playOrder`, or -1. */
  index: number
  filters: Filters
  /**
   * Change what is in the queue.
   *
   * `andPlay` says whether the choice is also a request to hear something. On
   * the front page and in Ekantha a mood *is* the request, there is nothing
   * else to press; on the song list the same control is a filter over a view
   * you are reading, and starting a song under you there is an interruption.
   * Left off, the new set is only cued.
   */
  setFilters: (next: Filters, andPlay?: boolean) => void
  sort: Sort
  setSort: (next: Sort) => void
  /** Drop a song from the queue for this session. */
  removeFromQueue: (key: string) => void
  /** Nudge a song one place earlier or later in the queue. */
  moveInQueue: (key: string, delta: -1 | 1) => void
  /** Commit a whole new order, used by drag-to-reorder. */
  reorderQueue: (keys: string[]) => void
  /** Undo every removal and reorder, back to the filtered order. */
  resetQueue: () => void
  /** True when the queue has been hand-edited, so the undo can be offered. */
  queueEdited: boolean
  clearFilters: () => void
  shuffleOn: boolean
  toggleShuffle: () => void
  next: () => void
  previous: () => void
  /** Start the current filtered set from its first song. */
  playFiltered: () => void
  /** Start the whole roster from the top, what the idle deck's play button does. */
  startFromTop: () => void
}

export const PlayerContext = createContext<PlayerValue | null>(null)

export function usePlayer(): PlayerValue {
  const value = useContext(PlayerContext)
  if (!value) throw new Error('usePlayer must be used inside a PlayerProvider')
  return value
}

/** A song passes when it matches at least one selection in every active group. */
export function matchesFilters(item: QueueItem, filters: Filters): boolean {
  const { song } = item
  if (filters.familyOnly && !song.childSafe) return false
  if (filters.genres.length && !filters.genres.some((g) => song.genres.includes(g))) return false
  if (filters.moods.length && !filters.moods.some((m) => song.moods.includes(m))) return false
  return true
}

/** How many distinct choices are in play. Drives the count on the filter button. */
export function activeFilterCount(filters: Filters): number {
  return filters.genres.length + filters.moods.length + (filters.familyOnly ? 1 : 0)
}

export function filtersAreEmpty(filters: Filters): boolean {
  return !filters.genres.length && !filters.moods.length && !filters.familyOnly
}
