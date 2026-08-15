import { Link } from 'react-router-dom'
import { aboutSections } from '../data/about'
import { artists, queue } from '../data/artists'
import { BUILT_BY, BUILT_ON } from '../data/copy'
import { useLanguage } from '../lib/language'
import { ContactLinks } from '../components/ContactLinks'
import { SectionHeading } from '../components/SectionHeading'

export function AboutPage() {
  const { t, lang, kn } = useLanguage()

  return (
    <div className="px-5 py-8">
      <SectionHeading side={t.sideB} title={t.aboutHeading} lang={lang} />

      <p className={`mb-2 text-[1.15rem] leading-relaxed text-label ${kn ? 'kn' : 'font-display'}`}>
        {t.tagline}
      </p>
      <p className={`stamp mb-10 text-dust ${kn ? 'kn tracking-normal' : ''}`}>
        {t.rosterMeta(queue.length, artists.length)}
      </p>

      {aboutSections.map((section, i) => (
        <section
          key={section.id}
          aria-labelledby={`${section.id}-heading`}
          className={i > 0 ? 'mt-9 border-t border-dust/15 pt-7' : ''}
        >
          <h2
            id={`${section.id}-heading`}
            className={`mb-3 text-[1.25rem] text-dial ${
              kn ? 'kn-display' : 'font-display font-medium tracking-[-0.02em]'
            }`}
          >
            {section.heading[lang]}
          </h2>
          {section.body.map((paragraph, j) => (
            <p
              key={j}
              className={`max-w-[52ch] text-[0.95rem] leading-relaxed text-label/80 ${
                j > 0 ? 'mt-3' : ''
              } ${kn ? 'kn' : ''}`}
            >
              {paragraph[lang]}
            </p>
          ))}
        </section>
      ))}

      <p className={`mt-10 border-t border-dust/15 pt-7 text-sm text-dust ${kn ? 'kn' : ''}`}>
        {t.builtBy(BUILT_BY, BUILT_ON[lang])}
      </p>

      <div className="mt-4 flex flex-wrap gap-4">
        <Link
          to="/credits"
          className={`text-[0.95rem] text-dial underline decoration-dial/40 underline-offset-[3px] transition-colors hover:text-label ${kn ? 'kn' : 'font-display'}`}
        >
          {t.navCredits} →
        </Link>
        <Link
          to="/songs"
          className={`text-[0.95rem] text-verdigris underline decoration-verdigris/40 underline-offset-[3px] transition-colors hover:text-dial ${kn ? 'kn' : 'font-display'}`}
        >
          {t.navSongs} →
        </Link>
      </div>

      <ContactLinks className="mt-4 -ml-2" />
    </div>
  )
}
