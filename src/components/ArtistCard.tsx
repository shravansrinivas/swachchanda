import { Link } from 'react-router-dom'
import type { Artist } from '../data/artists'
import { songsBy } from '../data/artists'
import { useLanguage } from '../lib/language'
import { Thumbnail } from './Thumbnail'
import { TrackRow } from './TrackRow'

/** How many songs a card previews before deferring to the artist's own page. */
const PREVIEW = 2

/**
 * An artist as a cassette J-card: inked spine, typewriter index, ruled track
 * listing. The card previews a couple of songs; the artist page holds the rest.
 */
export function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const { t, kn, lang } = useLanguage()
  // Every song this artist is credited on, not only the ones filed under them.
  const songs = songsBy(artist.id)
  const remaining = songs.length - PREVIEW

  return (
    <article className="grain relative scroll-mt-32 overflow-hidden rounded-[3px] border border-dust/15 bg-deck/90">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-dial/70" />

      <div className="py-5 pr-4 pl-5">
        <div className="flex items-start gap-3">
          <span className="stamp pt-1 text-dust/85">{String(index + 1).padStart(2, '0')}</span>

          {/* The first song's thumbnail stands in as the artist's cover. */}
          {songs[0] && (
            <Link to={`/artists/${artist.id}`} className="w-20 shrink-0">
              <Thumbnail youtubeId={songs[0].song.youtubeId} alt={artist.name[lang]} />
            </Link>
          )}

          <div className="min-w-0 flex-1">
            <h3
              className={`text-[1.4rem] leading-tight ${
                kn ? 'kn-display' : 'font-display font-medium tracking-[-0.02em]'
              }`}
            >
              <Link to={`/artists/${artist.id}`} className="text-label transition-colors hover:text-dial">
                {artist.name[lang]}
              </Link>
            </h3>
            <p className={`mt-0.5 text-sm text-dust ${kn ? 'font-display' : 'kn'}`}>
              {artist.name[kn ? 'en' : 'kn']}
            </p>
          </div>
        </div>

        {/* Not everyone has a write-up. Someone credited on one song and
            nothing else usually has nothing sourced to say about them, and an
            invented sentence would be worse than the name on its own. */}
        {artist.blurb && (
          <p className={`mt-4 text-[0.95rem] leading-relaxed text-label/85 ${kn ? 'kn' : ''}`}>
            {artist.blurb[lang]}
          </p>
        )}

        <ul className="mt-5">
          {songs.slice(0, PREVIEW).map((item, i) => (
            <li key={item.key} className="border-b border-dust/12 last:border-b-0">
              <TrackRow item={item} index={i} />
            </li>
          ))}
        </ul>

        <Link
          to={`/artists/${artist.id}`}
          className={`mt-4 inline-block font-mono text-xs text-verdigris underline decoration-verdigris/40 underline-offset-[3px] transition-colors hover:text-dial`}
        >
          {remaining > 0
            ? `+${remaining} · ${t.artistTrackCount(songs.length)} →`
            : `${t.artistTrackCount(songs.length)} →`}
        </Link>
      </div>
    </article>
  )
}
