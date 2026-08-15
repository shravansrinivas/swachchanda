/**
 * Is this an app's built-in browser rather than a real one?
 *
 * Instagram, Facebook and friends open links in a stripped-down web view. They
 * are ordinary enough for reading a page and unreliable for playing embedded
 * media: the host app decides whether audio may start, whether a gesture counts,
 * and whether youtube.com gets storage at all, and none of that is ours to set.
 * A tap on play can therefore do nothing at all, with no error to catch.
 *
 * This is only ever used to *offer a way out*, never to gate a feature. If the
 * sniff is wrong the reader loses nothing: they see one extra line suggesting a
 * browser they are already in.
 *
 * User-agent sniffing is the only signal available. It is unreliable by nature,
 * which is why the notice it drives waits for playback to have actually failed
 * before appearing.
 */
const IN_APP_MARKERS: [RegExp, string][] = [
  [/Instagram/i, 'Instagram'],
  [/FBAN|FBAV|FB_IAB/i, 'Facebook'],
  [/Threads/i, 'Threads'],
  [/Line\//i, 'LINE'],
  [/Snapchat/i, 'Snapchat'],
  [/Twitter|TwitterAndroid/i, 'X'],
  [/LinkedInApp/i, 'LinkedIn'],
]

export function inAppBrowser(): string | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  for (const [pattern, name] of IN_APP_MARKERS) {
    if (pattern.test(ua)) return name
  }
  return null
}
