/**
 * Fullscreen, for Ekantha only.
 *
 * A quiet room that still has a URL bar, a tab strip and a dock above it is not
 * quiet. On a computer the room takes the whole screen the way a video player
 * does; everywhere else this is a no-op and nothing about the page changes.
 *
 * Two constraints shape all of this. `requestFullscreen` is only granted inside
 * a real user gesture, so it has to be asked for in the click handler that
 * enters the room rather than in an effect after the route changes. And iOS
 * Safari does not implement it on elements at all, which is why every call here
 * is capability-checked and every rejection is swallowed: a browser refusing is
 * a normal outcome, not an error worth surfacing.
 */

export function canFullscreen(): boolean {
  return (
    typeof document !== 'undefined' &&
    document.fullscreenEnabled === true &&
    typeof document.documentElement.requestFullscreen === 'function'
  )
}

export function isFullscreen(): boolean {
  return typeof document !== 'undefined' && document.fullscreenElement !== null
}

/**
 * Fullscreen the whole document rather than one element, so the fixed player
 * dock and anything else outside the page tree comes along. Fullscreening the
 * room's own div would leave the deck behind it and clip it away.
 */
export function enterFullscreen(): void {
  if (!canFullscreen() || isFullscreen()) return
  void document.documentElement.requestFullscreen().catch(() => {})
}

export function exitFullscreen(): void {
  if (typeof document === 'undefined' || !document.fullscreenElement) return
  void document.exitFullscreen?.().catch(() => {})
}

/**
 * A pointing device that can hover, i.e. a computer rather than a phone.
 *
 * Deliberately not a width test: a narrow window on a laptop should still get
 * the room, and a large tablet held in the hand should not have the browser
 * chrome yanked away by a tap.
 */
export function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/**
 * Call from the click handler that navigates to /ekantha. Must be synchronous
 * inside the gesture, or the browser will refuse.
 */
export function enterEkanthaFullscreen(): void {
  if (isDesktop()) enterFullscreen()
}
