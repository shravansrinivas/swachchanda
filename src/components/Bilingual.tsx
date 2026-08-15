import type { Bilingual as BilingualText } from '../data/artists'
import { useLanguage } from '../lib/language'

/**
 * Content that exists in both scripts is shown in both scripts, whatever the
 * site language is set to.
 *
 * The distinction is between *chrome* and *content*. Buttons, headings and
 * instructions follow the language picker, because reading the same button
 * twice is noise. But a song title, an artist's name and a genre are the thing
 * itself: someone reading in English may still want the Kannada spelling of a
 * name, and the other way round.
 *
 * Side by side rather than stacked. Stacking doubled the height of every row
 * and made lists look like they had twice as many entries as they did; on one
 * line with a divider the second script reads as the same item restated, which
 * is what it is.
 *
 * Renders one string when the two are identical, which happens for names with
 * no separate Kannada spelling.
 */
export function BiText({
  value,
  className = '',
  secondaryClassName = 'text-dust/85',
  stacked = false,
}: {
  value: BilingualText
  className?: string
  secondaryClassName?: string
  /** Force the second script onto its own line. Used where width is very tight. */
  stacked?: boolean
}) {
  const { lang, kn } = useLanguage()

  const primary = value[lang]
  const secondary = value[lang === 'kn' ? 'en' : 'kn']
  const secondaryIsKannada = lang !== 'kn'

  if (!secondary || secondary === primary) {
    return <span className={`block truncate ${className} ${kn ? 'kn' : ''}`}>{primary}</span>
  }

  if (stacked) {
    return (
      <span className={`block ${className}`}>
        <span className={`block truncate ${kn ? 'kn' : ''}`}>{primary}</span>
        <span className={`block truncate ${secondaryClassName} ${secondaryIsKannada ? 'kn' : ''}`}>
          {secondary}
        </span>
      </span>
    )
  }

  return (
    <span className={`flex min-w-0 items-baseline gap-1.5 ${className}`}>
      <span className={`truncate ${kn ? 'kn' : ''}`}>{primary}</span>
      <span aria-hidden="true" className={`shrink-0 opacity-40 ${secondaryClassName}`}>
        ·
      </span>
      <span
        className={`truncate ${secondaryClassName} ${secondaryIsKannada ? 'kn' : ''}`}
      >
        {secondary}
      </span>
    </span>
  )
}
