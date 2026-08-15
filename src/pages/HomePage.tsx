import { artists, queue } from '../data/artists'
import { photographerUrl, unsplashUrl, type HeroImage } from '../data/heroImages'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'
import { ContactLinks } from '../components/ContactLinks'
import { MoodRow } from '../components/MoodRow'
import { Thumbnail } from '../components/Thumbnail'

/**
 * One screen, no scroll.
 *
 * The whole page is a single decision: press play, or pick a mood and press
 * play. Everything else is a route away in the nav, so nothing here needs to be
 * scrolled past. The height is clipped by the shell rather than guessed at
 * here, so this only has to stay compact enough to fit a short phone.
 */
export function HomePage({ active }: { active: HeroImage }) {
  const { t, kn, lang } = useLanguage()
  const { nowPlaying, status, toggle, playFiltered } = usePlayer()

  const playing = status === 'playing'
  const song = nowPlaying?.song

  return (
    <section className="flex h-full flex-col overflow-hidden px-5 pt-3 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {/*<p className={`stamp mb-2.5 text-dial/80 ${kn ? 'kn tracking-normal' : ''}`}>
        {t.independenceLine}
      </p>*/}

      {/* Everything you came for, centred in what is left after the footnote
          has taken its strip at the bottom. */}
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <h1
        className={`text-label ${
          kn
            ? 'kn-display text-[clamp(2rem,10.5vw,3.25rem)] leading-[1.45]'
            : 'font-display text-[clamp(1.8rem,9vw,3rem)] leading-[1.02] font-semibold tracking-[-0.03em]'
        }`}
      >
        {t.siteName}
      </h1>
      <p
        className={`text-[clamp(0.9rem,3.8vw,1.15rem)] text-dial ${
          kn ? 'mt-1 font-display' : 'kn-display mt-1'
        }`}
      >
        {t.siteNameAlt}
      </p>

      <p className={`mt-3 max-w-[26ch] text-[0.95rem] leading-snug text-label/80 ${kn ? 'kn' : ''}`}>
        {t.tagline}
      </p>

      <div className="mt-5">
        <MoodRow />
      </div>

      {/* The one action. */}
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => (nowPlaying ? toggle() : playFiltered())}
          aria-label={playing ? t.pause : t.ctaStart}
          title={playing ? t.pause : t.ctaStart}
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-dial text-tape transition-transform hover:scale-105"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            ) : (
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            )}
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <p className={`stamp text-dust/85 ${kn ? 'kn tracking-normal' : ''}`}>
            {playing ? t.nowPlaying : t.ctaStart}
          </p>
          {nowPlaying && song ? (
            <div className="mt-1 flex items-center gap-2.5">
              <Thumbnail
                youtubeId={song.youtubeId}
                alt={kn ? (song.titleKn ?? song.title) : song.title}
                className="w-11 shrink-0"
              />
              <div className="min-w-0">
                <p className={`truncate text-[0.95rem] text-label ${kn ? 'kn' : ''}`}>
                  {kn ? (song.titleKn ?? song.title) : song.title}
                </p>
                <p className={`truncate text-xs text-dust ${kn ? 'kn' : ''}`}>
                  {nowPlaying.billing[lang]}
                </p>
              </div>
            </div>
          ) : (
            <p className={`mt-1 text-sm text-dust ${kn ? 'kn' : ''}`}>{t.ctaBlocked}</p>
          )}
        </div>
      </div>

        <p className={`stamp mt-5 text-dust/85 ${kn ? 'kn tracking-normal' : ''}`}>
          {t.rosterMeta(queue.length, artists.length)}
        </p>
      </div>

      {/* The footnote, held at the foot of the screen by the flex-1 above
          rather than trailing the copy.
          Unsplash asks for the photographer's name and a link, which is owed
          and is not going anywhere. But it is a caption on the wallpaper, not
          part of what the page is saying, so it reads as small print at the
          bottom edge instead of as another line of the pitch. The contact links
          ride along: it is the only bottom-of-page the front screen has, and
          the header no longer carries them. */}
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-dust/12 pt-2">
        {/* dust/75 is the floor for muted text on this background: it measures
            4.58:1, and /70 drops to 4.17:1, under AA. The quiet comes from
            where this sits and how small it is, not from fading it out. */}
        <p className={`font-mono text-[10px] leading-relaxed text-dust/75 ${kn ? 'kn' : ''}`}>
          {t.photoByPrefix}
          <a
            href={photographerUrl(active)}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dust/30 underline-offset-2 hover:text-dial"
          >
            {active.photographer}
          </a>{' '}
          <a
            href={unsplashUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dust/30 underline-offset-2 hover:text-dial"
          >
            {t.onUnsplash}
          </a>
        </p>

        <ContactLinks size={14} className="-mr-2 -mb-1.5 shrink-0" />
      </div>
    </section>
  )
}
