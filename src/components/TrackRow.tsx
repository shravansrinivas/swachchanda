import type { Artist, Track } from '../data/artists'
import { trackTitle } from '../data/artists'
import { moodLabels } from '../data/taxonomy'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'
import { TapeReel } from './TapeReel'
import { BiText } from './Bilingual'
import { Thumbnail } from './Thumbnail'

const pad = (n: number) => String(n + 1).padStart(2, '0')

/**
 * One song. Shared by the artist card, the artist page and the song list so a
 * track behaves identically wherever it appears.
 *
 * A track marked `unplayable` still renders, because it is still part of the
 * roster and the artist still deserves the credit, but it is not a button:
 * there is nothing to tap and nothing to queue, only a link out to YouTube.
 */
export function TrackRow({
  artist,
  track,
  index,
  showArtist = false,
  showTags = false,
}: {
  artist: Artist
  track: Track
  index: number
  showArtist?: boolean
  /** Show mood tags. Useful on the song list, noise on an artist page. */
  showTags?: boolean
}) {
  const { t, kn, lang } = useLanguage()
  const { nowPlaying, status, play } = usePlayer()

  const active = nowPlaying?.key === `${artist.id}:${track.youtubeId}`
  const spinning = active && status === 'playing'
  const title = kn ? (track.titleKn ?? track.title) : track.title

  const body = (
    <>
      <span className="stamp w-5 shrink-0 text-dust/80">{pad(index)}</span>

      <Thumbnail
        youtubeId={track.youtubeId}
        alt={title}
        className="w-14 shrink-0"
        dim={track.unplayable}
      />

      <span className="min-w-0 flex-1">
        {/* Titles and names are content, so they carry both scripts. */}
        <BiText
          value={trackTitle(track)}
          className="text-[0.98rem]"
          secondaryClassName="text-[0.82rem] text-dust/85"
        />
        {showArtist && (
          <BiText
            value={artist.name}
            className="mt-0.5 text-xs text-dust"
            secondaryClassName="text-[0.7rem] text-dust/80"
          />
        )}
        {showTags && !track.unplayable && (
          <span className="mt-1 block truncate text-[11px] text-dust/80">
            {track.moods
              .map((mood) => `${moodLabels[mood][lang]} / ${moodLabels[mood][lang === 'kn' ? 'en' : 'kn']}`)
              .join(' · ')}
          </span>
        )}
        {track.unplayable && (
          <span className={`stamp mt-0.5 block truncate text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>
            {t.playerBlocked}
          </span>
        )}
      </span>
    </>
  )

  if (track.unplayable) {
    return (
      <div className="flex min-h-[52px] w-full items-center gap-3 py-1.5 text-left text-dust/85">
        {body}
        <a
          href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t.openOnYoutube}: ${title}`}
          className="shrink-0 text-dust transition-colors hover:text-dial"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 17L17 7M9 7h8v8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </a>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => play(artist, track)}
      aria-pressed={active}
      className={`group flex min-h-[52px] w-full items-center gap-3 py-1.5 text-left transition-colors ${
        active ? 'text-dial' : 'text-label/90 hover:text-dial'
      }`}
    >
      {body}

      <span className="shrink-0">
        {active ? (
          <TapeReel spinning={spinning} size={17} />
        ) : (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-dust/75 transition-colors group-hover:text-dial"
          >
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        )}
      </span>
    </button>
  )
}
