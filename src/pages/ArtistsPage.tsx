import { artists, artistsAlphabetical, queue } from '../data/artists'
import { useLanguage } from '../lib/language'
import { ArtistCard } from '../components/ArtistCard'
import { SectionHeading } from '../components/SectionHeading'

export function ArtistsPage() {
  const { t, lang, kn } = useLanguage()

  return (
    <section className="px-5 py-8">
      <SectionHeading side={t.sideA} title={t.navArtists} lang={lang} />

      <p className={`mb-7 text-sm text-dust ${kn ? 'kn' : ''}`}>
        {t.rosterMeta(queue.length, artists.length)}
      </p>

      <div className="space-y-5">
        {artistsAlphabetical.map((artist, index) => (
          <ArtistCard key={artist.id} artist={artist} index={index} />
        ))}
      </div>
    </section>
  )
}
