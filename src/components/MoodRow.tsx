import { allMoods, moodLabels } from '../data/taxonomy'
import type { Mood } from '../data/taxonomy'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'

/**
 * The mood picker, shared by the home screen and the song list so the two
 * cannot drift apart.
 *
 * One row that scrolls sideways rather than wrapping, which keeps the home
 * screen's height fixed however many moods exist. Selecting one re-scopes the
 * queue and the background; both happen upstream off the filters, so this only
 * has to set them.
 *
 * `browseOnly` is the song list. Everywhere else a mood is the only thing to
 * press, so picking one starts that set playing; on the song list the same
 * control filters a view you are reading, and starting a song under you there
 * is an interruption rather than an answer.
 *
 * `onMore` adds a trailing button for the fuller controls (sound, family
 * listening). Home leaves it off: the point of that screen is one decision.
 */
export function MoodRow({
  onMore,
  label,
  browseOnly = false,
}: {
  onMore?: () => void
  label?: string
  browseOnly?: boolean
}) {
  const { t, kn, lang } = useLanguage()
  const { filters, setFilters } = usePlayer()

  const active: Mood | 'any' = filters.moods.length === 1 ? filters.moods[0] : 'any'

  const pick = (mood: Mood | 'any') =>
    setFilters({ ...filters, moods: mood === 'any' ? [] : [mood] }, !browseOnly)

  return (
    <div>
      {label !== '' && (
        <p className={`stamp mb-2 text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>
          {label ?? t.ctaPickMood}
        </p>
      )}

      <div className="flex items-center gap-2">
        <div
          // "More" scrolls with the moods rather than being pinned to the far
          // right, so it reads as the last of the same set of choices.
          className="-mx-5 flex min-w-0 flex-1 gap-2 overflow-x-auto px-5 pb-1 [mask-image:linear-gradient(to_right,transparent,black_18px,black_calc(100%-18px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {(['any', ...allMoods] as (Mood | 'any')[]).map((mood) => {
          const on = active === mood
          return (
            <button
              key={mood}
              type="button"
              onClick={() => pick(mood)}
              aria-pressed={on}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors ${
                kn ? 'kn' : 'font-display'
              } ${
                on
                  ? 'border-dial bg-dial text-tape'
                  : 'border-dust/30 text-dust hover:border-dial/50 hover:text-label'
              }`}
            >
              {mood === 'any' ? (
                t.ctaAnyMood
              ) : (
                <span className="flex items-baseline gap-1.5">
                  <span>{moodLabels[mood][lang]}</span>
                  <span aria-hidden="true" className="opacity-40">
                    ·
                  </span>
                  <span className={`text-[0.78rem] opacity-75 ${lang === 'kn' ? '' : 'kn'}`}>
                    {moodLabels[mood][lang === 'kn' ? 'en' : 'kn']}
                  </span>
                </span>
              )}
            </button>
          )
        })}

        {onMore && (
          <button
            type="button"
            onClick={onMore}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-dust/40 px-3.5 py-1.5 text-sm whitespace-nowrap text-dust transition-colors hover:border-dial hover:text-dial ${
              kn ? 'kn' : 'font-display'
            }`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t.filtersMore}
          </button>
        )}
        </div>
      </div>
    </div>
  )
}
