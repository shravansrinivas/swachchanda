import { Link, useParams } from 'react-router-dom'
import { artistProfiles, findArtist, platformLabels, platformLinks, profileLabels } from '../data/artists'
import { useLanguage } from '../lib/language'
import { TrackRow } from '../components/TrackRow'

export function ArtistPage() {
  const { artistId } = useParams()
  const { t, lang, kn } = useLanguage()
  const artist = findArtist(artistId)

  if (!artist) {
    return (
      <section className="px-5 py-12">
        <p className={`text-label/80 ${kn ? 'kn' : ''}`}>{t.playerError}</p>
        <Link
          to="/artists"
          className="mt-4 inline-block font-mono text-xs text-verdigris underline underline-offset-[3px] hover:text-dial"
        >
          ← {t.navArtists}
        </Link>
      </section>
    )
  }

  return (
    <article className="px-5 py-8">
      <Link
        to="/artists"
        className={`font-mono text-xs text-dust transition-colors hover:text-dial ${kn ? 'kn' : ''}`}
      >
        ← {t.navArtists}
      </Link>

      <header className="mt-5">
        <h1
          className={`text-[2rem] leading-tight text-label ${
            kn ? 'kn-display' : 'font-display font-medium tracking-[-0.02em]'
          }`}
        >
          {artist.name[lang]}
        </h1>
        <p className={`mt-1 text-base text-dust ${kn ? 'font-display' : 'kn'}`}>
          {artist.name[kn ? 'en' : 'kn']}
        </p>
        <p className={`stamp mt-3 text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>
          {t.artistTrackCount(artist.tracks.length)}
        </p>
      </header>

      <p className={`mt-6 text-[1rem] leading-relaxed text-label/85 ${kn ? 'kn' : ''}`}>
        {artist.blurb[lang]}
      </p>

      <section className="mt-8">
        <h2 className={`stamp mb-1 text-dial ${kn ? 'kn tracking-normal' : ''}`}>
          {t.tracksLabel}
        </h2>
        <ul>
          {artist.tracks.map((track, i) => (
            <li key={track.youtubeId} className="border-b border-dust/12 last:border-b-0">
              <TrackRow artist={artist} track={track} index={i} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-t border-dust/15 pt-5">
        <h2 className={`stamp mb-3 text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>
          {t.listenOn}
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {platformLinks(artist).map(({ platform, url, exact }) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noreferrer"
              title={exact ? undefined : `${platformLabels[platform]}, ${t.searchSuffix}`}
              className={`font-mono text-xs underline decoration-verdigris/40 underline-offset-[3px] transition-colors hover:text-dial ${
                exact ? 'text-verdigris' : 'text-verdigris/60'
              }`}
            >
              {platformLabels[platform]}
            </a>
          ))}
        </div>

        {/* Only profiles we actually hold. Nothing here is a guess or a search. */}
        {artistProfiles(artist).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-dust/10 pt-4">
            {artistProfiles(artist).map(({ profile, url }) => (
              <a
                key={profile}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-dust underline decoration-dust/30 underline-offset-[3px] transition-colors hover:text-dial"
              >
                {profileLabels[profile]}
              </a>
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
