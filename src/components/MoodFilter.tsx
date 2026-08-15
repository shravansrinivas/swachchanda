import { useEffect } from 'react'
import { childSafeCount, queue } from '../data/artists'
import { allGenres, allMoods, genreLabels, moodLabels } from '../data/taxonomy'
import type { Genre, Mood } from '../data/taxonomy'
import { useLanguage } from '../lib/language'
import { filtersAreEmpty, usePlayer, type Sort } from '../lib/player'

/**
 * Filters live in a sheet rather than permanently open.
 *
 * Left expanded they pushed the song list most of a screen down, which made
 * the thing you came for the thing you could not see. The trigger below states
 * how many are active, so nothing is hidden, only folded away.
 */

/**
 * Status line under the mood row: what else is narrowing the list, and how many
 * songs survive it.
 *
 * Moods are not repeated here, because the row above already shows them
 * selected. This only carries the filters that row cannot express, so the two
 * never say the same thing twice.
 */
export function FilterSummary({ onOpen }: { onOpen: () => void }) {
  const { t, kn, lang } = useLanguage()
  const { filters, clearFilters, activeQueue } = usePlayer()
  const extras = filters.genres.length + (filters.familyOnly ? 1 : 0)

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {filters.genres.map((genre) => (
        <button
          key={genre}
          type="button"
          onClick={onOpen}
          className={`rounded-full bg-deck px-2.5 py-1 text-xs text-dust transition-colors hover:text-dial ${kn ? 'kn' : ''}`}
        >
          {genreLabels[genre][lang]}
        </button>
      ))}
      {filters.familyOnly && (
        <button
          type="button"
          onClick={onOpen}
          className={`rounded-full bg-deck px-2.5 py-1 text-xs text-dust transition-colors hover:text-dial ${kn ? 'kn' : ''}`}
        >
          {t.familyMode}
        </button>
      )}

      {extras > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className={`font-mono text-xs text-dust underline underline-offset-[3px] transition-colors hover:text-dial ${kn ? 'kn' : ''}`}
        >
          {t.clearFilters}
        </button>
      )}

      <span className={`stamp ml-auto text-dial ${kn ? 'kn tracking-normal' : ''}`}>
        {t.filterResults(activeQueue.length)}
      </span>
    </div>
  )
}

export function FilterSheet({
  open,
  onClose,
  sort,
  onSortChange,
}: {
  open: boolean
  onClose: () => void
  sort: Sort
  onSortChange: (next: Sort) => void
}) {
  const { t, kn } = useLanguage()
  const { filters, setFilters, clearFilters, activeQueue } = usePlayer()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const toggleGenre = (genre: Genre) =>
    setFilters({
      ...filters,
      genres: filters.genres.includes(genre)
        ? filters.genres.filter((g) => g !== genre)
        : [...filters.genres, genre],
    })

  const toggleMood = (mood: Mood) =>
    setFilters({
      ...filters,
      moods: filters.moods.includes(mood)
        ? filters.moods.filter((m) => m !== mood)
        : [...filters.moods, mood],
    })

  return (
    <div
      className="fixed inset-0 z-60 flex flex-col justify-end bg-tape/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={t.filterHeading}
    >
      <button type="button" aria-label={t.close} onClick={onClose} className="absolute inset-0 cursor-default" tabIndex={-1} />

      <div className="grain animate-[player-rise_300ms_cubic-bezier(0.22,1,0.36,1)] relative max-h-[88svh] overflow-y-auto rounded-t-xl border-t border-dust/20 bg-tape/85 px-5 pt-3 pb-8 backdrop-blur-xl">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-dust/30" />

        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className={`text-[1.15rem] text-label ${kn ? 'kn-display' : 'font-display font-medium'}`}>
            {t.filterHeading}
          </h2>
          {!filtersAreEmpty(filters) && (
            <button
              type="button"
              onClick={clearFilters}
              className={`font-mono text-xs text-dust underline underline-offset-[3px] hover:text-dial ${kn ? 'kn' : ''}`}
            >
              {t.clearFilters}
            </button>
          )}
        </div>

        <Group label={t.moodsLabel}>
          {allMoods.map((mood) => (
            <Chip key={mood} active={filters.moods.includes(mood)} onClick={() => toggleMood(mood)} kannada={kn}>
              <BothScripts value={moodLabels[mood]} />
            </Chip>
          ))}
        </Group>

        <Group label={t.sortLabel}>
          {(
            [
              { value: 'roster', label: t.sortRoster },
              { value: 'title', label: t.sortTitle },
              { value: 'artist', label: t.sortArtist },
            ] as { value: Sort; label: string }[]
          ).map((option) => (
            <Chip
              key={option.value}
              active={sort === option.value}
              onClick={() => onSortChange(option.value)}
              kannada={kn}
            >
              {option.label}
            </Chip>
          ))}
        </Group>

        <Group label={t.genresLabel}>
          {allGenres.map((genre) => (
            <Chip
              key={genre}
              active={filters.genres.includes(genre)}
              onClick={() => toggleGenre(genre)}
              kannada={kn}
            >
              <BothScripts value={genreLabels[genre]} />
            </Chip>
          ))}
        </Group>

        {/* Family listening is an allowlist, so the note matters as much as the switch. */}
        <div className="mt-5 border-t border-dust/15 pt-4">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className={`text-[0.95rem] text-label ${kn ? 'kn' : ''}`}>{t.familyMode}</span>
            <span className="relative inline-flex shrink-0">
              <input
                type="checkbox"
                checked={filters.familyOnly}
                onChange={(e) => setFilters({ ...filters, familyOnly: e.target.checked })}
                className="peer sr-only"
              />
              <span className="h-6 w-11 rounded-full bg-dust/25 transition-colors peer-checked:bg-dial peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-dial" />
              <span className="pointer-events-none absolute top-1 left-1 h-4 w-4 rounded-full bg-tape transition-transform peer-checked:translate-x-5" />
            </span>
          </label>
          <p className={`mt-2 text-xs leading-relaxed text-dust ${kn ? 'kn' : ''}`}>
            {t.familyModeNote(childSafeCount, queue.length)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`mt-6 w-full rounded-full bg-dial py-3 text-tape transition-opacity hover:opacity-85 ${kn ? 'kn' : 'font-display'}`}
        >
          {t.filtersDone} · {t.filterResults(activeQueue.length)}
        </button>
      </div>
    </div>
  )
}

/** A tag name in both scripts, stacked so the pill stays narrow. */
function BothScripts({ value }: { value: { kn: string; en: string } }) {
  const { lang } = useLanguage()
  return (
    <span className="flex items-baseline gap-1.5">
      <span>{value[lang]}</span>
      <span aria-hidden="true" className="opacity-40">
        ·
      </span>
      <span className={`text-[0.78rem] opacity-75 ${lang === 'kn' ? '' : 'kn'}`}>
        {value[lang === 'kn' ? 'en' : 'kn']}
      </span>
    </span>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  const { kn } = useLanguage()
  return (
    <div className="mb-4">
      <p className={`stamp mb-2 text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  kannada,
  children,
}: {
  active: boolean
  onClick: () => void
  kannada: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        kannada ? 'kn' : 'font-display'
      } ${
        active
          ? 'border-dial bg-dial text-tape'
          : 'border-dust/30 text-dust hover:border-dial/50 hover:text-label'
      }`}
    >
      {children}
    </button>
  )
}
