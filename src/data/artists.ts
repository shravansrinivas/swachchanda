/**
 * The whole roster lives here. To add an artist or a song, edit this file;
 * nothing in src/components needs to change.
 *
 * Every `youtubeId` below was checked against YouTube's oEmbed endpoint and
 * resolves to a real video. Re-check after editing with:
 *
 *     pnpm verify:tracks
 *
 * Two things that endpoint cannot tell you: whether the uploader disabled
 * embedding, and whether the video is geo-blocked. Both surface at runtime as
 * a player error, and the deck falls back to an "open on YouTube" link when
 * they do, so a bad id degrades rather than breaking the page.
 *
 * Prefer official artist/label channels over fan re-uploads: re-uploads get
 * taken down, and this site's whole premise is crediting artists properly.
 *
 * SONGS MUST BE IN KANNADA. An artist being from Karnataka is not enough, and
 * neither is the song appearing on a Kannada playlist: a Hindi track by a
 * Bengaluru band belongs somewhere else. Titles may be romanised or in English
 * ("Rockstar", "LIT", "Stay With Me") as long as the song is sung in Kannada.
 *
 * Songs that switch between Kannada and English mid-verse count. Bands here
 * write that way and cutting them would misrepresent the scene; the test is
 * whether Kannada is one of the languages actually being sung, not whether it
 * is the only one.
 */

import type { Genre, Mood } from './taxonomy'

export type Lang = 'kn' | 'en'

/** Any string the page shows has to exist in both scripts. */
export interface Bilingual {
  kn: string
  en: string
}

export interface Track {
  /** Romanised title, used as the stable key and shown in English mode. */
  title: string
  /** Kannada title. Falls back to `title` when absent. */
  titleKn?: string
  /** 11-character YouTube video id. Required, this is what actually plays. */
  youtubeId: string
  /** What the song is. At least one; drives the genre filter. */
  genres: Genre[]
  /** What the song is for. At least one; drives the mood filter. */
  moods: Mood[]
  /**
   * Marks a song as cleared for family listening.
   *
   * This is an allowlist, not a blocklist. "Family listening" mode shows only
   * songs marked `true`, so an unmarked song is simply absent rather than
   * wrongly vouched for. The flags below are a judgement call from genre and
   * the artist's body of work, NOT a lyric-by-lyric audit, and no song is
   * marked as *unsafe*. That would be a claim about a real artist I have no
   * standing to make. Listen and correct these.
   */
  childSafe?: boolean
  /**
   * Set when YouTube refuses to embed the video (error 101/150) or it is
   * geo-blocked. Such a track is still listed, because it is still part of the
   * roster and the artist still deserves the credit, but it cannot be queued
   * and the deck will not accept it.
   *
   * Populate with `pnpm check:embeds`, which loads each id in a real player
   * and records what the API reports. Do not set it by hand from a guess.
   */
  unplayable?: boolean
  spotifyUrl?: string
  appleMusicUrl?: string
  ytMusicUrl?: string
}

export interface Artist {
  /** Stable slug. Used for React keys and the route. */
  id: string
  name: Bilingual
  blurb: Bilingual
  tracks: Track[]
  /**
   * Secondary outbound links. Anything omitted is generated as a *search* URL
   * on that platform by `platformLinks()` rather than guessed. A search link
   * always lands somewhere useful; a guessed artist id 404s. Replace with real
   * artist pages as you confirm them.
   */
  links?: {
    spotify?: string
    appleMusic?: string
    ytMusic?: string
    youtube?: string
    /** Only ever a handle you have actually seen. Omitted rather than guessed. */
    instagram?: string
    /** Checked to return 200 before being added. */
    wikipedia?: string
  }
}

export const artists: Artist[] = [
  {
    id: 'vasu-dixit',
    name: { kn: 'ವಾಸು ದೀಕ್ಷಿತ್', en: 'Vasu Dixit' },
    blurb: {
      kn: 'ಸ್ವರಾತ್ಮದ ದನಿ. ಒಬ್ಬರೇ ಹಾಡಿದಾಗ ಆ ದನಿ ಇನ್ನೂ ಹತ್ತಿರ, ಇನ್ನೂ ಒರಟು. ಜಾನಪದ, ವಚನ, ಇವತ್ತಿನ ಕವಿತೆ, ಎಲ್ಲವನ್ನೂ ಒಂದೇ ಉಸಿರಲ್ಲಿ ಹಿಡಿದಿಡ್ತಾರೆ.',
      en: 'The voice of Swarathma, closer and rougher when they sing alone. Folk, vachana and modern Kannada poetry, all held in the same breath.',
    },
    tracks: [
      {
        title: 'Nadiyolage',
        titleKn: 'ನದಿಯೊಳಗೆ',
        youtubeId: '6WuoRV66ti8',
        genres: ['folk'],
        moods: ['latenight', 'longing', 'focus'],
        childSafe: true,
      },
      {
        title: 'Yellaaru Maaduvdu',
        titleKn: 'ಎಲ್ಲಾರು ಮಾಡುವುದು',
        youtubeId: 'rge-N2izCr4',
        genres: ['devotional', 'folk'],
        moods: ['latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Neelamegha',
        titleKn: 'ನೀಲಮೇಘ',
        youtubeId: 'GlVj43_S1mw',
        genres: ['folk'],
        moods: ['longing', 'rain', 'focus'],
        childSafe: true,
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Vasu_Dixit', youtube: 'https://www.youtube.com/@VasuDixit' },
  },
  {
    id: 'sangeetha-rajeev',
    name: { kn: 'ಸಂಗೀತಾ ರಾಜೀವ್', en: 'Sangeetha Rajeev' },
    blurb: {
      kn: 'ಉತ್ತರ ಕರ್ನಾಟಕದ ಜಾನಪದವನ್ನು ಎತ್ತಿಕೊಂಡು ತಮ್ಮದೇ ದನಿಯಲ್ಲಿ ಹಾಡಿದವರು. ಕನ್ನಡದ ಸ್ವತಂತ್ರ ಸಂಗೀತವನ್ನು ತಮ್ಮ ಹೆಸರಿನ ಮೇಲೇ ಹೊತ್ತ ಮೊದಲ ಹೆಣ್ಣುಮಕ್ಕಳಲ್ಲಿ ಒಬ್ಬರು.',
      en: 'They picked up Uttara Karnataka folk and sang it in their own voice, and were among the first women to carry Kannada independent music under their own name.',
    },
    tracks: [
      {
        title: 'Nee Hinga Nodabyada',
        titleKn: 'ನೀ ಹಿಂಗ ನೋಡಬ್ಯಾಡ',
        youtubeId: '3zB7KJmtecw',
        genres: ['folk'],
        moods: ['longing', 'joy'],
        childSafe: true,
      },
      {
        title: 'Nee Hinga Nodabyada 2.0',
        titleKn: 'ನೀ ಹಿಂಗ ನೋಡಬ್ಯಾಡ ೨.೦',
        youtubeId: 'W1HQJnn3rFo',
        genres: ['folk', 'electronic'],
        moods: ['joy'],
        childSafe: true,
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Sangeetha_Rajeev',
      youtube: 'https://www.youtube.com/channel/UCJM6XoRMoBgBY4yLSR36Gng',
      ytMusic: 'https://music.youtube.com/channel/UCJM6XoRMoBgBY4yLSR36Gng',
    },
  },
  {
    id: 'raghu-dixit',
    name: { kn: 'ರಘು ದೀಕ್ಷಿತ್', en: 'Raghu Dixit' },
    blurb: {
      kn: 'ಶಿಶುನಾಳ ಶರೀಫರ ಪದಗಳನ್ನು ಸಮುದ್ರ ದಾಟಿಸಿ ವೇದಿಕೆಗೆ ಒಯ್ದವರು. ಭಾರತದ ಸ್ವತಂತ್ರ ಸಂಗೀತ ಹೀಗೂ ಇರಬಹುದು ಅಂತ ಒಂದು ಇಡೀ ತಲೆಮಾರಿಗೆ ತೋರಿಸಿಕೊಟ್ಟವರು.',
      en: 'The artist who carried Shishunala Sharifa’s words to festival stages abroad, and showed a whole generation what Indian independent music could look like.',
    },
    tracks: [
      {
        title: 'Kodagana Koli Nungitha',
        titleKn: 'ಕೊಡಗನ ಕೋಳಿ ನುಂಗಿತ್ತ',
        youtubeId: 'Af55JPHuRjs',
        genres: ['devotional', 'folk'],
        moods: ['latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Parasiva',
        titleKn: 'ಪರಶಿವ',
        youtubeId: '63PTx_1WEq4',
        genres: ['devotional', 'folk'],
        moods: ['latenight', 'focus'],
        childSafe: true,
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Raghu_Dixit', youtube: 'https://www.youtube.com/c/RaghuDixitMusic' },
  },
  {
    id: 'swarathma',
    name: { kn: 'ಸ್ವರಾತ್ಮ', en: 'Swarathma' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಜಾನಪದ-ರಾಕ್ ಬ್ಯಾಂಡ್. ವೇಷ, ವ್ಯಂಗ್ಯ, ರಾಜಕಾರಣ, ಎಲ್ಲವನ್ನೂ ಒಂದೇ ವೇದಿಕೆಗೆ ಜೋರಾಗಿ ಹೊತ್ತು ತರ್ತಾರೆ.',
      en: 'Bengaluru’s folk-rock band. Costume, satire and politics, all carried onto the same stage and carried loudly.',
    },
    tracks: [
      {
        title: 'Jangama',
        titleKn: 'ಜಂಗಮ',
        youtubeId: 'ZeNR1ZzvNlQ',
        genres: ['folk', 'rock'],
        moods: ['restless'],
        childSafe: true,
      },
      {
        title: 'Belongaluru',
        titleKn: 'ಬೆಲಾಂಗ್ಳೂರು',
        youtubeId: 'ZvX3pLloaps',
        genres: ['rock'],
        moods: ['restless', 'road'],
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Swarathma',
      youtube: 'https://www.youtube.com/user/swarathma',
      ytMusic: 'https://music.youtube.com/channel/UCnE57O__uF-Ip_G__I67MdA',
    },
  },
  {
    id: 'all-ok',
    name: { kn: 'ಆಲ್ ಓಕೆ', en: 'All Ok' },
    blurb: {
      kn: 'ಅಲೋಕ್ ಆರ್. ಬಾಬು. ಬೆಂಗಳೂರಿನ ಬೀದಿ ಕನ್ನಡವನ್ನು ರ‍್ಯಾಪಿಗೆ ತಂದು, ಕನ್ನಡ ಹಿಪ್-ಹಾಪ್ ಅನ್ನು ಮನೆಮಾತು ಮಾಡಿದವರು.',
      en: 'Alok R. Babu. They took the street Kannada of Bengaluru into rap and made Kannada hip-hop a household sound.',
    },
    tracks: [
      {
        title: "Don't Worry",
        titleKn: 'ಡೋಂಟ್ ವರಿ',
        youtubeId: 'ksANu45I16U',
        genres: ['hiphop'],
        moods: ['joy'],
      },
      {
        title: 'Yaakinge',
        titleKn: 'ಯಾಕಿಂಗೆ',
        youtubeId: 'Asts0TK82s8',
        genres: ['hiphop'],
        moods: ['longing'],
      },
      {
        title: 'Nan Kannadiga',
        titleKn: 'ನಾನ್ ಕನ್ನಡಿಗ',
        youtubeId: 'Sl_JnlsZIVs',
        genres: ['hiphop'],
        moods: ['restless', 'joy'],
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/All_Ok',
      youtube: 'https://www.youtube.com/user/vasusolaris',
      ytMusic: 'https://music.youtube.com/channel/UCUwSeY7lUdZSP0vuflq1oPA',
    },
  },
  {
    id: 'mc-bijju',
    name: { kn: 'ಎಂ.ಸಿ. ಬಿಜ್ಜು', en: 'MC Bijju' },
    blurb: {
      kn: 'ಕನ್ನಡ ರ‍್ಯಾಪಿನ ಅತಿ ಹರಿತವಾದ ನಾಲಿಗೆ. ಪದಗಳು ವೇಗವಾಗಿ ಬೀಳ್ತವೆ, ಆದರೆ ಒಂದೂ ವ್ಯರ್ಥ ಆಗಲ್ಲ.',
      en: 'The sharpest tongue in Kannada rap. The words come down fast, and not one of them is wasted.',
    },
    tracks: [
      {
        title: 'Thaderahita',
        titleKn: 'ತಡೆರಹಿತ',
        youtubeId: 'EXHmUGAzUMc',
        genres: ['hiphop'],
        moods: ['restless'],
      },
      {
        title: 'Ivathilla Naale',
        titleKn: 'ಇವತ್ತಿಲ್ಲ ನಾಳೆ',
        youtubeId: 'JFoWHiIzR98',
        genres: ['hiphop'],
        moods: ['restless'],
      },
      {
        title: 'Kaage',
        titleKn: 'ಕಾಗೆ',
        youtubeId: 'bDkN8k-DWwA',
        genres: ['hiphop'],
        moods: ['restless', 'latenight'],
      },
    ],
    links: { youtube: 'https://www.youtube.com/@MCBIJJUU' },
  },
  {
    id: 'rahul-dit-o',
    name: { kn: 'ರಾಹುಲ್ ಡಿಟ್-ಓ', en: 'Rahul Dit-O' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಹಿಪ್-ಹಾಪ್ ವಲಯವನ್ನು ಕಟ್ಟಿದವರಲ್ಲಿ ಒಬ್ಬರು. ಜೊತೆಗೂಡಿ ಮಾಡುವುದೇ ಇವರ ದಾರಿ, ಇವರ ಒಳ್ಳೆಯ ಹಾಡುಗಳ ಮೇಲೆ ಯಾವಾಗಲೂ ಮೂರು ಹೆಸರಿರುತ್ತವೆ.',
      en: 'One of the builders of the Bengaluru hip-hop scene. Collaboration is the whole method: their best tracks have three names on them.',
    },
    tracks: [
      {
        title: 'LIT',
        titleKn: 'ಲಿಟ್',
        youtubeId: 'xlCsTl8YNnA',
        genres: ['hiphop'],
        moods: ['restless', 'joy'],
      },
    ],
    links: { youtube: 'https://www.youtube.com/@RahulDitO' },
  },
  {
    id: 'lagori',
    name: { kn: 'ಲಗೋರಿ', en: 'Lagori' },
    blurb: {
      kn: 'ಬೀದಿ ಆಟದ ಹೆಸರನ್ನೇ ಇಟ್ಟುಕೊಂಡ ಬ್ಯಾಂಡ್. ಕನ್ನಡ, ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್, ಹಾಡು ಯಾವ ಭಾಷೆಗೆ ಬಿದ್ದರೂ ಅದೇ ಚಡಪಡಿಕೆ.',
      en: 'Named after the street game. Kannada, Hindi or English: the same restless energy in whichever language the song lands in.',
    },
    tracks: [
      {
        title: 'Swaha',
        titleKn: 'ಸ್ವಾಹಾ',
        youtubeId: 'G8Y1Hiyxm2E',
        genres: ['hiphop', 'rock'],
        moods: ['restless'],
      },
      {
        title: 'Helkolakondooru',
        titleKn: 'ಹೇಳ್ಕೊಳಕ್ಕೊಂದೂರು',
        youtubeId: 'GJE9wfXZ3ww',
        genres: ['rock'],
        moods: ['joy'],
      },
    ],
    links: { youtube: 'https://www.youtube.com/@Lagoriofficial' },
  },
  {
    id: 'sumedh-k',
    name: { kn: 'ಸುಮೇಧ್ ಕೆ', en: 'Sumedh K' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಹಾಡುಗಾರ-ಬರಹಗಾರ. ಇವತ್ತಿನ ಅಲೆಯ ನಡುವೆ ನಿಂತವರು, ಯಾವ ಕನ್ನಡ ಇಂಡಿ ಪಟ್ಟಿ ತೆರೆದರೂ ಅವರ ಹೆಸರು ಇರುತ್ತೆ, ಅದೂ ಒಂದೇ ಸಲ ಅಲ್ಲ.',
      en: 'A Bengaluru singer-songwriter at the centre of the current wave. Open any Kannada indie playlist and their name is on it, usually more than once.',
    },
    tracks: [
      {
        title: 'Tulasi',
        titleKn: 'ತುಳಸಿ',
        youtubeId: 'Y8ZApXcnhy4',
        genres: ['indiepop'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Maaye',
        titleKn: 'ಮಾಯೆ',
        youtubeId: 'Yxx-zTuw1xE',
        genres: ['indiepop'],
        moods: ['latenight', 'longing', 'focus'],
        childSafe: true,
      },
      {
        title: 'Saagara',
        titleKn: 'ಸಾಗರ',
        youtubeId: 'ZcRGOUJXJQg',
        genres: ['indiepop'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
      {
        // "- Topic" is YouTube's auto-generated official channel for a label's
        // catalogue, not a fan re-upload.
        title: 'Daaha',
        titleKn: 'ದಾಹ',
        youtubeId: 'CirEMx-__no',
        genres: ['indiepop'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
      {
        // Uploaded on Mitra Hegde's channel, who sings on it. Still official.
        title: 'Meghave',
        titleKn: 'ಮೇಘವೇ',
        youtubeId: 'e9cAxbdivFw',
        genres: ['indiepop'],
        moods: ['rain', 'longing', 'focus'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@SumedhK' },
  },
  {
    id: 'sanjith-hegde',
    name: { kn: 'ಸಂಜಿತ್ ಹೆಗಡೆ', en: 'Sanjith Hegde' },
    blurb: {
      kn: 'ಸಿನಿಮಾ ಹಾಡುಗಾರಿಕೆಯಿಂದ ಬೆಳೆದವರು. ಆದರೆ ಅವರದೇ ಹಾಡುಗಳಲ್ಲಿ ದನಿ ಬೇರೆ, ಮೆತ್ತಗೆ, ಕಿವಿಯ ಪಕ್ಕದಲ್ಲೇ ಹಾಡಿದ ಹಾಗೆ.',
      en: 'They came up through playback, but their own songs are a different and quieter instrument: soft, close-miked.',
    },
    tracks: [
      {
        title: 'Kareyole',
        titleKn: 'ಕರೆಯೊಲೆ',
        youtubeId: 'HSzJL-GJBHc',
        genres: ['indiepop'],
        moods: ['longing', 'focus'],
        childSafe: true,
      },
      {
        title: 'Nange Allava',
        titleKn: 'ನಂಗೆ ಅಲ್ಲವಾ',
        youtubeId: 'RVMnT4nq9NU',
        genres: ['indiepop'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
      {
        // Draws on Purandaradasa's "Tarakka Bindige".
        title: 'Taare Bindigeya',
        titleKn: 'ತಾರೆ ಬಿಂದಿಗೆಯ',
        youtubeId: 'HzpOXAHJN1M',
        genres: ['devotional', 'indiepop'],
        moods: ['latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Maayavi',
        titleKn: 'ಮಾಯಾವಿ',
        youtubeId: 'TMY1g8pAktk',
        genres: ['indiepop'],
        moods: ['longing', 'focus'],
        childSafe: true,
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Sanjith_Hegde',
      youtube: 'https://www.youtube.com/@SanjithHegde',
      ytMusic: 'https://music.youtube.com/channel/UCpr7TTwR4qZ_2SHQaDlXNGA',
    },
  },
  {
    id: 'tanmay-gururaj',
    name: { kn: 'ತನ್ಮಯ್ ಗುರುರಾಜ್', en: 'Tanmay Gururaj' },
    blurb: {
      kn: 'ಕನ್ನಡ ಇಂಡಿ-ಪಾಪಿನ ಹೊಸ ಮುಖ. ಪ್ರೇಮದ ಹಾಡುಗಳನ್ನು ಸ್ವಲ್ಪವೂ ನಾಚಿಕೆ ಇಲ್ಲದೆ ಬರೀತಾರೆ.',
      en: 'The new face of Kannada indie-pop, writing love songs without a trace of embarrassment about it.',
    },
    tracks: [
      {
        title: 'Ninna Notavu',
        titleKn: 'ನಿನ್ನ ನೋಟವು',
        youtubeId: 'FDCc2beB77I',
        genres: ['indiepop'],
        moods: ['longing', 'joy'],
        childSafe: true,
      },
      {
        title: 'Nasheya Gungale',
        titleKn: 'ನಶೆಯ ಗುಂಗಲೆ',
        youtubeId: '9dlbKgxvg_A',
        genres: ['indiepop'],
        moods: ['latenight', 'longing'],
      },
    ],
    links: { youtube: 'https://www.youtube.com/@TanmayGururaj' },
  },
  {
    id: 'curry',
    name: { kn: 'ಕರ್ರಿ', en: 'Curry' },
    blurb: {
      kn: 'ಕನ್ನಡ ಪದಗಳ ಕೆಳಗೆ ಆಫ್ರೋ-ಬೀಟು ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸದ್ದು. “ಸುಪ್ರಭಾತ” ಇಪಿಯನ್ನು ಒಂದೇ ಕೂರಿಕೆಯಲ್ಲಿ ಕೇಳಬೇಕು.',
      en: 'Afro-beat and electronics under Kannada words. The Suprabhatha EP is meant to be heard in one sitting.',
    },
    tracks: [
      {
        title: 'Seetha Kalyana',
        titleKn: 'ಸೀತಾ ಕಲ್ಯಾಣ',
        youtubeId: 'wsGnsRa5wxE',
        genres: ['electronic', 'indiepop'],
        moods: ['joy'],
        childSafe: true,
      },
      {
        title: 'Nannavale',
        titleKn: 'ನನ್ನವಳೆ',
        youtubeId: 'egbFaBl8Of4',
        genres: ['electronic'],
        moods: ['joy'],
        childSafe: true,
      },
      {
        title: 'Manase',
        titleKn: 'ಮನಸೆ',
        youtubeId: 'yQOjJLdzJqY',
        genres: ['electronic'],
        moods: ['latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Saanjh',
        titleKn: 'ಸಾಂಜ್',
        youtubeId: 'pG3MZ3HDBN0',
        genres: ['electronic', 'indiepop'],
        moods: ['latenight', 'longing', 'focus'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@curry.music' },
  },
  {
    id: 'narayan-sharma',
    name: { kn: 'ನಾರಾಯಣ್ ಶರ್ಮ', en: 'Narayan Sharma' },
    blurb: {
      kn: 'ಉತ್ತರ ಕನ್ನಡವನ್ನು ಜೊತೆಗೇ ಹೊತ್ತು ತಿರುಗುವ ಹಾಡುಗಳು. ಸಂಗೀತ ಸರಳ, ಆದರೆ ಸಾಲುಗಳು ಮನಸ್ಸಲ್ಲಿ ಉಳಿಯುತ್ತವೆ.',
      en: 'Songs that carry Uttara Kannada around with them. Plain arrangements, lines that stay.',
    },
    tracks: [
      {
        title: 'Bhasavagide',
        titleKn: 'ಭಾಸವಾಗಿದೆ',
        youtubeId: 'J8IQ40P9e08',
        genres: ['indiepop', 'folk'],
        moods: ['longing', 'focus'],
        childSafe: true,
      },
      {
        title: 'Baanancha Daati',
        titleKn: 'ಬಾನಂಚ ದಾಟಿ',
        youtubeId: '3YbVZ5f4Gj0',
        genres: ['indiepop'],
        moods: ['road', 'longing'],
        childSafe: true,
      },
      {
        title: 'Uttara Kannada',
        titleKn: 'ಉತ್ತರ ಕನ್ನಡ',
        youtubeId: 'BJ-gIBC4w5g',
        genres: ['folk'],
        moods: ['road', 'rain', 'focus'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/channel/UCvOmVgVsgiIxZwtOd28JIKA' },
  },
  {
    id: 'pineapple-express',
    name: { kn: 'ಪೈನಾಪಲ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್', en: 'Pineapple Express' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಪ್ರೊಗ್-ಫ್ಯೂಷನ್ ಬ್ಯಾಂಡ್. ಕರ್ನಾಟಕ ಸಂಗೀತ, ಹಿಂದೂಸ್ತಾನಿ, ಮೆಟಲ್, ಎಲ್ಲವನ್ನೂ ಒಂದೇ ಹಾಡಿನಲ್ಲಿ ಹಿಡಿಸ್ತಾರೆ. ಸಾಲುಗಳು ಕನ್ನಡದಿಂದ ಇಂಗ್ಲಿಷಿಗೆ ಸಲೀಸಾಗಿ ಹೊರಳ್ತವೆ.',
      en: 'A Bengaluru prog-fusion band that will put Carnatic, Hindustani and metal inside the same song and make it hold together, switching between Kannada and English as the line needs it.',
    },
    tracks: [
      {
        title: 'Fineapple',
        titleKn: 'ಫೈನಾಪಲ್',
        youtubeId: 'ol6mmFtZbJY',
        genres: ['fusion'],
        moods: ['joy', 'restless'],
      },
    ],
    links: { youtube: 'https://www.youtube.com/@PineappleExpressMusic' },
  },
  {
    id: 'vasuki-vaibhav',
    name: { kn: 'ವಾಸುಕಿ ವೈಭವ್', en: 'Vasuki Vaibhav' },
    blurb: {
      kn: 'ಸಂಯೋಜಕರು, ಗಾಯಕರು, ಬರಹಗಾರರು. ಸಿನಿಮಾ ಕೆಲಸ ಮತ್ತು ತಮ್ಮದೇ ಹಾಡುಗಳ ನಡುವೆ ದನಿ ಬದಲಾಯಿಸದೆ ಓಡಾಡ್ತಾರೆ.',
      en: 'Composer, singer and lyricist, moving between film work and their own releases without changing register much.',
    },
    tracks: [
      {
        title: 'Gira Gira',
        titleKn: 'ಗಿರ ಗಿರ',
        youtubeId: 'y4QPOKGcnuI',
        genres: ['indiepop'],
        moods: ['joy'],
        childSafe: true,
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Vasuki_Vaibhav', youtube: 'https://www.youtube.com/@VasukiVaibhav' },
  },
  {
    id: 'mitra-hegde',
    name: { kn: 'ಮಿತ್ರಾ ಹೆಗಡೆ', en: 'Mitra Hegde' },
    blurb: {
      kn: 'ಪ್ರೀತಿ, ದುಃಖ, ಬಿಡಲಾಗದ ನೆನಪು: ಇವನ್ನೇ ಹಿಡಿದು ಹಾಡು ಕಟ್ಟುತ್ತಾರೆ. ದನಿಯಲ್ಲಿ ಅವಸರವಿಲ್ಲ.',
      en: 'They build songs out of love, grief and the memories that will not let go. Never a note in a hurry.',
    },
    tracks: [
      {
        title: 'Ninnane',
        titleKn: 'ನಿನ್ನನೇ',
        youtubeId: 'Hl-cljNHfCo',
        genres: ['indiepop'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Nanariye',
        titleKn: 'ನನಗರಿಯೆ',
        youtubeId: 'OBKYBEeBdic',
        genres: ['indiepop'],
        moods: ['longing', 'focus'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@MitraHegde' },
  },
  {
    id: 'adhvik',
    name: { kn: 'ಅಧ್ವಿಕ್', en: 'Adhvik' },
    blurb: {
      kn: 'ಕನ್ನಡ ಇಂಡಿಯಲ್ಲಿ ಸತತವಾಗಿ ಹಾಡು ಬಿಡುಗಡೆ ಮಾಡುತ್ತಿರುವವರು. ಅಲೆಮಾರಿತನವೇ ಇವರ ಬಹುತೇಕ ಹಾಡುಗಳ ಜೀವ.',
      en: 'One of the steadiest release schedules in Kannada indie. Restlessness runs through most of what they write.',
    },
    tracks: [
      {
        title: 'Marujanma',
        titleKn: 'ಮರುಜನ್ಮ',
        youtubeId: 'FUOOO9LcEzI',
        genres: ['indiepop'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Alemaari',
        titleKn: 'ಅಲೆಮಾರಿ',
        youtubeId: '-TXZG0lh8PY',
        genres: ['indiepop', 'folk'],
        moods: ['road'],
        childSafe: true,
      },
      {
        title: 'Ninna Gungalli',
        titleKn: 'ನಿನ್ನ ಗುಂಗಲ್ಲಿ',
        youtubeId: 'iLf_yqF9VjA',
        genres: ['indiepop'],
        moods: ['longing'],
        childSafe: true,
      },
      {
        title: 'Stay With Me',
        titleKn: 'ಸ್ಟೇ ವಿಥ್ ಮಿ',
        youtubeId: 'iU8QqpBhMaY',
        genres: ['indiepop'],
        moods: ['latenight', 'longing'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@TheRealAdhvik' },
  },
  {
    id: 'thanusha-keerthan',
    name: { kn: 'ತನುಷಾ ಕೆ.ಎಂ. ಮತ್ತು ಕೀರ್ತನ್ ಹೊಳ್ಳ', en: 'Thanusha K M & Keerthan Holla' },
    blurb: {
      kn: 'ಎರಡು ದನಿ, ಒಂದೇ ಹಾಡು. ಮೋಹ ಎಂಬ ಪದಕ್ಕೆ ಇವರು ಕೊಟ್ಟ ರೂಪ ಸುಲಭಕ್ಕೆ ಮರೆಯುವಂಥದ್ದಲ್ಲ.',
      en: 'Two voices on one song. What they made of the word moha is not easy to shake off.',
    },
    tracks: [
      {
        title: 'Moha',
        titleKn: 'ಮೋಹ',
        youtubeId: 'dXo1UkRaw3A',
        genres: ['indiepop'],
        moods: ['longing', 'latenight'],
        childSafe: true,
      },
    ],
  },
  {
    id: 'mysore-xpress',
    name: { kn: 'ಮೈಸೂರ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್', en: 'Mysore Xpress' },
    blurb: {
      kn: 'ಮೈಸೂರಿನ ಬ್ಯಾಂಡ್, ಮೈಸೂರಿನ ಬಗ್ಗೆಯೇ ಹಾಡುಗಳು. ಊರಿನ ಹೆಮ್ಮೆಯನ್ನು ಸದ್ದಿಲ್ಲದೆ ಹೊತ್ತವರು.',
      en: 'A Mysuru band singing about Mysuru, carrying the pride of the place without ever shouting about it.',
    },
    tracks: [
      {
        title: 'Nammooru',
        titleKn: 'ನಮ್ಮೂರು',
        youtubeId: '5akMHLngXiY',
        genres: ['rock', 'folk'],
        moods: ['joy', 'road'],
        childSafe: true,
      },
    ],
    links: {
      youtube: 'https://www.youtube.com/@MysoreXpress',
      instagram: 'https://www.instagram.com/mysore_xpress/',
    },
  },
  {
    id: 'rajat-hegde',
    name: { kn: 'ರಜತ್ ಹೆಗಡೆ', en: 'Rajat Hegde' },
    blurb: {
      kn: 'ಸಂಯೋಜನೆ, ಸಾಹಿತ್ಯ, ಹಾಡುಗಾರಿಕೆ: ಮೂರನ್ನೂ ತಾವೇ ಮಾಡುತ್ತಾರೆ. ಕಲಾವಿದರಿಗೂ ಸಂಗೀತಕ್ಕೂ ನಡುವಿನ ಪ್ರೇಮಕಥೆ ಇವರ ಹಾಡು.',
      en: 'Composer, lyricist and singer, all three themselves. Their best-known song is a love story between an artist and music.',
    },
    tracks: [
      {
        title: 'Aahana',
        titleKn: 'ಆಹಾನ',
        youtubeId: 'oFyJAYNohAk',
        genres: ['indiepop'],
        moods: ['longing', 'joy'],
        childSafe: true,
      },
    ],
  },
  {
    id: 'karthik-chennoji-rao',
    name: { kn: 'ಕಾರ್ತಿಕ್ ಚೆನ್ನೋಜಿ ರಾವ್', en: 'Karthik Chennoji Rao' },
    blurb: {
      kn: 'ಇಂಡಿ ರಾಕ್‌ನಿಂದ ಸಿನಿಮಾದವರೆಗೆ ನಡೆದವರು. ಸೊಲೊ ಹಾಡುಗಳಲ್ಲಿ ದನಿ ಹೆಚ್ಚು ಸರಳ, ಹೆಚ್ಚು ಹತ್ತಿರ.',
      en: 'They came from indie rock into film work. On their own releases the voice is plainer and much closer.',
    },
    tracks: [
      {
        title: 'Chinnada Hoovu',
        titleKn: 'ಚಿನ್ನದ ಹೂವು',
        youtubeId: 'P3CvKQTVr8c',
        genres: ['indiepop', 'folk'],
        moods: ['joy', 'longing'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@karthikchennojirao' },
  },
  {
    id: 'chirayu',
    name: { kn: 'ಚಿರಾಯು', en: 'Chirayu' },
    blurb: {
      kn: 'ಕನ್ನಡ ರ‍್ಯಾಪಿನ ಹೊಸ ದನಿಗಳಲ್ಲಿ ಒಬ್ಬರು. ಬರವಣಿಗೆ ವೇಗವಾಗಿದ್ದರೂ ಮಾತು ಸ್ಪಷ್ಟ.',
      en: 'One of the newer voices in Kannada rap. The writing moves fast but never blurs.',
    },
    tracks: [
      {
        title: 'Papi Chirayu',
        titleKn: 'ಪಾಪಿ ಚಿರಾಯು',
        youtubeId: 'jxUoMVRAYL4',
        genres: ['hiphop'],
        moods: ['restless'],
      },
      {
        title: 'Rap God',
        titleKn: 'ರ‍್ಯಾಪ್ ಗಾಡ್',
        youtubeId: '8GYxPhOrHu4',
        genres: ['hiphop'],
        moods: ['restless'],
      },
    ],
  },
  {
    id: 'varijashree-venugopal',
    name: { kn: 'ವರಿಜಾಶ್ರೀ ವೇಣುಗೋಪಾಲ್', en: 'Varijashree Venugopal' },
    blurb: {
      kn: 'ಕರ್ನಾಟಕ ಸಂಗೀತ, ಜಾಝ್, ಕೊಳಲು, ಮತ್ತು ದನಿಯನ್ನೇ ವಾದ್ಯವಾಗಿಸುವ ಕಲೆ. ಜಗತ್ತಿನ ವೇದಿಕೆಗಳಲ್ಲಿ ಕನ್ನಡವನ್ನು ಹಾಡುತ್ತಿರುವವರು.',
      en: 'Carnatic training, jazz phrasing, flute, and a voice used as an instrument in its own right. They sing Kannada on stages a long way from home.',
    },
    tracks: [
      {
        title: 'Nee',
        titleKn: 'ನೀ',
        youtubeId: 'fJoii5IURrk',
        genres: ['fusion'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
      {
        title: 'Ranjani',
        titleKn: 'ರಂಜನಿ',
        youtubeId: 'EPZLl9XycOc',
        genres: ['fusion'],
        moods: ['joy', 'focus'],
        childSafe: true,
      },
      {
        title: 'Harivaa Jhari',
        titleKn: 'ಹರಿವಾ ಝರಿ',
        youtubeId: 'g6Q2yMu8C3s',
        genres: ['fusion'],
        moods: ['rain', 'latenight', 'focus'],
        childSafe: true,
      },
    ],
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Varijashree_Venugopal', youtube: 'https://www.youtube.com/c/Varijashree' },
  },
  {
    id: 'kutcheri',
    name: { kn: 'ಕಚೇರಿ', en: 'Kutcheri' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಇಂಡಿ ರಾಕ್ ಬ್ಯಾಂಡ್. ಒಪ್ಪಿಗೆ ಸಿಗದ ಪ್ರೀತಿಯ ಬಗ್ಗೆ ಇವರಷ್ಟು ನೇರವಾಗಿ ಬರೆದವರು ಕಡಿಮೆ.',
      en: 'A Bengaluru indie rock band. Few people write about unreturned love this plainly.',
    },
    tracks: [
      {
        title: 'Preeti Sadhyave?',
        titleKn: 'ಪ್ರೀತಿ ಸಾಧ್ಯವೇ?',
        youtubeId: '8Ob9D_PhC_c',
        genres: ['rock', 'indiepop'],
        moods: ['longing'],
        childSafe: true,
      },
      {
        title: 'Endigu',
        titleKn: 'ಎಂದಿಗೂ',
        youtubeId: 'KWc04PcvZpk',
        genres: ['rock'],
        moods: ['longing', 'restless'],
        childSafe: true,
      },
    ],
  },
  {
    id: 'pranava-karanth',
    name: { kn: 'ಪ್ರಣವ ಕಾರಂತ್', en: 'Pranava Karanth' },
    blurb: {
      kn: 'ಸಹನೆ ತೊರೆದ ಮನಸ್ಸಿನ ಹಾಡು. ಸರಳ ಸಾಲುಗಳಲ್ಲಿ ದೊಡ್ಡ ಭಾವ ಇಡುತ್ತಾರೆ.',
      en: 'Songs for a mind that has run out of patience, with big feeling packed into plain lines.',
    },
    tracks: [
      {
        title: 'Sahane Torede',
        titleKn: 'ಸಹನೆ ತೊರೆದೆ',
        youtubeId: 'F4NNry7lLsM',
        genres: ['indiepop'],
        moods: ['longing', 'restless', 'focus'],
        childSafe: true,
      },
    ],
  },
  {
    id: 'priya-mali-nagarjun-sharma',
    name: { kn: 'ಪ್ರಿಯಾ ಮಾಲಿ ಮತ್ತು ನಾಗಾರ್ಜುನ್ ಶರ್ಮ', en: 'Priya Mali & Nagarjun Sharma' },
    blurb: {
      kn: 'ಸಂಗೀತ ಒಬ್ಬರದು, ಸಾಹಿತ್ಯ ಇನ್ನೊಬ್ಬರದು. ಭೂರಮೆ ಎಂಬ ಹೆಸರೇ ಹಾಡಿನ ಅರ್ಧ ಕೆಲಸ ಮಾಡುತ್ತದೆ.',
      en: 'Music from one, words from the other. The title Bhoorame does half the work of the song by itself.',
    },
    tracks: [
      {
        title: 'Bhoorame',
        titleKn: 'ಭೂರಮೆ',
        youtubeId: 'jjzE71kE4UQ',
        genres: ['indiepop'],
        moods: ['longing', 'joy'],
        childSafe: true,
      },
    ],
  },
  {
    id: 'vishwi',
    name: { kn: 'ವಿಶ್ವಿ', en: 'Vishwi' },
    blurb: {
      kn: 'ಬದುಕೇ ಒಂದು ಸವಾರಿ ಎಂಬ ಹಾಡು. ಹಿತ್ತಾಳೆ ವಾದ್ಯಗಳ ಸದ್ದು ಕನ್ನಡ ಇಂಡಿಯಲ್ಲಿ ಅಪರೂಪ.',
      en: 'A song about life as one long ride. Brass this bright is rare in Kannada indie.',
    },
    tracks: [
      {
        title: 'Nanna Savaari',
        titleKn: 'ನನ್ನ ಸವಾರಿ',
        youtubeId: 'tjd_9l5iAhQ',
        genres: ['indiepop', 'fusion'],
        moods: ['road', 'joy'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@vishwi' },
  },
  {
    id: 'tarana',
    name: { kn: 'ತರಾನಾ', en: 'Tarana' },
    blurb: {
      kn: 'ಕಳೆದುಹೋದ ದಿನಗಳ ಬಗ್ಗೆ ಬರೆದ ಹಾಡು. ಸದ್ದು ಕಡಿಮೆ, ಉಳಿಯುವುದು ಹೆಚ್ಚು.',
      en: 'A song about days that have already gone. Quiet on the surface, and it stays.',
    },
    tracks: [
      {
        title: 'Kaledhode',
        titleKn: 'ಕಳೆದೋದೆ',
        youtubeId: 'qTSjEnYYfT0',
        genres: ['indiepop'],
        moods: ['longing', 'latenight', 'focus'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@taranaofficiall' },
  },
  {
    id: 'suraj-km',
    name: { kn: 'ಸೂರಜ್ ಕೆ.ಎಂ.', en: 'Suraj KM' },
    blurb: {
      kn: 'ಸ್ವಂತ ಚಾನೆಲ್ಲಿನಲ್ಲೇ ಒಂದೊಂದಾಗಿ ಹಾಡು ಹಾಕುತ್ತ ಬೆಳೆದವರು. ಯಾವ ಲೇಬಲ್ಲಿನ ಹಂಗೂ ಇಲ್ಲ.',
      en: 'They built it up one upload at a time on their own channel, without a label anywhere in sight.',
    },
    tracks: [
      {
        title: 'Rockstar',
        titleKn: 'ರಾಕ್‌ಸ್ಟಾರ್',
        youtubeId: 'kAEDS_cYwzY',
        genres: ['rock', 'indiepop'],
        moods: ['restless', 'joy'],
      },
      {
        title: 'Horaadu Nee',
        titleKn: 'ಹೋರಾಡು ನೀ',
        youtubeId: 'HUiCpPfUXvI',
        genres: ['indiepop', 'rock'],
        moods: ['restless'],
        childSafe: true,
      },
      {
        title: 'Kaadige',
        titleKn: 'ಕಾಡಿಗೆ',
        youtubeId: 'Jz7nqW692w8',
        genres: ['indiepop'],
        moods: ['longing', 'focus'],
        childSafe: true,
      },
      {
        title: 'Sanchaari',
        titleKn: 'ಸಂಚಾರಿ',
        youtubeId: 'qr1nVeFK_3k',
        genres: ['indiepop'],
        moods: ['road'],
        childSafe: true,
      },
      {
        title: 'Thaare',
        titleKn: 'ತಾರೆ',
        youtubeId: '4kKmTaEjl4Y',
        genres: ['indiepop'],
        moods: ['latenight', 'longing', 'focus'],
        childSafe: true,
      },
    ],
    links: { youtube: 'https://www.youtube.com/@suraj_km' },
  },
]

/** A track's title in both scripts, for the bilingual display components. */
export function trackTitle(track: Track): Bilingual {
  return { en: track.title, kn: track.titleKn ?? track.title }
}

/** Every platform we link out to, in the order they render on a card. */
export type Platform = 'spotify' | 'appleMusic' | 'ytMusic' | 'youtube'

export const platformLabels: Record<Platform, string> = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  ytMusic: 'YouTube Music',
  youtube: 'YouTube',
}

/**
 * Resolve an artist's outbound links, falling back to a platform search for
 * anything we don't have a confirmed URL for. Search URLs are deliberate: a
 * guessed artist id sends people to a 404, a search always lands.
 */
export function platformLinks(artist: Artist): { platform: Platform; url: string; exact: boolean }[] {
  const query = encodeURIComponent(artist.name.en)
  const fallbacks: Record<Platform, string> = {
    spotify: `https://open.spotify.com/search/${query}`,
    appleMusic: `https://music.apple.com/in/search?term=${query}`,
    ytMusic: `https://music.youtube.com/search?q=${query}`,
    youtube: `https://www.youtube.com/results?search_query=${query}`,
  }

  return (Object.keys(platformLabels) as Platform[]).map((platform) => {
    const exactUrl = artist.links?.[platform]
    return {
      platform,
      url: exactUrl ?? fallbacks[platform],
      exact: Boolean(exactUrl),
    }
  })
}

/**
 * Where to hear *this song* elsewhere.
 *
 * YouTube is exact: we hold a verified video id for every track. Spotify and
 * Apple are searches scoped to the song and artist, because we do not hold
 * per-song ids for them and a guessed one lands on a 404 or, worse, on somebody
 * else's record. Fill `spotifyUrl` / `appleMusicUrl` on a track and that exact
 * link replaces the search.
 */
export function trackLinks(
  artist: Artist,
  track: Track,
): { platform: Platform; url: string; exact: boolean }[] {
  const query = encodeURIComponent(`${track.title} ${artist.name.en}`)

  return [
    {
      platform: 'youtube' as const,
      url: `https://www.youtube.com/watch?v=${track.youtubeId}`,
      exact: true,
    },
    {
      platform: 'spotify' as const,
      url: track.spotifyUrl ?? `https://open.spotify.com/search/${query}`,
      exact: Boolean(track.spotifyUrl),
    },
    {
      platform: 'appleMusic' as const,
      url: track.appleMusicUrl ?? `https://music.apple.com/in/search?term=${query}`,
      exact: Boolean(track.appleMusicUrl),
    },
    {
      platform: 'ytMusic' as const,
      url: track.ytMusicUrl ?? `https://music.youtube.com/search?q=${query}`,
      exact: Boolean(track.ytMusicUrl),
    },
  ]
}

/** Artist-level profile links, in render order. Absent ones are simply omitted. */
export type Profile = 'instagram' | 'wikipedia' | 'youtube'

export const profileLabels: Record<Profile, string> = {
  instagram: 'Instagram',
  wikipedia: 'Wikipedia',
  youtube: 'YouTube',
}

/** Only links we actually hold. Never a search, never a guess. */
export function artistProfiles(artist: Artist): { profile: Profile; url: string }[] {
  return (Object.keys(profileLabels) as Profile[])
    .map((profile) => ({ profile, url: artist.links?.[profile] ?? '' }))
    .filter((entry) => entry.url !== '')
}

/** Every track in roster order, with its artist, the player's base queue. */
export interface QueueItem {
  artist: Artist
  track: Track
  key: string
}

export const queue: QueueItem[] = artists.flatMap((artist) =>
  artist.tracks.map((track) => ({
    artist,
    track,
    key: `${artist.id}:${track.youtubeId}`,
  })),
)

/**
 * The roster A to Z, for pages that list artists.
 *
 * `artists` keeps its authored order because that is the tape order; this is
 * purely presentational. Compared on the romanised name so the order does not
 * shift with the language picker.
 */
export const artistsAlphabetical: Artist[] = [...artists].sort((a, b) =>
  new Intl.Collator('en', { sensitivity: 'base' }).compare(a.name.en, b.name.en),
)

export function findArtist(id: string | undefined): Artist | undefined {
  return artists.find((artist) => artist.id === id)
}

/** How many songs are cleared for family listening, shown next to the toggle. */
export const childSafeCount = queue.filter((item) => item.track.childSafe).length
