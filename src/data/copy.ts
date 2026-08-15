/**
 * Every string the page renders, in both scripts. Nothing user-facing is
 * hardcoded in a component, if you find yourself typing a sentence in a
 * .tsx file, it belongs here instead.
 *
 * On the Kannada: it is written to be *spoken*, not translated. Where a literal
 * rendering of the English would read like a manual ("ಆಲಿಸುವ ಕೋಣೆ" for
 * "listening room"), the Kannada says the thing its own way instead, so the two
 * columns drift apart on purpose, they are not line-for-line equivalents.
 * Verb endings lean colloquial (ಬರೀತಾರೆ, ಕೇಳ್ತೀನಿ, ಸಿಗುತ್ತೆ) because this is a
 * mixtape, not a government form.
 */

import type { Bilingual } from './artists'

/**
 * A count, rounded down to the nearest five and marked with a plus when there
 * is a remainder.
 *
 * Every figure on the site is computed from the roster, never typed in, so
 * these move on their own as songs are added. Nearest five rather than nearest
 * ten because at ten the number sat still through a dozen additions and read
 * like a slogan; at five it visibly tracks the tape. Rounding *down* keeps the
 * claim true, and the plus disappears on an exact multiple so "65 songs" is
 * only ever shown when there are exactly 65.
 */
function countLabel(n: number): string {
  if (n <= 5) return String(n)
  const floored = Math.floor(n / 5) * 5
  return floored === n ? String(n) : `${floored}+`
}

/** Edit these and the footer, call-out and about page all follow. */
export const BUILT_BY = 'Shravan Srinivas'
export const BUILT_ON: Bilingual = { kn: '೧೫ ಆಗಸ್ಟ್ ೨೦೨೬', en: '15 August 2026' }
export const INSTAGRAM_HANDLE = 'shravan.fm'
export const CONTACT_EMAIL = 'shravangs@pm.me'
/** Verified to resolve before being linked. */
export const GITHUB_URL = 'https://github.com/shravansrinivas/swachchanda'

export const instagramUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`
export const mailtoUrl =
  `mailto:${CONTACT_EMAIL}` +
  `?subject=${encodeURIComponent('Swachchanda, a song you should add')}` +
  `&body=${encodeURIComponent('Artist:\nSong:\nWhere I heard it:\n\n')}`

/**
 * Feedback goes to the same inbox but arrives with its own subject, so a note
 * about a wrong credit does not land in the same thread as song suggestions.
 * The body is left open on purpose: prompting for fields would turn an offhand
 * "this reads oddly on my phone" into paperwork, and that is exactly the kind
 * of remark most worth getting.
 */
export const feedbackMailtoUrl =
  `mailto:${CONTACT_EMAIL}` + `?subject=${encodeURIComponent('Swachchanda, feedback')}`

export interface Copy {
  /** Toggle */
  langToggleLabel: string
  langComingSoon: string

  /** Hero */
  siteName: string
  siteNameAlt: string
  /** Small gloss above the wordmark, what the word actually means. */
  nameGloss: string
  tagline: string

  /** Navigation + page chrome */
  navHome: string
  navArtists: string
  navSongs: string
  navAbout: string
  navCredits: string
  back: string
  songsHeading: string
  songsIntro: string
  creditsHeading: string
  creditsIntro: string
  aboutHeading: string
  /** The 15 August framing. Used on the home screen, about page and footer. */
  independenceLine: string
  independenceBody: string
  artistTrackCount: (n: number) => string
  rosterMeta: (tracks: number, artists: number) => string

  /** Filters */
  filterHeading: string
  genresLabel: string
  moodsLabel: string
  clearFilters: string
  filtersButton: string
  filtersMore: string
  filtersApplied: (n: number) => string
  filtersDone: string
  filterResults: (n: number) => string
  noResults: string
  familyMode: string
  familyModeNote: (safe: number, total: number) => string
  playFiltered: string
  /** Home screen */
  ctaStart: string
  ctaResume: string
  ctaPickMood: string
  ctaBlocked: string
  ctaAnyMood: string
  searchPlaceholder: string
  searchClear: string
  /** The A to Z rail down the right edge of a long list. */
  alphabetLabel: string
  jumpToLetter: (letter: string) => string
  sortLabel: string
  sortRoster: string
  sortTitle: string
  sortArtist: string

  /** Player */
  nowPlaying: string
  play: string
  pause: string
  next: string
  previous: string
  shuffle: string
  shuffleOn: string
  shuffleOff: string
  rewind: string
  fastForward: string
  seekLabel: string
  statsElapsed: string
  statsRemaining: string
  statsQuality: string
  statsBuffer: string
  statsPosition: string
  statsUnknown: string
  upNext: string
  queueHeading: string
  offlineTitle: string
  offlineBody: string
  stalledTitle: string
  stalledBody: string
  retry: string
  queueRemove: string
  queueUp: string
  queueDown: string
  queueReset: string
  queueDrag: string
  ekanthaName: string
  ekanthaNameAlt: string
  ekanthaTagline: string
  ekanthaWhat: string
  ekanthaEnter: string
  ekanthaLeave: string
  fullscreenEnter: string
  fullscreenExit: string
  /** Why the queue cannot be reordered while shuffle is on. */
  queueShuffled: string
  feedbackLine: string
  feedbackAction: string
  /** Credit roles, shown before a name on a song row. */
  creditFeatured: string
  creditWith: string
  creditWords: string
  creditMusic: string
  expandPlayer: string
  collapsePlayer: string
  /** Shown on the cassette label before anything has been played. */
  idleLabel: string
  idleHint: string
  close: string
  /** The uploader disabled embedding (YouTube error 101/150). */
  playerBlocked: string
  /** Anything else: network, API failure, removed video. */
  playerError: string
  /** An app's built-in browser refusing to start audio. */
  inAppTitle: string
  inAppBody: (app: string) => string
  openOnYoutube: string
  loading: string
  /** The same state on the minimised bar, where the label truncates at ~12 characters. */
  loadingShort: string
  sideA: string
  sideB: string

  /** Artist cards */
  alsoCreditedHeading: string
  alsoCreditedNote: string
  tracksLabel: string
  listenOn: string
  searchSuffix: string

  /** Call-out */
  calloutHeading: string
  calloutBody: string
  calloutInstagram: string
  calloutEmail: string
  calloutGithub: string
  noResultsAction: string
  suggestHeading: string

  /** Credits + footer */
  siteCreditsHeading: string
  builtBy: (name: string, date: string) => string
  sourceNote: string
  artistCreditsHeading: string
  artistCreditsBody: string
  featuredArtistsLabel: string
  photoCreditsHeading: string
  photoBy: (name: string) => string
  /** Same idea as photoBy, but the name is a link so it can't be interpolated. */
  photoByPrefix: string
  onUnsplash: string
}

const en: Copy = {
  langToggleLabel: 'Read this in Kannada',
  langComingSoon: 'Kannada coming soon',

  siteName: 'Swachchanda',
  siteNameAlt: 'ಸ್ವಚ್ಛಂದ',
  nameGloss: 'ಸ್ವಚ್ಛಂದ: free, unbound, of its own will',
  tagline: 'A listening room for independent Kannada music.',
  navHome: 'Home',
  navArtists: 'Artists',
  navSongs: 'Songs',
  navAbout: 'About',
  navCredits: 'Credits',
  back: 'Back',
  songsHeading: 'Every song',
  songsIntro:
    'The whole tape, end to end. Tap any line and it plays; the deck at the foot of the screen keeps going as you move around the site.',
  creditsHeading: 'Credits',
  creditsIntro:
    'Nothing here was made alone. The music, the photographs, the playlists that pointed the way, the tools that built the page, all of it belongs to someone, and all of them are named below.',
  aboutHeading: 'About',
  independenceLine: 'Made on 15 August 2026, India’s 80th Independence Day.',
  independenceBody:
    'The word swachchanda means free, unbound, moving of its own will. Every artist on this page makes music outside the film industry that would otherwise have carried it, on their own money and their own terms. Putting it together on Independence Day was not a coincidence; it is the whole argument, in one word and one date.',
  artistTrackCount: (n) => (n === 1 ? '1 song' : `${n} songs`),
  rosterMeta: (tracks, artistCount) =>
    `${countLabel(tracks)} songs from ${countLabel(artistCount)} artists and bands, always growing`,

  filterHeading: 'Pick a mood',
  genresLabel: 'Sound',
  moodsLabel: 'Mood',
  clearFilters: 'Clear',
  filtersButton: 'Filter',
  filtersMore: 'More',
  filtersApplied: (n) => (n === 1 ? '1 filter' : `${n} filters`),
  filtersDone: 'Show songs',
  filterResults: (n) => (n === 1 ? '1 song' : `${n} songs`),
  noResults: 'Nothing here matches that yet. Loosen a filter, clear the search, or tell me what is missing.',
  familyMode: 'Family listening',
  familyModeNote: (safe, total) =>
    `Shows only the ${safe} of ${total} songs marked safe to play out loud around anyone. Short on purpose, a song missing from it hasn't been judged, only unchecked.`,
  playFiltered: 'Play this set',
  ctaStart: 'Start the tape',
  ctaResume: 'Keep playing',
  ctaPickMood: 'or pick a mood',
  ctaBlocked: 'Press play to begin',
  ctaAnyMood: 'Anything',
  searchPlaceholder: 'Search a song or an artist',
  searchClear: 'Clear search',
  alphabetLabel: 'Jump to a letter',
  jumpToLetter: (letter) => `Jump to ${letter}`,
  sortLabel: 'Order',
  sortRoster: 'Tape order',
  sortTitle: 'Title',
  sortArtist: 'Artist',

  nowPlaying: 'Now playing',
  play: 'Play',
  pause: 'Pause',
  next: 'Next song',
  previous: 'Previous song',
  shuffle: 'Shuffle',
  shuffleOn: 'Shuffle on',
  shuffleOff: 'Shuffle off',
  rewind: 'Rewind ten seconds',
  fastForward: 'Forward ten seconds',
  seekLabel: 'Seek within the song',
  statsElapsed: 'Elapsed',
  statsRemaining: 'Left',
  statsQuality: 'Stream',
  statsBuffer: 'Buffer',
  statsPosition: 'Track',
  statsUnknown: '--',
  upNext: 'Up next',
  queueHeading: 'On this tape',
  offlineTitle: 'The tape is stuck',
  offlineBody: 'No connection. Nothing can load until you are back online; the deck will pick up where it left off.',
  stalledTitle: 'The tape is stuck',
  stalledBody: 'The connection is too slow to buffer anything. Give it a moment, or try again.',
  retry: 'Try again',
  queueRemove: 'Take off this tape',
  queueUp: 'Move earlier',
  queueDown: 'Move later',
  queueReset: 'Restore the full tape',
  queueDrag: 'Drag to reorder',
  ekanthaName: 'Ekantha',
  ekanthaNameAlt: 'ಏಕಾಂತ',
  ekanthaTagline: 'One tape, nothing else.',
  ekanthaWhat:
    'A quieter room inside this one. The tape, the words on it, and the controls. No lists, no menus, no counting. Leave whenever you like; the song keeps playing either way.',
  ekanthaEnter: 'Enter Ekantha',
  ekanthaLeave: 'Back to the site',
  fullscreenEnter: 'Fill the screen',
  fullscreenExit: 'Leave full screen',
  queueShuffled: 'Shuffled, so there is no order to hold. Turn shuffle off to arrange it.',
  feedbackLine:
    'Feedback of any kind, and corrections most of all. A misspelt name, a wrong credit, a song that should not be here, a page that reads badly on your phone. Tell me and I will fix it.',
  feedbackAction: 'Send feedback',
  creditFeatured: 'ft.',
  creditWith: 'with',
  creditWords: 'words',
  creditMusic: 'music',
  expandPlayer: 'Open the tape',
  collapsePlayer: 'Close the tape',
  idleLabel: 'Nothing queued',
  idleHint: 'Press play to start from the top',
  close: 'Stop and close player',
  playerBlocked: "Can't be played here",
  playerError: "Couldn't load that one",
  inAppTitle: 'This browser will not start the tape',
  inAppBody: (app) =>
    `${app} opens links in its own cut-down browser, and that browser often refuses to play embedded audio. Open this page in Chrome, Safari or Firefox and it will play. The song itself is fine.`,
  openOnYoutube: 'Open on YouTube',
  loading: 'Threading the tape',
  loadingShort: 'Spooling up',
  sideA: 'Side A',
  sideB: 'Side B',

  alsoCreditedHeading: 'Also credited',
  alsoCreditedNote:
    'Singers, players and writers credited on a song here without a page of their own yet. Tap a name to see what they are on.',
  tracksLabel: 'Tracks',
  listenOn: 'Also on',
  searchSuffix: 'search',

  calloutHeading: 'Know a song this is missing?',
  calloutBody:
    'This list is short on purpose. It grows the way a mixtape does, someone tells you about a song, and you go find it. If there is a Kannada indie artist who belongs here, send them over. Every suggestion gets listened to properly.',
  calloutInstagram: 'DM on Instagram',
  calloutEmail: 'Send an email',
  calloutGithub: 'Source on GitHub',
  noResultsAction: 'Suggest a song',
  suggestHeading: 'Missing something?',

  siteCreditsHeading: 'About this page',
  builtBy: (name, date) => `Built by ${name}, ${date}.`,
  sourceNote:
    'No accounts, nothing you do here is stored by me. Google Analytics counts visits so I know whether any of this is worth continuing, and YouTube sets its own cookies when a song plays.',
  artistCreditsHeading: 'The music is not mine',
  artistCreditsBody:
    'Every song here belongs to the artist who wrote it and the label that released it. This page hosts no audio and redistributes none, it plays official uploads through YouTube, and links out to the places the artists actually get paid. Nothing here was made by me except the page around it. If you are one of these artists and want your work taken down, or credited differently, write to me and it is done the same day.',
  featuredArtistsLabel: 'Featured on this page, with thanks',
  photoCreditsHeading: 'Photographs',
  photoBy: (name) => `Photo by ${name}`,
  photoByPrefix: 'Photo by ',
  onUnsplash: 'on Unsplash',
}

const kn: Copy = {
  langToggleLabel: 'Read this in English',
  langComingSoon: 'ಕನ್ನಡ ಶೀಘ್ರದಲ್ಲೇ',

  siteName: 'ಸ್ವಚ್ಛಂದ',
  siteNameAlt: 'Swachchanda',
  nameGloss: 'ಸ್ವಚ್ಛಂದ: ಯಾರ ಹಂಗೂ ಇಲ್ಲದೆ, ತನ್ನಿಷ್ಟದಂತೆ',
  tagline: 'ಕನ್ನಡದ ಸ್ವತಂತ್ರ ಹಾಡುಗಳನ್ನು ಕೂತು ಕೇಳೋಕೆ ಒಂದು ಜಾಗ.',
  navHome: 'ಮುಖಪುಟ',
  navArtists: 'ಕಲಾವಿದರು',
  navSongs: 'ಹಾಡುಗಳು',
  navAbout: 'ಪರಿಚಯ',
  navCredits: 'ಕೃತಜ್ಞತೆ',
  back: 'ಹಿಂದೆ',
  songsHeading: 'ಎಲ್ಲಾ ಹಾಡುಗಳು',
  songsIntro:
    'ಇಡೀ ಟೇಪು, ಮೊದಲಿಂದ ಕೊನೆಯವರೆಗೆ. ಯಾವ ಸಾಲನ್ನ ಒತ್ತಿದರೂ ಹಾಡು ಶುರು. ಬೇರೆ ಪುಟಕ್ಕೆ ಹೋದರೂ ಕೆಳಗಿನ ಟೇಪು ನಿಲ್ಲಲ್ಲ.',
  creditsHeading: 'ಕೃತಜ್ಞತೆಗಳು',
  creditsIntro:
    'ಇದೆಲ್ಲ ಒಬ್ಬರಿಂದ ಆದದ್ದಲ್ಲ. ಹಾಡು, ಫೋಟೋ, ದಾರಿ ತೋರಿಸಿದ ಪಟ್ಟಿಗಳು, ಈ ಪುಟ ಕಟ್ಟಿದ ಸಾಧನಗಳು, ಎಲ್ಲಕ್ಕೂ ಒಬ್ಬೊಬ್ಬ ಒಡೆಯರಿದ್ದಾರೆ. ಎಲ್ಲರ ಹೆಸರೂ ಕೆಳಗಿದೆ.',
  aboutHeading: 'ಈ ಜಾಗದ ಪರಿಚಯ',
  independenceLine: '೧೫ ಆಗಸ್ಟ್ ೨೦೨೬, ಭಾರತದ ೮೦ನೇ ಸ್ವಾತಂತ್ರ್ಯ ದಿನದಂದು ಕಟ್ಟಿದ್ದು.',
  independenceBody:
    'ಸ್ವಚ್ಛಂದ ಅಂದರೆ ಯಾರ ಹಂಗೂ ಇಲ್ಲದೆ, ತನ್ನಿಷ್ಟದಂತೆ ಇರೋದು. ಇಲ್ಲಿನ ಪ್ರತಿಯೊಬ್ಬರೂ ಸಿನಿಮಾದ ಹೊರಗೆ, ತಮ್ಮದೇ ದುಡ್ಡು ಮತ್ತು ತಮ್ಮದೇ ಷರತ್ತಿನ ಮೇಲೆ ಸಂಗೀತ ಮಾಡುವವರು. ಸ್ವಾತಂತ್ರ್ಯ ದಿನದಂದೇ ಇದನ್ನ ಕಟ್ಟಿದ್ದು ಆಕಸ್ಮಿಕವಲ್ಲ; ಒಂದು ಪದ ಮತ್ತು ಒಂದು ದಿನಾಂಕದಲ್ಲೇ ಹೇಳಬೇಕಾದ್ದೆಲ್ಲ ಇದೆ.',
  artistTrackCount: (n) => `${n} ಹಾಡು`,
  rosterMeta: (tracks, artistCount) =>
    `${countLabel(tracks)} ಹಾಡು, ${countLabel(artistCount)} ಕಲಾವಿದರು ಮತ್ತು ಬ್ಯಾಂಡುಗಳು, ಪಟ್ಟಿ ಬೆಳೀತಾನೇ ಇದೆ`,

  filterHeading: 'ಯಾವ ಮೂಡು?',
  genresLabel: 'ಶೈಲಿ',
  moodsLabel: 'ಮೂಡು',
  clearFilters: 'ಎಲ್ಲ ತೆಗೀರಿ',
  filtersButton: 'ಸೋಸಿ',
  filtersMore: 'ಇನ್ನಷ್ಟು',
  filtersApplied: (n) => `${n} ಆಯ್ಕೆ`,
  filtersDone: 'ಹಾಡು ತೋರಿಸಿ',
  filterResults: (n) => `${n} ಹಾಡು`,
  noResults: 'ಇದಕ್ಕೆ ಸದ್ಯಕ್ಕೆ ಯಾವ ಹಾಡೂ ಇಲ್ಲ. ಒಂದು ಆಯ್ಕೆ ಕಡಿಮೆ ಮಾಡಿ, ಹುಡುಕಾಟ ಅಳಿಸಿ, ಅಥವಾ ಏನು ಬೇಕು ಅಂತ ಹೇಳಿ.',
  familyMode: 'ಮನೆಯವರ ಜೊತೆ ಕೇಳೋಕೆ',
  familyModeNote: (safe, total) =>
    `${total}ರಲ್ಲಿ ${safe} ಹಾಡು, ಯಾರ ಮುಂದೆ ಬೇಕಾದರೂ ಹಾಕಬಹುದು ಅಂತ ಗುರುತು ಹಾಕಿದವು. ಪಟ್ಟಿ ಬೇಕಂತಲೇ ಚಿಕ್ಕದು; ಇದರಲ್ಲಿ ಇಲ್ಲದ ಹಾಡು ಕೆಟ್ಟದ್ದು ಅಂತಲ್ಲ, ಇನ್ನೂ ಕೇಳಿ ನೋಡಿಲ್ಲ ಅಷ್ಟೇ.`,
  playFiltered: 'ಇಷ್ಟನ್ನೂ ಹಾಕಿ',
  ctaStart: 'ಟೇಪು ಶುರು ಮಾಡಿ',
  ctaResume: 'ಮುಂದುವರಿಸಿ',
  ctaPickMood: 'ಅಥವಾ ಮೂಡು ಆರಿಸಿ',
  ctaBlocked: 'ಶುರು ಮಾಡೋಕೆ ಒತ್ತಿ',
  ctaAnyMood: 'ಯಾವುದಾದರೂ',
  searchPlaceholder: 'ಹಾಡು ಅಥವಾ ಕಲಾವಿದರ ಹೆಸರು ಹುಡುಕಿ',
  searchClear: 'ಹುಡುಕಾಟ ಅಳಿಸಿ',
  alphabetLabel: 'ಅಕ್ಷರಕ್ಕೆ ಹೋಗಿ',
  jumpToLetter: (letter) => `${letter} ಗೆ ಹೋಗಿ`,
  sortLabel: 'ಕ್ರಮ',
  sortRoster: 'ಟೇಪಿನ ಕ್ರಮ',
  sortTitle: 'ಹಾಡಿನ ಹೆಸರು',
  sortArtist: 'ಕಲಾವಿದರು',

  nowPlaying: 'ಈಗ ಕೇಳ್ತಿರೋದು',
  play: 'ಹಾಕಿ',
  pause: 'ನಿಲ್ಲಿಸಿ',
  next: 'ಮುಂದಿನ ಹಾಡು',
  previous: 'ಹಿಂದಿನ ಹಾಡು',
  shuffle: 'ಶಫಲ್',
  shuffleOn: 'ಶಫಲ್ ಆನ್',
  shuffleOff: 'ಶಫಲ್ ಆಫ್',
  rewind: 'ಹತ್ತು ಸೆಕೆಂಡು ಹಿಂದೆ',
  fastForward: 'ಹತ್ತು ಸೆಕೆಂಡು ಮುಂದೆ',
  seekLabel: 'ಹಾಡಿನೊಳಗೆ ಸರಿಸಿ',
  statsElapsed: 'ಕಳೆದದ್ದು',
  statsRemaining: 'ಉಳಿದದ್ದು',
  statsQuality: 'ಸ್ಟ್ರೀಮ್',
  statsBuffer: 'ಬಫರ್',
  statsPosition: 'ಹಾಡು',
  statsUnknown: '--',
  upNext: 'ಮುಂದೆ',
  queueHeading: 'ಈ ಟೇಪಿನಲ್ಲಿ',
  offlineTitle: 'ಟೇಪು ಸಿಕ್ಕಿಹಾಕಿಕೊಂಡಿದೆ',
  offlineBody: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲ. ಮತ್ತೆ ಬರೋವರೆಗೂ ಏನೂ ಲೋಡ್ ಆಗಲ್ಲ; ಬಂದ ಮೇಲೆ ಎಲ್ಲಿ ನಿಂತಿತ್ತೋ ಅಲ್ಲಿಂದಲೇ ಮುಂದುವರಿಯುತ್ತೆ.',
  stalledTitle: 'ಟೇಪು ಸಿಕ್ಕಿಹಾಕಿಕೊಂಡಿದೆ',
  stalledBody: 'ಇಂಟರ್ನೆಟ್ ತುಂಬಾ ನಿಧಾನ, ಏನೂ ಬಫರ್ ಆಗ್ತಿಲ್ಲ. ಸ್ವಲ್ಪ ಕಾಯಿರಿ, ಅಥವಾ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
  queueRemove: 'ಈ ಟೇಪಿನಿಂದ ತೆಗೆಯಿರಿ',
  queueUp: 'ಮೇಲಕ್ಕೆ ಸರಿಸಿ',
  queueDown: 'ಕೆಳಕ್ಕೆ ಸರಿಸಿ',
  queueReset: 'ಇಡೀ ಟೇಪು ಮರಳಿ ತನ್ನಿ',
  queueDrag: 'ಎಳೆದು ಜೋಡಿಸಿ',
  ekanthaName: 'ಏಕಾಂತ',
  ekanthaNameAlt: 'Ekantha',
  ekanthaTagline: 'ಒಂದೇ ಟೇಪು, ಬೇರೇನೂ ಇಲ್ಲ.',
  ekanthaWhat:
    'ಇದರೊಳಗೇ ಇನ್ನಷ್ಟು ಸದ್ದಿಲ್ಲದ ಒಂದು ಕೋಣೆ. ಟೇಪು, ಅದರ ಮೇಲಿನ ಬರಹ, ಮತ್ತು ಗುಂಡಿಗಳು. ಪಟ್ಟಿ ಇಲ್ಲ, ಮೆನು ಇಲ್ಲ, ಎಣಿಕೆ ಇಲ್ಲ. ಬೇಕಾದಾಗ ಹೊರಬನ್ನಿ; ಹಾಡು ಹಾಗೇ ನಡೀತಿರುತ್ತೆ.',
  ekanthaEnter: 'ಏಕಾಂತಕ್ಕೆ ಹೋಗಿ',
  ekanthaLeave: 'ಸೈಟಿಗೆ ವಾಪಸ್',
  fullscreenEnter: 'ಪೂರ್ತಿ ಪರದೆ',
  fullscreenExit: 'ಪೂರ್ತಿ ಪರದೆಯಿಂದ ಹೊರಗೆ',
  queueShuffled: 'ಶಫಲ್ ಆನ್ ಇದೆ, ಹಾಗಾಗಿ ಹಿಡಿದಿಡೋಕೆ ಕ್ರಮ ಇಲ್ಲ. ಜೋಡಿಸಬೇಕಾದರೆ ಶಫಲ್ ಆಫ್ ಮಾಡಿ.',
  feedbackLine:
    'ಯಾವ ಅನಿಸಿಕೆಯಾದರೂ ಸರಿ, ತಿದ್ದುಪಡಿಯಾದರೆ ಇನ್ನೂ ಒಳ್ಳೇದು. ಹೆಸರಿನ ಕಾಗುಣಿತ, ತಪ್ಪು ಕ್ರೆಡಿಟ್, ಇಲ್ಲಿ ಇರಬಾರದ ಹಾಡು, ಫೋನಿನಲ್ಲಿ ಸರಿಯಾಗಿ ಕಾಣದ ಪುಟ. ಹೇಳಿ, ಸರಿ ಮಾಡ್ತೀನಿ.',
  feedbackAction: 'ಅನಿಸಿಕೆ ಕಳಿಸಿ',
  creditFeatured: 'ಜೊತೆಗೆ',
  creditWith: 'ಜೊತೆ',
  creditWords: 'ಸಾಹಿತ್ಯ',
  creditMusic: 'ಸಂಗೀತ',
  expandPlayer: 'ಟೇಪು ತೆರೆಯಿರಿ',
  collapsePlayer: 'ಟೇಪು ಮುಚ್ಚಿ',
  idleLabel: 'ಏನೂ ಹಾಕಿಲ್ಲ',
  idleHint: 'ಮೊದಲಿಂದ ಶುರು ಮಾಡೋಕೆ ಒತ್ತಿ',
  close: 'ನಿಲ್ಲಿಸಿ ಮುಚ್ಚಿ',
  playerBlocked: 'ಇದನ್ನ ಇಲ್ಲಿ ಹಾಕೋಕೆ ಆಗಲ್ಲ',
  playerError: 'ಇದು ಬರಲಿಲ್ಲ',
  inAppTitle: 'ಈ ಬ್ರೌಸರಿನಲ್ಲಿ ಟೇಪು ಶುರುವಾಗಲ್ಲ',
  inAppBody: (app) =>
    `${app} ಕೊಂಡಿಗಳನ್ನ ತನ್ನದೇ ಸಣ್ಣ ಬ್ರೌಸರಿನಲ್ಲಿ ತೆರೀತದೆ, ಅದು ಒಳಗಿನ ಆಡಿಯೋ ಹಾಕೋಕೆ ಬಿಡಲ್ಲ. ಈ ಪುಟವನ್ನ ಕ್ರೋಮ್, ಸಫಾರಿ ಅಥವಾ ಫೈರ್‌ಫಾಕ್ಸಿನಲ್ಲಿ ತೆರೆದರೆ ಹಾಡು ಹಾಕುತ್ತೆ. ಹಾಡಿಗೆ ಏನೂ ತೊಂದರೆ ಇಲ್ಲ.`,
  openOnYoutube: 'ಯೂಟ್ಯೂಬಿನಲ್ಲಿ ತೆರೆಯಿರಿ',
  loading: 'ಟೇಪು ಸಿಕ್ಕಿಸ್ತಿದೆ',
  loadingShort: 'ಸಿಕ್ಕಿಸ್ತಿದೆ',
  sideA: 'ಎ ಸೈಡು',
  sideB: 'ಬಿ ಸೈಡು',

  alsoCreditedHeading: 'ಇವರ ಹೆಸರೂ ಇದೆ',
  alsoCreditedNote:
    'ಇಲ್ಲಿನ ಯಾವುದಾದರೂ ಹಾಡಿನಲ್ಲಿ ಹೆಸರಿರುವ ಗಾಯಕರು, ವಾದಕರು, ಬರಹಗಾರರು. ಹೆಸರು ಒತ್ತಿದರೆ ಅವರು ಯಾವ ಹಾಡಲ್ಲಿ ಇದ್ದಾರೆ ಅಂತ ಕಾಣುತ್ತೆ.',
  tracksLabel: 'ಹಾಡುಗಳು',
  listenOn: 'ಇಲ್ಲೂ ಸಿಗುತ್ತೆ',
  searchSuffix: 'ಹುಡುಕಾಟ',

  calloutHeading: 'ಇಲ್ಲಿ ಇರಬೇಕಾದ ಹಾಡು ಗೊತ್ತಾ?',
  calloutBody:
    'ಈ ಪಟ್ಟಿ ಬೇಕಂತಲೇ ಚಿಕ್ಕದು. ಮಿಕ್ಸ್‌ಟೇಪು ಬೆಳೆಯೋ ಹಾಗೇ ಇದೂ ಬೆಳೀತದೆ, ಯಾರೋ ಒಂದು ಹಾಡಿನ ಬಗ್ಗೆ ಹೇಳ್ತಾರೆ, ನೀವು ಹೋಗಿ ಹುಡುಕ್ತೀರಿ. ಇಲ್ಲಿ ಇರಬೇಕಾದ ಕನ್ನಡ ಕಲಾವಿದರು ಗೊತ್ತಿದ್ರೆ ಕಳಿಸಿ. ಬಂದ ಪ್ರತಿ ಹೆಸರನ್ನೂ ಕೂತು ಕೇಳ್ತೀನಿ.',
  calloutInstagram: 'ಇನ್‌ಸ್ಟಾದಲ್ಲಿ ಮೆಸೇಜು ಮಾಡಿ',
  calloutEmail: 'ಇಮೇಲ್ ಮಾಡಿ',
  calloutGithub: 'ಗಿಟ್‌ಹಬ್‌ನಲ್ಲಿ ಕೋಡ್',
  noResultsAction: 'ಒಂದು ಹಾಡು ಸೂಚಿಸಿ',
  suggestHeading: 'ಏನಾದರೂ ಬಿಟ್ಟುಹೋಗಿದೆಯಾ?',

  siteCreditsHeading: 'ಈ ಪುಟದ ಬಗ್ಗೆ',
  builtBy: (name, date) => `${name} ಕಟ್ಟಿದ್ದು, ${date}.`,
  sourceNote:
    'ಖಾತೆ ಬೇಡ, ನೀವು ಇಲ್ಲಿ ಏನು ಮಾಡ್ತೀರಿ ಅನ್ನೋದನ್ನ ನಾನು ಇಟ್ಟುಕೊಳ್ಳಲ್ಲ. ಇದನ್ನ ಮುಂದುವರಿಸೋದು ಸಾರ್ಥಕವಾ ಅಂತ ತಿಳಿಯೋಕೆ ಗೂಗಲ್ ಅನಾಲಿಟಿಕ್ಸ್ ಭೇಟಿಗಳನ್ನ ಎಣಿಸುತ್ತೆ. ಹಾಡು ಹಾಕಿದಾಗ ಯೂಟ್ಯೂಬು ತನ್ನದೇ ಕುಕೀ ಇಡುತ್ತೆ.',
  artistCreditsHeading: 'ಈ ಸಂಗೀತ ನನ್ನದಲ್ಲ',
  artistCreditsBody:
    'ಇಲ್ಲಿನ ಪ್ರತಿ ಹಾಡೂ ಅದನ್ನ ಬರೆದ ಕಲಾವಿದರಿಗೆ, ಬಿಡುಗಡೆ ಮಾಡಿದ ಲೇಬಲ್ಲಿಗೆ ಸೇರಿದ್ದು. ಈ ಪುಟ ಯಾವ ಹಾಡನ್ನೂ ತನ್ನಲ್ಲಿ ಇಟ್ಟುಕೊಂಡಿಲ್ಲ, ಹಂಚೋದೂ ಇಲ್ಲ, ಯೂಟ್ಯೂಬಿನಲ್ಲಿ ಕಲಾವಿದರೇ ಹಾಕಿರೋ ಅಧಿಕೃತ ವಿಡಿಯೋಗಳನ್ನಷ್ಟೇ ಹಾಕುತ್ತೆ, ಮತ್ತು ಅವರಿಗೆ ನಿಜವಾಗಿ ದುಡ್ಡು ಸಿಗೋ ಜಾಗಗಳಿಗೆ ಕೊಂಡಿ ಕೊಡುತ್ತೆ. ಸುತ್ತಲಿನ ಈ ಪುಟ ಬಿಟ್ಟರೆ ಇಲ್ಲಿ ನನ್ನದು ಅನ್ನೋದು ಏನೂ ಇಲ್ಲ. ನೀವು ಇಲ್ಲಿನ ಕಲಾವಿದರಲ್ಲಿ ಒಬ್ಬರಾಗಿದ್ದು ನಿಮ್ಮ ಹಾಡನ್ನ ತೆಗೆಯಬೇಕು ಅಥವಾ ಬೇರೆ ರೀತಿ ಹೆಸರು ಹಾಕಬೇಕು ಅನಿಸಿದರೆ ಒಂದು ಸಾಲು ಬರೆಯಿರಿ, ಅದೇ ದಿನ ಆಗುತ್ತೆ.',
  featuredArtistsLabel: 'ಈ ಪುಟದಲ್ಲಿರೋ ಕಲಾವಿದರು, ನೆನಪಿನೊಂದಿಗೆ',
  photoCreditsHeading: 'ಫೋಟೋಗಳು',
  photoBy: (name) => `ಫೋಟೋ: ${name}`,
  photoByPrefix: 'ಫೋಟೋ: ',
  onUnsplash: 'Unsplash ನಿಂದ',
}

export const copy = { en, kn } as const
