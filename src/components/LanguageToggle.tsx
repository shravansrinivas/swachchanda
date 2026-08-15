import type { Lang } from '../data/artists'
import { copy } from '../data/copy'
import { useLanguage } from '../lib/language'

/**
 * Segmented control rather than a single swap-button: both scripts stay
 * visible, so a Kannada reader can see the option without reading English
 * first.
 *
 * While the Kannada copy is still being worked on, that half is shown but not
 * selectable, marked "soon". It stays visible on purpose: the translation is
 * written and is coming, and hiding the control would suggest otherwise.
 */
export function LanguageToggle({
  lang,
  onChange,
}: {
  lang: Lang
  onChange: (next: Lang) => void
}) {
  const { kannadaReady } = useLanguage()
  const t = copy[lang]

  const options: { value: Lang; label: string; font: string }[] = [
    { value: 'kn', label: 'ಕನ್ನಡ', font: 'kn-display' },
    { value: 'en', label: 'EN', font: 'font-mono tracking-[0.14em]' },
  ]

  return (
    <div
      role="radiogroup"
      aria-label={t.langToggleLabel}
      className="relative flex w-[152px] items-center rounded-full border border-dust/25 bg-tape/70 p-[3px] backdrop-blur-sm"
    >
      {/* Sliding amber indicator, the radio-dial needle. */}
      <span
        aria-hidden="true"
        className={`absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-full bg-dial transition-transform duration-300 ease-out ${
          lang === 'kn' ? 'translate-x-0' : 'translate-x-full'
        }`}
      />
      {options.map((option) => {
        const active = lang === option.value
        const locked = option.value === 'kn' && !kannadaReady

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={locked || undefined}
            disabled={locked}
            title={locked ? t.langComingSoon : undefined}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex flex-1 basis-0 items-center justify-center gap-1 px-1.5 py-1 text-[13px] leading-6 transition-colors duration-200 ${option.font} ${
              active ? 'text-tape' : locked ? 'text-dust/75' : 'text-dust hover:text-label'
            } ${locked ? 'cursor-not-allowed' : ''}`}
          >
            {option.label}
            {locked && (
              <span className="font-mono text-[8px] leading-none tracking-normal uppercase opacity-75">soon</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
