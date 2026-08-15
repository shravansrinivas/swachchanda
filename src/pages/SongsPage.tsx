import { useMemo, useState } from 'react'
import type { QueueItem } from '../data/artists'
import { letterFor } from '../lib/alphabet'
import { useLanguage } from '../lib/language'
import { instagramUrl, mailtoUrl } from '../data/copy'
import { usePlayer } from '../lib/player'
import { AlphabetRail } from '../components/AlphabetRail'
import { FilterSheet, FilterSummary } from '../components/MoodFilter'
import { MoodRow } from '../components/MoodRow'
import { SectionHeading } from '../components/SectionHeading'
import { TrackRow } from '../components/TrackRow'

/**
 * The roster as one flat list: filters, search and sort on top of `playOrder`,
 * so what you read is the order the deck will walk, shuffle included.
 *
 * Searching and sorting only reorder what is shown; they do not touch the play
 * queue, which stays owned by the filters and the shuffle toggle.
 */
export function SongsPage() {
  const { t, lang, kn } = useLanguage()
  const { playOrder, playFiltered, shuffleOn, sort, setSort } = usePlayer()

  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const shown = useMemo(() => {
    const needle = search.trim().toLowerCase()

    // Match either script of the song or of *any* credited artist, so someone
    // typing "ತುಳಸಿ" and someone typing "tulasi" both land on the same row, and
    // so does someone searching for the singer featured on it.
    const matches = (item: QueueItem) => {
      if (!needle) return true
      const haystack = [
        item.song.title,
        item.song.titleKn ?? '',
        ...item.credits.flatMap((credit) => [credit.artist.name.en, credit.artist.name.kn]),
      ]
      return haystack.some((field) => field.toLowerCase().includes(needle))
    }

    // Ordering already happened upstream: playOrder is the queue in its real
    // order, so searching only removes rows, never rearranges them.
    return playOrder.filter(matches)
  }, [playOrder, search])

  /**
   * The A to Z rail, offered only when the list is actually in alphabetical
   * order.
   *
   * Under shuffle, or sorted in tape order, the letters would not run down the
   * page, and a jump to M would land somewhere arbitrary. A shortcut that lies
   * about where it is taking you is worse than no shortcut, so it simply is not
   * there. Which field it indexes follows the sort: by title it is the song, by
   * artist it is the billed name, both romanised, which is what the sort itself
   * compares.
   */
  const alphabetical = !shuffleOn && (sort === 'title' || sort === 'artist')
  const letterOf = (item: QueueItem) =>
    letterFor(sort === 'artist' ? item.billing.en : item.song.title)
  const letters = useMemo(
    () => (alphabetical ? new Set(shown.map(letterOf)) : new Set<string>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shown, alphabetical, sort],
  )

  const jumpTo = (letter: string, smooth: boolean) => {
    const row = document.querySelector<HTMLElement>(`[data-letter="${letter}"]`)
    row?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  return (
    <section className="px-5 py-8">
      <SectionHeading side={t.sideA} title={t.songsHeading} lang={lang} />

      {/* Search */}
      <div className="relative mb-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-dust"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className={`w-full rounded-full border border-dust/25 bg-deck/70 py-2.5 pr-10 pl-10 text-[0.95rem] text-label placeholder:text-dust/85 focus:border-dial focus:outline-none ${kn ? 'kn' : ''}`}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label={t.searchClear}
            className="absolute top-1/2 right-3 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-dust transition-colors hover:text-dial"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-3">
        {/* browseOnly: here a mood narrows the list you are reading. It is the
            one screen where picking one must not start a song. */}
        <MoodRow onMore={() => setFiltersOpen(true)} label={t.moodsLabel} browseOnly />
      </div>
      <FilterSummary onOpen={() => setFiltersOpen(true)} />
      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sort={sort}
        onSortChange={setSort}
      />

      {shown.length > 0 && (
        <button
          type="button"
          onClick={playFiltered}
          className={`mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-dial px-4 py-2.5 text-sm whitespace-nowrap text-tape transition-opacity hover:opacity-85 ${
            kn ? 'kn' : 'font-display'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
          {t.playFiltered}
          {shuffleOn && <span className="font-mono text-xs opacity-70">· {t.shuffle}</span>}
        </button>
      )}

      {shown.length === 0 ? (
        // An empty list is the best moment to ask for a suggestion: the reader
        // has just told us, precisely, what they came for and did not find.
        <div className="grain relative overflow-hidden rounded-[3px] border border-dust/15 bg-deck/50 px-5 py-8 text-center">
          <p className={`text-sm leading-relaxed text-dust ${kn ? 'kn' : ''}`}>{t.noResults}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={`rounded-full bg-dial px-4 py-2 text-sm text-tape transition-opacity hover:opacity-85 ${kn ? 'kn' : 'font-display'}`}
            >
              {t.noResultsAction}
            </a>
            <a
              href={mailtoUrl}
              className={`rounded-full border border-dust/30 px-4 py-2 text-sm text-label transition-colors hover:border-dial hover:text-dial ${kn ? 'kn' : 'font-display'}`}
            >
              {t.calloutEmail}
            </a>
          </div>
        </div>
      ) : (
        <ul
          className={`grain relative overflow-hidden rounded-[3px] border border-dust/15 bg-deck/70 px-4 ${
            letters.size > 1 ? 'pr-7' : ''
          }`}
        >
          {shown.map((item, i) => {
            const letter = letterOf(item)
            // Only the *first* row of each letter is a jump target, so the rail
            // lands on the top of a run rather than somewhere inside it.
            const first = alphabetical && (i === 0 || letterOf(shown[i - 1]) !== letter)
            return (
              <li
                key={item.key}
                data-letter={first ? letter : undefined}
                className="scroll-mt-24 border-b border-dust/12 last:border-b-0"
              >
                <TrackRow item={item} index={i} showArtist showTags />
              </li>
            )
          })}
        </ul>
      )}
      {/* Below two letters there is nothing to navigate and the rail is just
          furniture down the edge of the screen. */}
      {letters.size > 1 && <AlphabetRail available={letters} onPick={jumpTo} />}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-dust/15 pt-5">
        <span className={`text-sm text-dust ${kn ? 'kn' : ''}`}>{t.suggestHeading}</span>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full border border-dial/40 px-3.5 py-1.5 text-sm text-dial transition-colors hover:bg-dial hover:text-tape ${kn ? 'kn' : 'font-display'}`}
        >
          {t.noResultsAction}
        </a>
      </div>
    </section>
  )
}
