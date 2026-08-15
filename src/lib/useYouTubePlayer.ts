import { useCallback, useEffect, useRef, useState } from 'react'
import type { QueueItem, Song } from '../data/artists'

/**
 * In-page playback via the YouTube IFrame Player API.
 *
 * The video element is real but visually hidden, we only ever surface the
 * audio plus our own now-playing bar. It's parked at 300x170 inside the
 * viewport rather than display:none or off-screen, because browsers throttle
 * or refuse playback for media they consider invisible.
 *
 * The host div is created outside React on purpose: YT.Player *replaces* the
 * element it's given with an iframe, which breaks React's reconciliation if
 * React owns that node.
 */

interface YTPlayer {
  loadVideoById(id: string): void
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getDuration(): number
  /** 0..1 of the video downloaded so far. Drives the buffer bar. */
  getVideoLoadedFraction(): number
  /** e.g. "hd720", "medium". Real value from YouTube, not a guess. */
  getPlaybackQuality(): string
  destroy(): void
}

interface YTNamespace {
  Player: new (el: HTMLElement, options: Record<string, unknown>) => YTPlayer
}

declare global {
  interface Window {
    YT?: YTNamespace & { loaded?: number }
    onYouTubeIframeAPIReady?: () => void
  }
}

/** YT.PlayerState, inlined so we don't need the API loaded to read them. */
const ENDED = 0
const PLAYING = 1
const PAUSED = 2
const BUFFERING = 3
/**
 * The video is loaded and ready but is not going to start on its own. This is
 * what a browser's autoplay block looks like from here, so it has to clear the
 * "loading" state or the deck sits on "cueing up" forever.
 */
const CUED = 5

/** How long to wait for a requested play before assuming it was blocked. */
const PLAY_TIMEOUT_MS = 6000

/** Errors 101 and 150 both mean "the uploader disabled embedding". */
const EMBED_BLOCKED = [101, 150]

/**
 * Call a player method only if it is actually there, and never let it take the
 * page down.
 *
 * `new YT.Player()` hands back an object whose methods are installed by the
 * iframe once its handshake completes. If that iframe never loads, and in an
 * app's built-in browser it may well not, the object stays a shell: calling
 * `getDuration()` on it throws `not a function`. That throw came from the
 * polling interval, which is outside React's render path, so it took the whole
 * app down with it and left a blank page rather than a deck saying it could not
 * play. A silent failure to start is bad; a white screen is much worse.
 */
function ask<T>(player: YTPlayer | null, method: keyof YTPlayer, fallback: T): T {
  if (!player || typeof player[method] !== 'function') return fallback
  try {
    return (player[method] as () => T)()
  } catch {
    return fallback
  }
}

/** The same guard for the calls that do something rather than report something. */
function tell(player: YTPlayer | null, method: keyof YTPlayer, ...args: unknown[]): void {
  if (!player || typeof player[method] !== 'function') return
  try {
    ;(player[method] as (...a: unknown[]) => void)(...args)
  } catch {
    /* A player that cannot be driven is handled by the timeout, not by throwing. */
  }
}

let apiPromise: Promise<YTNamespace> | null = null

/** Load the IFrame API once per page, no matter how many callers ask. */
function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise<YTNamespace>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    // Don't clobber another listener if something else already registered one.
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      if (window.YT?.Player) resolve(window.YT)
      else reject(new Error('YouTube API loaded without a Player constructor'))
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-yt-api]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.ytApi = 'true'
      script.onerror = () => reject(new Error('Could not load the YouTube IFrame API'))
      document.head.appendChild(script)
    }
  })

  // A failed load shouldn't poison every later attempt.
  apiPromise.catch(() => {
    apiPromise = null
  })

  return apiPromise
}

function createHost(): HTMLDivElement {
  const host = document.createElement('div')
  const mount = document.createElement('div')
  Object.assign(host.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '300px',
    height: '170px',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '0',
  } satisfies Partial<CSSStyleDeclaration>)
  host.setAttribute('aria-hidden', 'true')
  host.appendChild(mount)
  document.body.appendChild(host)
  return host
}

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface YouTubePlayerApi {
  nowPlaying: QueueItem | null
  status: PlayerStatus
  /** 0 to 1, for the tape path. 0 when duration is unknown. */
  progress: number
  /** Seconds elapsed, for the tape counter. */
  currentTime: number
  /** Total seconds. 0 until YouTube reports it. */
  duration: number
  /** 0 to 1 downloaded. Real figure from the API, not an estimate. */
  buffered: number
  /** YouTube's own quality label for the running stream, or null. */
  quality: string | null
  /** True when the video exists but refuses to embed, offer the outbound link. */
  embedBlocked: boolean
  /**
   * A play was asked for and nothing ever started: no PLAYING, no error, no
   * buffering. That is what a browser silently refusing to start audio looks
   * like from in here, and it is the only evidence of it there is.
   */
  startBlocked: boolean
  /** Increments each time a song runs to its end, so a caller can auto-advance. */
  endedCount: number
  play: (item: QueueItem) => void
  /**
   * Put a song on the deck without starting it: the opening suggestion, and the
   * new suggestion whenever the mood changes. Deliberately does not touch
   * requestRef, so the next press of play still goes down the normal load path.
   */
  cue: (item: QueueItem) => void
  /**
   * Has anything been put on the deck yet, this instant?
   *
   * A function over a ref rather than reading `nowPlaying`, because that is
   * state: a caller in the same effect flush still sees null and would happily
   * cue over a song another component just started.
   */
  hasCue: () => boolean
  toggle: () => void
  stop: () => void
  /** Jump to an absolute position in seconds. */
  seekTo: (seconds: number) => void
  /** Nudge by a delta, clamped to the track. Powers rewind and fast-forward. */
  seekBy: (delta: number) => void
  isCurrent: (song: Song) => boolean
}

export function useYouTubePlayer(): YouTubePlayerApi {
  const [nowPlaying, setNowPlaying] = useState<QueueItem | null>(null)
  const [status, setStatus] = useState<PlayerStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [quality, setQuality] = useState<string | null>(null)
  const [embedBlocked, setEmbedBlocked] = useState(false)
  const [startBlocked, setStartBlocked] = useState(false)
  const [endedCount, setEndedCount] = useState(0)

  const playerRef = useRef<YTPlayer | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const readyRef = useRef(false)
  /** Video queued while the player is still booting. */
  const pendingRef = useRef<string | null>(null)
  /** Latest requested key, so a slow API load can't resurrect a stale track. */
  const requestRef = useRef<string | null>(null)
  /** Set the moment anything is cued or played, ahead of the state update. */
  const cuedRef = useRef(false)

  /**
   * Fetch the IFrame API as soon as the app is alive, rather than on the first
   * tap of play.
   *
   * The old order was: tap, then fetch a script from YouTube, then build a
   * player, then start. That put a network round trip inside the gap between
   * pressing play and hearing anything, which is the gap this deck is least
   * able to explain. Asking for it at boot means the tap usually meets an API
   * that is already there.
   *
   * This loads a script; it does not create a player and does not load a video,
   * so nothing is fetched from YouTube on anyone's behalf until they press
   * play. The promise is shared and deduplicated, so the play path picks up
   * this same one rather than starting a second.
   */
  useEffect(() => {
    void loadYouTubeApi().catch(() => {})
  }, [])

  useEffect(() => {
    return () => {
      tell(playerRef.current, 'destroy')
      playerRef.current = null
      hostRef.current?.remove()
      hostRef.current = null
      readyRef.current = false
    }
  }, [])

  // If a requested play never reaches a real state, treat it as blocked rather
  // than leaving the deck reading "threading the tape" indefinitely.
  useEffect(() => {
    if (status !== 'loading') return
    const id = window.setTimeout(() => {
      setStatus((current) => {
        if (current !== 'loading') return current
        // Nothing started and nothing failed. Worth recording, because it is
        // the signature of a browser that will not let audio begin, and the
        // deck can then offer a way out instead of just looking idle.
        setStartBlocked(true)
        return 'paused'
      })
    }, PLAY_TIMEOUT_MS)
    return () => window.clearTimeout(id)
  }, [status])

  // Poll while audio is moving, and once more when it stops, so the readouts
  // settle on a final value rather than freezing a stale one.
  useEffect(() => {
    const tick = () => {
      const player = playerRef.current
      if (!player) return
      const total = ask(player, 'getDuration', 0)
      const at = ask(player, 'getCurrentTime', 0)
      setDuration(total)
      setCurrentTime(at)
      setProgress(total > 0 ? at / total : 0)
      setBuffered(ask(player, 'getVideoLoadedFraction', 0))
      setQuality(ask<string | null>(player, 'getPlaybackQuality', null))
    }

    tick()
    if (status !== 'playing') return
    const id = window.setInterval(tick, 500)
    return () => window.clearInterval(id)
  }, [status])

  const play = useCallback((item: QueueItem) => {
    // A song known not to embed never reaches the player at all. It stays
    // visible in the lists, but it is not queueable.
    const { song, key } = item
    if (song.unplayable) return

    cuedRef.current = true

    // Re-tapping the current track toggles rather than restarting it, which is
    // what a listener expects from a row they are already playing.
    //
    // It does mean `play()` is NOT idempotent: calling it with the song already
    // playing pauses that song. Never call it from a mount effect or an
    // "ensure playing" path; use `toggle()` or guard on status first.
    if (requestRef.current === key && playerRef.current && readyRef.current) {
      setStatus((current) => {
        if (current === 'playing') {
          tell(playerRef.current, 'pauseVideo')
          return 'paused'
        }
        tell(playerRef.current, 'playVideo')
        return current === 'error' ? current : 'playing'
      })
      return
    }

    requestRef.current = key
    setNowPlaying(item)
    setStatus('loading')
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setBuffered(0)
    setEmbedBlocked(false)
    setStartBlocked(false)

    void loadYouTubeApi()
      .then((YT) => {
        // A newer tap won the race while we were loading.
        if (requestRef.current !== key) return

        if (playerRef.current) {
          if (readyRef.current) tell(playerRef.current, 'loadVideoById', song.youtubeId)
          else pendingRef.current = song.youtubeId
          return
        }

        hostRef.current ??= createHost()
        const mount = hostRef.current.firstElementChild as HTMLElement

        playerRef.current = new YT.Player(mount, {
          videoId: song.youtubeId,
          playerVars: {
            enablejsapi: 1,
            playsinline: 1, // iOS Safari plays inline instead of going fullscreen
            controls: 0,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              readyRef.current = true
              const queued = pendingRef.current
              pendingRef.current = null
              if (queued) tell(playerRef.current, 'loadVideoById', queued)
              else tell(playerRef.current, 'playVideo')
            },
            onStateChange: (event: { data: number }) => {
              if (event.data === PLAYING) {
                setStatus('playing')
                setStartBlocked(false)
              }
              else if (event.data === PAUSED) setStatus('paused')
              else if (event.data === BUFFERING) setStatus('loading')
              else if (event.data === CUED) setStatus('paused')
              else if (event.data === ENDED) {
                setStatus('paused')
                setProgress(1)
                setEndedCount((n) => n + 1)
              }
            },
            onError: (event: { data: number }) => {
              setStatus('error')
              setEmbedBlocked(EMBED_BLOCKED.includes(event.data))
            },
          },
        })
      })
      .catch(() => {
        if (requestRef.current !== key) return
        setStatus('error')
      })
  }, [])

  const cue = useCallback((item: QueueItem) => {
    cuedRef.current = true
    // Cueing means the deck now holds this *and* nothing is coming out of the
    // speaker. Without the pause, changing the mood while the one autoplay
    // attempt was still in flight let the previous track start a second later,
    // playing under the newly cued song's name. Loading is left alone: the next
    // press of play loads the cued track, which is what `toggle` is for.
    if (readyRef.current) tell(playerRef.current, 'pauseVideo')
    setNowPlaying(item)
  }, [])

  const toggle = useCallback(() => {
    // A cued song is not a loaded song. Changing the mood re-cues the deck
    // without touching the player, so if the two have drifted apart, pressing
    // play has to *load* the cued track. Resuming here would silently replay
    // whatever was loaded before, which is the song the reader just moved away
    // from.
    const cued = nowPlaying
    if (cued && requestRef.current !== cued.key) {
      play(cued)
      return
    }

    const player = playerRef.current
    if (!player || !readyRef.current) return

    setStatus((current) => {
      if (current === 'playing') {
        tell(player, 'pauseVideo')
        return 'paused'
      }
      // Anything that is not playing should start playing. This used to act
      // only on 'paused' and fall through on 'loading', so after a blocked
      // autoplay the deck sat in 'loading' and pressing play did nothing at all.
      tell(player, 'playVideo')
      return current === 'error' ? current : 'playing'
    })
  }, [nowPlaying, play])

  const seekTo = useCallback((seconds: number) => {
    const player = playerRef.current
    if (!player || !readyRef.current) return
    const total = ask(player, 'getDuration', 0)
    const target = Math.min(Math.max(0, seconds), total > 0 ? total : seconds)
    tell(player, 'seekTo', target, true)
    // Update immediately so the scrubber doesn't snap back before the next poll.
    setCurrentTime(target)
    setProgress(total > 0 ? target / total : 0)
  }, [])

  const seekBy = useCallback(
    (delta: number) => {
      const player = playerRef.current
      if (!player || !readyRef.current) return
      seekTo(ask(player, 'getCurrentTime', 0) + delta)
    },
    [seekTo],
  )

  const hasCue = useCallback(() => cuedRef.current, [])

  const stop = useCallback(() => {
    tell(playerRef.current, 'stopVideo')
    requestRef.current = null
    pendingRef.current = null
    cuedRef.current = false
    setNowPlaying(null)
    setStatus('idle')
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setBuffered(0)
    setQuality(null)
    setEmbedBlocked(false)
    setStartBlocked(false)
  }, [])

  const isCurrent = useCallback(
    (song: Song) => nowPlaying?.song.id === song.id,
    [nowPlaying],
  )

  return {
    nowPlaying,
    status,
    progress,
    currentTime,
    duration,
    buffered,
    quality,
    embedBlocked,
    startBlocked,
    endedCount,
    play,
    cue,
    hasCue: hasCue,
    toggle,
    stop,
    seekTo,
    seekBy,
    isCurrent,
  }
}
