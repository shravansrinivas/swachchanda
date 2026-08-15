import { useEffect, useState, type ReactNode } from 'react'
import type { Lang } from '../data/artists'
import { copy } from '../data/copy'
import { KANNADA_READY, LanguageContext } from './language'

/** Which script the site opens in. Flip to 'kn' to lead in Kannada. */
const DEFAULT_LANG: Lang = 'en'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(KANNADA_READY ? DEFAULT_LANG : 'en')

  // Switching to Kannada is refused while the copy is still being worked on.
  // The strings all still exist; only the choice is withheld.
  const setLang = (next: Lang) => {
    if (next === 'kn' && !KANNADA_READY) return
    setLangState(next)
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: copy[lang], kn: lang === 'kn', kannadaReady: KANNADA_READY }}>
      {children}
    </LanguageContext.Provider>
  )
}
