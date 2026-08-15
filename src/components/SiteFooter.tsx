import { Link } from 'react-router-dom'
import { BUILT_BY, BUILT_ON } from '../data/copy'
import { useLanguage } from '../lib/language'
import { ContactLinks } from './ContactLinks'
import { FeedbackLine } from './FeedbackLine'

/**
 * Slim footer on every page. The full credits, music, photographs, playlists,
 * tools, live on /credits; this only points there.
 */
export function SiteFooter() {
  const { t, lang, kn } = useLanguage()

  return (
    <footer className="mt-4 border-t border-dust/15 px-5 py-8">
      <Link
        to="/credits"
        className={`text-[0.95rem] text-dial underline decoration-dial/40 underline-offset-[3px] transition-colors hover:text-label ${
          kn ? 'kn' : 'font-display'
        }`}
      >
        {t.artistCreditsHeading} →
      </Link>
      <p className={`mt-3 flex items-center gap-2 text-sm text-dust ${kn ? 'kn' : ''}`}>
        <img
          src="/gss-gh.jpg"
          alt=""
          aria-hidden="true"
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-dust/25"
        />
        {t.builtBy(BUILT_BY, BUILT_ON[lang])}
      </p>
      <p className={`mt-1 text-sm text-dial/80 ${kn ? 'kn' : ''}`}>{t.independenceLine}</p>

      <ContactLinks className="mt-4 -ml-2" />

      <FeedbackLine className="mt-5 max-w-[46ch]" />
    </footer>
  )
}
