import { useEffect, useState } from 'react'
import { usePlayer } from './player'

/** How long to sit at zero buffer before calling it stuck rather than slow. */
const STALL_AFTER_MS = 9000

/**
 * Is the tape actually going to move?
 *
 * Two separate failures, both of which look identical from the sofa:
 *
 * - `offline`: the browser says there is no connection at all.
 * - `stalled`: there is a connection, the player has been asked to load, and
 *   after nine seconds nothing at all has buffered. Distinct from ordinary
 *   buffering, which resolves on its own and should not be dressed up as an
 *   error.
 *
 * `navigator.onLine` is famously optimistic: false is reliable, true only means
 * a network interface exists. That is why the stall timer exists as well; it
 * catches the captive-portal and one-bar cases that `onLine` reports as fine.
 *
 * The stalled flag is *derived* rather than cleared by hand. The effect only
 * ever records which song stalled; whether that still counts is worked out at
 * render from the live state, so recovery needs no second write.
 */
export function useConnection(): { offline: boolean; stalled: boolean; jammed: boolean } {
  const { status, buffered, nowPlaying } = usePlayer()
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)
  const [stalledKey, setStalledKey] = useState<string | null>(null)

  useEffect(() => {
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Only a load that has produced nothing counts. Anything buffered means the
  // tape is moving, however slowly.
  const waiting = status === 'loading' && buffered === 0 && Boolean(nowPlaying)
  const waitingKey = waiting ? (nowPlaying?.key ?? '') : ''

  useEffect(() => {
    if (!waiting) return
    const id = window.setTimeout(() => setStalledKey(waitingKey), STALL_AFTER_MS)
    return () => window.clearTimeout(id)
  }, [waiting, waitingKey])

  const stalled = waiting && stalledKey === waitingKey

  // Losing the connection mid-song is not a jam while the audio already
  // buffered keeps playing; replacing a working player with an error would be a
  // lie. It is a jam once playback has actually stopped.
  //
  // Note this does not also test `buffered`: getVideoLoadedFraction() reports 0
  // for long stretches of perfectly normal playback, so gating on it would mean
  // the jam either never appears or appears constantly, depending on timing.
  // Whether the player is still playing is the signal that can be trusted.
  const jammed = stalled || (offline && status !== 'playing')

  return { offline, stalled, jammed }
}
