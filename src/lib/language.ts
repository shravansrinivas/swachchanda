import { createContext, useContext } from 'react'
import type { Lang } from '../data/artists'
import type { Copy } from '../data/copy'

/**
 * Context object and hook, kept apart from the provider component so fast
 * refresh keeps working (a module may export components or values, not both).
 */

/**
 * The Kannada copy exists in full and is not going anywhere, but it is not
 * good enough to ship as a choice yet. Flip this to true when it has been read
 * through by someone who speaks it, and the picker becomes live. Nothing else
 * needs to change: every label is already written in both scripts.
 */
export const KANNADA_READY = false

export interface LanguageValue {
  lang: Lang
  setLang: (next: Lang) => void
  /** Copy table for the active language, saves a lookup in every component. */
  t: Copy
  /** True when the active language is Kannada; drives per-script class choices. */
  kn: boolean
  /** False while the Kannada copy is still being worked on. */
  kannadaReady: boolean
}

export const LanguageContext = createContext<LanguageValue | null>(null)

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside a LanguageProvider')
  return value
}
