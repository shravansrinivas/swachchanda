import type { Lang } from '../data/artists'

/**
 * A typewriter strip across the top of each section, the way sides are
 * labelled on a cassette insert: SIDE A ,,,,,,,, ಕಲಾವಿದರು
 */
export function SectionHeading({
  side,
  title,
  lang,
  id,
}: {
  side: string
  title: string
  lang: Lang
  id?: string
}) {
  return (
    <div className="mb-7 flex items-baseline gap-3">
      <span className={`stamp shrink-0 text-dial ${lang === 'kn' ? 'kn' : ''}`}>{side}</span>
      <span aria-hidden="true" className="h-px flex-1 translate-y-[-4px] bg-dust/25" />
      <h2
        id={id}
        className={`shrink-0 text-right text-lg text-label/90 ${
          lang === 'kn' ? 'kn-display' : 'font-display tracking-tight'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}
