import type { QueueItem, ResolvedCredit } from '../data/artists'
import { songTitle } from '../data/artists'
import { moodLabels } from '../data/taxonomy'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'
import { TapeReel } from './TapeReel'
import { BiText } from './Bilingual'
import { Thumbnail } from './Thumbnail'

const pad = (n: number) => String(n + 1).padStart(2, '0')

/**
 * One song. Shared by the artist card, the artist page and the song list so a
 * song behaves identically wherever it appears.
 *
 * A song marked `unplayable` still renders, because it is still part of the
 * roster and the artists still deserve the credit, but it is not a button:
 * there is nothing to tap and nothing to queue, only a link out to YouTube.
 */
export function TrackRow({
  item,
  index,
  showArtist = false,
  showTags = false,
}: {
  item: QueueItem
  index: number
  showArtist?: boolean
  /** Show mood tags. Useful on the song list, noise on an artist page. */
  showTags?: boolean
}) {
  const { t, kn, lang } = useLanguage()
  const { nowPlaying, status, play } = usePlayer()

  const { song } = item
  const active = nowPlaying?.key === item.key
  const spinning = active && status === 'playing'
  const title = kn ? (song.titleKn ?? song.title) : song.title

  const body = (
    <>
      <span className="stamp w-5 shrink-0 text-dust/80">{pad(index)}</span>

      <Thumbnail
        youtubeId={song.youtubeId}
        alt={title}
        className="w-14 shrink-0"
        dim={song.unplayable}
      />

      <span className="min-w-0 flex-1">
        {/* Titles and names are content, so they carry both scripts. */}
        <BiText
          value={songTitle(song)}
          className="text-[0.98rem]"
          secondaryClassName="text-[0.82rem] text-dust/85"
        />
        {showArtist && (
          <>
            <BiText
              value={item.billing}
              className="mt-0.5 text-xs text-dust"
              secondaryClassName="text-[0.7rem] text-dust/80"
            />
            {/* Everyone else on the record, on their own line. A song with four
                names is common here and the old shape showed one of them. */}
            <SupportingCredits credits={item.credits} />
          </>
        )}
        {showTags && !song.unplayable && (
          <span className="mt-1 block truncate text-[11px] text-dust/80">
            {song.moods
              .map((mood) => `${moodLabels[mood][lang]} / ${moodLabels[mood][lang === 'kn' ? 'en' : 'kn']}`)
              .join(' · ')}
          </span>
        )}
        {song.unplayable && (
          <span className={`stamp mt-0.5 block truncate text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>
            {t.playerBlocked}
          </span>
        )}
      </span>
    </>
  )

  if (song.unplayable) {
    return (
      <div className="flex min-h-[52px] w-full items-center gap-3 py-1.5 text-left text-dust/85">
        {body}
        <a
          href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
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
      onClick={() => play(item)}
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

/**
 * The names after the billed lead: featured singers, collaborators, whoever
 * wrote the words. Renders nothing when there is nobody, which is most songs.
 */
function SupportingCredits({ credits }: { credits: ResolvedCredit[] }) {
  const { t, kn, lang } = useLanguage()
  const rest = credits.filter((credit) => credit.role !== 'lead')
  if (!rest.length) return null

  const label: Record<Exclude<ResolvedCredit['role'], 'lead'>, string> = {
    featured: t.creditFeatured,
    with: t.creditWith,
    words: t.creditWords,
    music: t.creditMusic,
  }

  return (
    <span className={`mt-0.5 block truncate text-[11px] text-dust/80 ${kn ? 'kn' : ''}`}>
      {rest
        .map((credit) => `${label[credit.role as keyof typeof label]} ${credit.artist.name[lang]}`)
        .join(' · ')}
    </span>
  )
}
