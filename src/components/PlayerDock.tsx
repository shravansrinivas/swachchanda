import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  artistProfiles,
  platformLabels,
  profileLabels,
  songLinks,
  songTitle,
  type Bilingual,
} from '../data/artists'
import { enterEkanthaFullscreen } from '../lib/fullscreen'
import { useLanguage } from '../lib/language'
import { usePlayer } from '../lib/player'
import { useConnection } from '../lib/useConnection'
import { BiText } from './Bilingual'
import { CassetteBody, CassetteReel } from './Cassette'
import { EkanthaIcon } from './EkanthaIcon'
import { MoodRow } from './MoodRow'
import { QueueList } from './QueueList'
import { TapeJam } from './TapeJam'
import { SeekBar, TapeStats } from './TapeStats'
import { clock } from '../lib/clock'

/**
 * The deck. Pinned to the foot of every page and never unmounted, so playback
 * continues across navigation.
 *
 * Present even before anything plays: a cued cassette with a play button. That
 * is the "direct and easily accessible" part; you land anywhere on the site and
 * the transport is already under your thumb.
 */
export function PlayerDock() {
  const { t, kn } = useLanguage()
  const {
    nowPlaying,
    status,
    progress,
    currentTime,
    duration,
    embedBlocked,
    toggle,
    stop,
    next,
    previous,
    startFromTop,
  } = usePlayer()

  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const playing = status === 'playing'
  const failed = status === 'error'
  const song = nowPlaying?.song

  const title = song ? songTitle(song) : { en: t.idleLabel, kn: t.idleLabel }

  useEffect(() => {
    if (!expanded) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [expanded])

  const statusLine = failed
    ? embedBlocked
      ? t.playerBlocked
      : t.playerError
    : status === 'loading'
      ? t.loading
      : nowPlaying
        ? t.nowPlaying
        : t.sideA

  return (
    <>
      {expanded && <ExpandedDeck onClose={() => setExpanded(false)} statusLine={statusLine} />}

      {/* The whole pane opens the deck, not just the cassette, and the handler
          sits on the full-bleed strip rather than on the centred row inside it:
          on a wide window the row stops at 860px and everything either side of
          it looked dead. Controls that do something else mark themselves with
          data-dock-control and are skipped here. */}
      <div
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('[data-dock-control]')) return
          setExpanded(true)
        }}
        className="fixed inset-x-0 bottom-0 z-50 cursor-pointer border-t border-dial/25 bg-deck/95 backdrop-blur-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        role="region"
        aria-label={t.nowPlaying}
      >
        <div aria-hidden="true" className="h-[2px] w-full bg-dust/15">
          <div
            className="h-full bg-dial transition-[width] duration-500 ease-linear"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-[860px] items-center gap-2 px-3 py-2">
          {/* The minimised deck is a small cassette rather than a media row:
              a shell with a reel at each end and a paper label between them. */}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={t.expandPlayer}
            title={t.expandPlayer}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-[4px] border border-dust/20 bg-tape/50 py-1 pr-2 pl-1.5 text-left transition-colors hover:border-dial/40"
          >
            <span className="shrink-0 text-dial">
              <CassetteReel wound={1 - progress} playing={playing} size={22} />
            </span>

            <span className="flex min-w-0 flex-1 items-center gap-2 rounded-[2px] bg-label/92 px-2 py-1">
              {song && (
                <span className="hidden shrink-0 -rotate-2 rounded-[1px] bg-white p-[2px] shadow-[0_2px_5px_-1px_rgb(0_0_0/0.4)] min-[380px]:block">
                  <img
                    src={`https://i.ytimg.com/vi/${song.youtubeId}/mqdefault.jpg`}
                    alt=""
                    aria-hidden="true"
                    className="block h-7 w-7 rounded-[1px] object-cover"
                  />
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="hand block truncate text-[0.98rem] font-bold leading-tight">
                  {title.en}
                </span>
                {/* The artist, which the minimised deck used to leave out. */}
                <span className="hand hand-second block truncate text-[0.78rem] leading-tight">
                  {nowPlaying ? nowPlaying.billing.en : statusLine}
                </span>
              </span>

              {/* Room permitting, the clock. */}
              {nowPlaying && (
                <span className="hidden shrink-0 font-mono text-[10px] text-tape/70 tabular-nums sm:block">
                  {clock(currentTime, true)} / {clock(duration, duration > 0)}
                </span>
              )}
            </span>

            <span className="hidden shrink-0 text-dial/70 min-[420px]:block">
              <CassetteReel wound={progress} playing={playing} size={22} />
            </span>
          </button>

          <div data-dock-control className="flex shrink-0 items-center gap-0.5">
            {/* Shuffle steps out of the minimised bar on a narrow phone. Six
                controls left the cassette label truncated to two letters, and
                of the six this is the one that is a standing preference rather
                than something you reach for mid-song. It is still in the
                expanded deck, one tap away. */}
            <span className="hidden min-[420px]:block">
              <ShuffleButton />
            </span>
            <TransportButton label={t.previous} onClick={previous} disabled={!nowPlaying} size="sm">
              <path d="M7 6v12M18 6l-8 6 8 6z" fill="currentColor" />
            </TransportButton>

            {failed ? (
              <a
                href={`https://www.youtube.com/watch?v=${song?.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border border-dial/50 px-3 py-2 font-mono text-[11px] leading-tight text-dial transition-colors hover:bg-dial hover:text-tape ${kn ? 'kn' : ''}`}
              >
                {t.openOnYoutube}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => (nowPlaying ? toggle() : startFromTop())}
                aria-label={playing ? t.pause : t.play}
                title={playing ? t.pause : t.play}
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-dial/40 text-dial transition-colors hover:bg-dial/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  {playing ? (
                    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
                  ) : (
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  )}
                </svg>
              </button>
            )}

            <TransportButton label={t.next} onClick={next} disabled={!nowPlaying} size="sm">
              <path d="M17 6v12M6 6l8 6-8 6z" fill="currentColor" />
            </TransportButton>
          </div>

          {nowPlaying && (
            <button
              data-dock-control
              type="button"
              onClick={stop}
              aria-label={t.close}
              title={t.close}
              className="grid h-9 w-6 shrink-0 place-items-center text-dust transition-colors hover:text-label"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {/* Ekantha, at the far right and in amber, the same as in the header:
              the one control down here that is an invitation rather than a
              transport. It keeps its own end of the bar instead of sitting in
              the middle of the transport, where it read as another skip button.
              The name appears once there is room for it. */}
          <button
            data-dock-control
            type="button"
            onClick={() => {
              enterEkanthaFullscreen()
              navigate('/ekantha')
            }}
            aria-label={t.ekanthaEnter}
            title={t.ekanthaEnter}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-dial/50 bg-dial/10 px-2.5 text-dial transition-colors hover:bg-dial hover:text-tape"
          >
            <EkanthaIcon size={15} />
            <span className={`hidden text-sm leading-none sm:block ${kn ? 'kn' : 'font-display'}`}>
              {t.ekanthaName}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

function ShuffleButton({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const { t } = useLanguage()
  const { shuffleOn, toggleShuffle } = usePlayer()

  const box = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  const glyph = size === 'sm' ? 15 : 18

  return (
    <button
      type="button"
      onClick={toggleShuffle}
      aria-pressed={shuffleOn}
      aria-label={shuffleOn ? t.shuffleOff : t.shuffleOn}
      title={shuffleOn ? t.shuffleOff : t.shuffleOn}
      className={`grid ${box} shrink-0 place-items-center rounded-full transition-colors ${
        shuffleOn ? 'bg-dial/15 text-dial' : 'text-dust hover:text-dial'
      }`}
    >
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5" />
      </svg>
    </button>
  )
}

function TransportButton({
  label,
  onClick,
  disabled,
  size = 'md',
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
  children: React.ReactNode
}) {
  const box = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  const glyph = size === 'sm' ? 15 : 18
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid ${box} shrink-0 place-items-center rounded-full text-dust transition-colors hover:text-dial disabled:opacity-30 disabled:hover:text-dust`}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 24 24" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}

/**
 * The open deck.
 *
 * Two columns from `sm` up: what is playing on the left, the tape and its
 * transport on the right. Stacked it ran most of a tall screen for six
 * controls; side by side it is about half the height and the reels sit next to
 * the buttons that drive them. On a phone it stacks, tape first.
 *
 * The mood row lives in here too, so changing direction does not mean closing
 * the player and going to find a page.
 */
function ExpandedDeck({ onClose, statusLine }: { onClose: () => void; statusLine: string }) {
  const { t, kn, lang } = useLanguage()
  const navigate = useNavigate()
  const {
    nowPlaying,
    status,
    progress,
    toggle,
    next,
    previous,
    startFromTop,
    seekBy,
    index,
    playOrder,
    play,
  } = usePlayer()

  const playing = status === 'playing'
  const artist = nowPlaying?.artist
  const song = nowPlaying?.song

  const title: Bilingual = song ? songTitle(song) : { en: t.idleLabel, kn: t.idleLabel }
  // Every billed name, not just the first: this is the one place with room.
  const artistName: Bilingual = nowPlaying?.billing ?? { en: t.idleHint, kn: t.idleHint }

  const { offline, jammed } = useConnection()

  return (
    <div
      className="fixed inset-0 z-60 flex flex-col justify-end bg-tape/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={t.nowPlaying}
    >
      <button
        type="button"
        aria-label={t.collapsePlayer}
        onClick={onClose}
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
      />

      <div className="grain animate-[player-rise_320ms_cubic-bezier(0.22,1,0.36,1)] relative max-h-[92svh] overflow-y-auto rounded-t-xl border-t border-dust/20 bg-tape/80 px-5 pt-3 pb-7 backdrop-blur-xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-dust/30" />

        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-[minmax(0,1fr)_380px] sm:items-start sm:gap-8 lg:grid-cols-[minmax(0,1fr)_380px_minmax(240px,300px)] lg:items-stretch">
          {/* Tape and transport. First in the DOM so a phone meets it first. */}
          <div className="sm:order-2">
            {jammed ? (
              <TapeJam
                title={offline ? t.offlineTitle : t.stalledTitle}
                body={offline ? t.offlineBody : t.stalledBody}
                onRetry={
                  !offline && nowPlaying
                    ? () => play(nowPlaying)
                    : undefined
                }
                retryLabel={t.retry}
              />
            ) : (
              <CassetteBody
                progress={progress}
                playing={playing}
                side={statusLine}
                title={title}
                artist={artistName}
                coverId={song?.youtubeId}
              />
            )}

            <SeekBar />
            <TapeStats position={index} total={playOrder.length} />

          </div>

          {/* Transport. Directly under the tape in DOM order, so on a phone it
              is the next thing you reach; from sm it drops to its own row and
              spans every column, because it drives the whole panel rather than
              just the tape. Left at the end of the DOM it sat below the queue
              and the credits, a screen and a half down. */}
          <div className="border-t border-dust/15 pt-5 sm:order-4 sm:col-span-2 sm:mt-1 lg:col-span-3">
            <div className="flex items-center justify-center gap-2">
            <ShuffleButton size="md" />

            <TransportButton
              label={t.previous}
              onClick={previous}
              disabled={!nowPlaying}
              size="sm"
            >
              <path d="M7 6v12M18 6l-8 6 8 6z" fill="currentColor" />
            </TransportButton>

            <TransportButton
              label={t.rewind}
              onClick={() => seekBy(-10)}
              disabled={!nowPlaying}
              size="sm"
            >
              <path d="M12 6l-8 6 8 6zM21 6l-8 6 8 6z" fill="currentColor" />
            </TransportButton>

            <button
              type="button"
              onClick={() => (nowPlaying ? toggle() : startFromTop())}
              aria-label={playing ? t.pause : t.play}
              title={playing ? t.pause : t.play}
              className="mx-1 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-dial/50 bg-dial/10 text-dial transition-colors hover:bg-dial hover:text-tape"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
                {playing ? (
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
                ) : (
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                )}
              </svg>
            </button>

            <TransportButton
              label={t.fastForward}
              onClick={() => seekBy(10)}
              disabled={!nowPlaying}
              size="sm"
            >
              <path d="M12 6l8 6-8 6zM3 6l8 6-8 6z" fill="currentColor" />
            </TransportButton>

            <TransportButton label={t.next} onClick={next} disabled={!nowPlaying} size="sm">
              <path d="M17 6v12M6 6l8 6-8 6z" fill="currentColor" />
            </TransportButton>

            <span aria-hidden="true" className="h-11 w-11 shrink-0" />
          </div>
          </div>

          {/* The queue, alongside the tape rather than under it.
              On lg the inner list is absolutely positioned so it contributes no
              height of its own: the row is sized by the cassette column, and the
              queue scrolls inside exactly that height. Left in flow it stretched
              the row to 60-odd songs tall and ran off the panel. */}
          <div className="relative min-h-0 sm:order-3 sm:col-span-2 lg:col-span-1 lg:self-stretch">
            <div className="max-h-[38svh] lg:absolute lg:inset-0 lg:max-h-none">
              <QueueList />
            </div>
          </div>

          {/* What is playing, and where else to hear it. */}
          <div className="sm:order-1">
            {artist && song && (
              <>
                <BiText
                  value={title}
                  className={`text-[1.5rem] leading-tight text-label ${kn ? 'kn-display' : 'font-display font-medium tracking-[-0.02em]'}`}
                  secondaryClassName="text-[1.05rem] text-dust"
                />

                <Link
                  to={`/artists/${artist.id}`}
                  onClick={onClose}
                  className={`mt-2 inline-block text-[1.05rem] text-dial transition-colors hover:text-label ${kn ? 'kn-display' : 'font-display'}`}
                >
                  {artist.name[lang]} &rarr;
                </Link>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className={`stamp text-dust/80 ${kn ? 'kn tracking-normal' : ''}`}>
                    {t.listenOn}
                  </span>
                  {songLinks(song).map(({ platform, url, exact }) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className={`font-mono text-xs underline decoration-verdigris/40 underline-offset-[3px] transition-colors hover:text-dial ${
                        exact ? 'text-verdigris' : 'text-verdigris/60'
                      }`}
                    >
                      {platformLabels[platform]}
                    </a>
                  ))}
                </div>

                {artistProfiles(artist).length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
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
              </>
            )}

            {/* Change direction without leaving the player. */}
            <div className="mt-6 border-t border-dust/15 pt-4">
              <MoodRow label={t.moodsLabel} />
            </div>


            {/* Ekantha is offered here too. Someone with the deck open has
                already said they came to listen, which is the moment the
                quieter room is most worth pointing at, and the alternative was
                closing the player to go and find it in the header. */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => {
                  enterEkanthaFullscreen()
                  onClose()
                  navigate('/ekantha')
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full border border-dial/50 bg-dial/10 py-2.5 text-sm text-dial transition-colors hover:bg-dial hover:text-tape ${kn ? 'kn' : 'font-display'}`}
              >
                <EkanthaIcon size={15} />
                {t.ekanthaEnter}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 rounded-full border border-dust/25 py-2.5 text-sm text-dust transition-colors hover:border-dial hover:text-dial ${kn ? 'kn' : ''}`}
              >
                {t.collapsePlayer}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
