import { Link } from 'react-router-dom'
import { artists, leadingArtists, queue, supportingArtists } from '../data/artists'
import { letterFor } from '../lib/alphabet'
import { useLanguage } from '../lib/language'
import { AlphabetRail } from '../components/AlphabetRail'
import { ArtistCard } from '../components/ArtistCard'
import { SectionHeading } from '../components/SectionHeading'

/**
 * Two lists, because there are two kinds of name here.
 *
 * Anyone billed as the lead on a song gets a card. Anyone credited only on
 * somebody else's record, a featured singer, a player, the poet the words came
 * from, gets a line in the list below it. They all get a page either way; the
 * difference is only how much there is to show. A card carrying one song and no
 * write-up credits somebody worse than a plain line that says what it is.
 */
export function ArtistsPage() {
  const { t, lang, kn } = useLanguage()

  // `leadingArtists` is already A to Z on the romanised name, which is what the
  // rail indexes. The also-credited names below are a short inline list, not
  // somewhere to scroll to, so they are not targets.
  const letters = new Set(leadingArtists.map((artist) => letterFor(artist.name.en)))
  const jumpTo = (letter: string, smooth: boolean) => {
    const card = document.querySelector<HTMLElement>(`[data-letter="${letter}"]`)
    card?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  return (
    <section className="px-5 py-8">
      <SectionHeading side={t.sideA} title={t.navArtists} lang={lang} />

      <p className={`mb-7 text-sm text-dust ${kn ? 'kn' : ''}`}>
        {t.rosterMeta(queue.length, artists.length)}
      </p>

      <div className="space-y-5">
        {leadingArtists.map((artist, index) => {
          const letter = letterFor(artist.name.en)
          const first = index === 0 || letterFor(leadingArtists[index - 1].name.en) !== letter
          return (
            <div key={artist.id} data-letter={first ? letter : undefined} className="scroll-mt-24">
              <ArtistCard artist={artist} index={index} />
            </div>
          )
        })}
      </div>

      {letters.size > 1 && <AlphabetRail available={letters} onPick={jumpTo} />}

      {supportingArtists.length > 0 && (
        <section className="mt-10 border-t border-dust/15 pt-7">
          <h2 className={`stamp mb-2 text-dial ${kn ? 'kn tracking-normal' : ''}`}>
            {t.alsoCreditedHeading}
          </h2>
          <p className={`mb-4 max-w-[52ch] text-sm leading-relaxed text-dust ${kn ? 'kn' : ''}`}>
            {t.alsoCreditedNote}
          </p>
          <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
            {supportingArtists.map((artist, i) => (
              <li key={artist.id} className={`text-[0.95rem] text-label/85 ${kn ? 'kn' : ''}`}>
                <Link
                  to={`/artists/${artist.id}`}
                  className="underline decoration-dust/25 underline-offset-[3px] transition-colors hover:text-dial"
                >
                  {artist.name[lang]}
                </Link>
                {i < supportingArtists.length - 1 && <span className="text-dust/75"> ·</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
