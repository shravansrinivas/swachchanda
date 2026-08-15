/**
 * The whole roster lives here: the people, the songs, and who is credited on
 * what. To add either, edit this file; nothing in src/components changes.
 *
 * Songs are NOT nested under an artist. A song names its own credits, in
 * billing order, and an artist's page is a query over that. Filing each song
 * under exactly one artist was the old shape and it quietly lied: half of these
 * are collaborations, and the second, third and fourth names on them were
 * simply not on the site. A song with four credits now shows four names, and
 * appears on four artist pages.
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
 * Prefer official artist and label channels over fan re-uploads: re-uploads get
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

/**
 * How someone is credited on a song.
 *
 * Deliberately shallow. `with` claims only that the official release credits
 * them, without inventing a role we do not know, which is the honest answer for
 * most of these: a title reading "A | B" does not say who sang and who played.
 * `words` and `music` are used only where a source actually says so.
 */
export type CreditRole = 'lead' | 'with' | 'featured' | 'words' | 'music'

export interface SongCredit {
  /** An id in `artists` below. Checked at load, an unknown id throws. */
  artist: string
  /** Defaults to 'lead'. */
  role?: CreditRole
}

export interface Song {
  /** Stable slug. The queue key, so it must not change once published. */
  id: string
  /** Romanised title, shown in English mode. */
  title: string
  /** Kannada title. Falls back to `title` when absent. */
  titleKn?: string
  /** 11-character YouTube video id. Required, this is what actually plays. */
  youtubeId: string
  /**
   * Everyone credited, in billing order, taken from the official release.
   * The first entry is who the song is filed under.
   */
  credits: SongCredit[]
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
   * geo-blocked. Such a song is still listed, because it is still part of the
   * roster and the artists still deserve the credit, but it cannot be queued
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
  /**
   * Optional on purpose. Plenty of people here are credited on someone else's
   * record and nothing is known about them beyond the name. A name with no
   * write-up is an honest entry; an invented write-up is not.
   */
  blurb?: Bilingual
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
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Vasu_Dixit',
      youtube: 'https://www.youtube.com/@VasuDixit',
    },
  },
  {
    id: 'sangeetha-rajeev',
    name: { kn: 'ಸಂಗೀತಾ ರಾಜೀವ್', en: 'Sangeetha Rajeev' },
    blurb: {
      kn: 'ಉತ್ತರ ಕರ್ನಾಟಕದ ಜಾನಪದವನ್ನು ಎತ್ತಿಕೊಂಡು ತಮ್ಮದೇ ದನಿಯಲ್ಲಿ ಹಾಡಿದವರು. ಕನ್ನಡದ ಸ್ವತಂತ್ರ ಸಂಗೀತವನ್ನು ತಮ್ಮ ಹೆಸರಿನ ಮೇಲೇ ಹೊತ್ತ ಮೊದಲ ಹೆಣ್ಣುಮಕ್ಕಳಲ್ಲಿ ಒಬ್ಬರು.',
      en: 'They picked up Uttara Karnataka folk and sang it in their own voice, and were among the first women to carry Kannada independent music under their own name.',
    },
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
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Raghu_Dixit',
      youtube: 'https://www.youtube.com/c/RaghuDixitMusic',
    },
  },
  {
    id: 'swarathma',
    name: { kn: 'ಸ್ವರಾತ್ಮ', en: 'Swarathma' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಜಾನಪದ-ರಾಕ್ ಬ್ಯಾಂಡ್. ವೇಷ, ವ್ಯಂಗ್ಯ, ರಾಜಕಾರಣ, ಎಲ್ಲವನ್ನೂ ಒಂದೇ ವೇದಿಕೆಗೆ ಜೋರಾಗಿ ಹೊತ್ತು ತರ್ತಾರೆ.',
      en: 'Bengaluru’s folk-rock band. Costume, satire and politics, all carried onto the same stage and carried loudly.',
    },
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
    links: {
      youtube: 'https://www.youtube.com/@MCBIJJUU',
    },
  },
  {
    id: 'rahul-dit-o',
    name: { kn: 'ರಾಹುಲ್ ಡಿಟ್-ಓ', en: 'Rahul Dit-O' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಹಿಪ್-ಹಾಪ್ ವಲಯವನ್ನು ಕಟ್ಟಿದವರಲ್ಲಿ ಒಬ್ಬರು. ಜೊತೆಗೂಡಿ ಮಾಡುವುದೇ ಇವರ ದಾರಿ, ಇವರ ಒಳ್ಳೆಯ ಹಾಡುಗಳ ಮೇಲೆ ಯಾವಾಗಲೂ ಮೂರು ಹೆಸರಿರುತ್ತವೆ.',
      en: 'One of the builders of the Bengaluru hip-hop scene. Collaboration is the whole method: their best tracks have three names on them.',
    },
    links: {
      youtube: 'https://www.youtube.com/@RahulDitO',
    },
  },
  {
    id: 'lagori',
    name: { kn: 'ಲಗೋರಿ', en: 'Lagori' },
    blurb: {
      kn: 'ಬೀದಿ ಆಟದ ಹೆಸರನ್ನೇ ಇಟ್ಟುಕೊಂಡ ಬ್ಯಾಂಡ್. ಕನ್ನಡ, ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್, ಹಾಡು ಯಾವ ಭಾಷೆಗೆ ಬಿದ್ದರೂ ಅದೇ ಚಡಪಡಿಕೆ.',
      en: 'Named after the street game. Kannada, Hindi or English: the same restless energy in whichever language the song lands in.',
    },
    links: {
      youtube: 'https://www.youtube.com/@Lagoriofficial',
    },
  },
  {
    id: 'sumedh-k',
    name: { kn: 'ಸುಮೇಧ್ ಕೆ', en: 'Sumedh K' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಹಾಡುಗಾರ-ಬರಹಗಾರ. ಇವತ್ತಿನ ಅಲೆಯ ನಡುವೆ ನಿಂತವರು, ಯಾವ ಕನ್ನಡ ಇಂಡಿ ಪಟ್ಟಿ ತೆರೆದರೂ ಅವರ ಹೆಸರು ಇರುತ್ತೆ, ಅದೂ ಒಂದೇ ಸಲ ಅಲ್ಲ.',
      en: 'A Bengaluru singer-songwriter at the centre of the current wave. Open any Kannada indie playlist and their name is on it, usually more than once.',
    },
    links: {
      youtube: 'https://www.youtube.com/@SumedhK',
    },
  },
  {
    id: 'sanjith-hegde',
    name: { kn: 'ಸಂಜಿತ್ ಹೆಗಡೆ', en: 'Sanjith Hegde' },
    blurb: {
      kn: 'ಸಿನಿಮಾ ಹಾಡುಗಾರಿಕೆಯಿಂದ ಬೆಳೆದವರು. ಆದರೆ ಅವರದೇ ಹಾಡುಗಳಲ್ಲಿ ದನಿ ಬೇರೆ, ಮೆತ್ತಗೆ, ಕಿವಿಯ ಪಕ್ಕದಲ್ಲೇ ಹಾಡಿದ ಹಾಗೆ.',
      en: 'They came up through playback, but their own songs are a different and quieter instrument: soft, close-miked.',
    },
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
    links: {
      youtube: 'https://www.youtube.com/@TanmayGururaj',
    },
  },
  {
    id: 'curry',
    name: { kn: 'ಕರ್ರಿ', en: 'Curry' },
    blurb: {
      kn: 'ಕನ್ನಡ ಪದಗಳ ಕೆಳಗೆ ಆಫ್ರೋ-ಬೀಟು ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸದ್ದು. “ಸುಪ್ರಭಾತ” ಇಪಿಯನ್ನು ಒಂದೇ ಕೂರಿಕೆಯಲ್ಲಿ ಕೇಳಬೇಕು.',
      en: 'Afro-beat and electronics under Kannada words. The Suprabhatha EP is meant to be heard in one sitting.',
    },
    links: {
      youtube: 'https://www.youtube.com/@curry.music',
    },
  },
  {
    id: 'narayan-sharma',
    name: { kn: 'ನಾರಾಯಣ್ ಶರ್ಮ', en: 'Narayan Sharma' },
    blurb: {
      kn: 'ಉತ್ತರ ಕನ್ನಡವನ್ನು ಜೊತೆಗೇ ಹೊತ್ತು ತಿರುಗುವ ಹಾಡುಗಳು. ಸಂಗೀತ ಸರಳ, ಆದರೆ ಸಾಲುಗಳು ಮನಸ್ಸಲ್ಲಿ ಉಳಿಯುತ್ತವೆ.',
      en: 'Songs that carry Uttara Kannada around with them. Plain arrangements, lines that stay.',
    },
    links: {
      youtube: 'https://www.youtube.com/channel/UCvOmVgVsgiIxZwtOd28JIKA',
    },
  },
  {
    id: 'pineapple-express',
    name: { kn: 'ಪೈನಾಪಲ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್', en: 'Pineapple Express' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಪ್ರೊಗ್-ಫ್ಯೂಷನ್ ಬ್ಯಾಂಡ್. ಕರ್ನಾಟಕ ಸಂಗೀತ, ಹಿಂದೂಸ್ತಾನಿ, ಮೆಟಲ್, ಎಲ್ಲವನ್ನೂ ಒಂದೇ ಹಾಡಿನಲ್ಲಿ ಹಿಡಿಸ್ತಾರೆ. ಸಾಲುಗಳು ಕನ್ನಡದಿಂದ ಇಂಗ್ಲಿಷಿಗೆ ಸಲೀಸಾಗಿ ಹೊರಳ್ತವೆ.',
      en: 'A Bengaluru prog-fusion band that will put Carnatic, Hindustani and metal inside the same song and make it hold together, switching between Kannada and English as the line needs it.',
    },
    links: {
      youtube: 'https://www.youtube.com/@PineappleExpressMusic',
    },
  },
  {
    id: 'vasuki-vaibhav',
    name: { kn: 'ವಾಸುಕಿ ವೈಭವ್', en: 'Vasuki Vaibhav' },
    blurb: {
      kn: 'ಸಂಯೋಜಕರು, ಗಾಯಕರು, ಬರಹಗಾರರು. ಸಿನಿಮಾ ಕೆಲಸ ಮತ್ತು ತಮ್ಮದೇ ಹಾಡುಗಳ ನಡುವೆ ದನಿ ಬದಲಾಯಿಸದೆ ಓಡಾಡ್ತಾರೆ.',
      en: 'Composer, singer and lyricist, moving between film work and their own releases without changing register much.',
    },
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Vasuki_Vaibhav',
      youtube: 'https://www.youtube.com/@VasukiVaibhav',
    },
  },
  {
    id: 'mitra-hegde',
    name: { kn: 'ಮಿತ್ರಾ ಹೆಗಡೆ', en: 'Mitra Hegde' },
    blurb: {
      kn: 'ಪ್ರೀತಿ, ದುಃಖ, ಬಿಡಲಾಗದ ನೆನಪು: ಇವನ್ನೇ ಹಿಡಿದು ಹಾಡು ಕಟ್ಟುತ್ತಾರೆ. ದನಿಯಲ್ಲಿ ಅವಸರವಿಲ್ಲ.',
      en: 'They build songs out of love, grief and the memories that will not let go. Never a note in a hurry.',
    },
    links: {
      youtube: 'https://www.youtube.com/@MitraHegde',
    },
  },
  {
    id: 'adhvik',
    name: { kn: 'ಅಧ್ವಿಕ್', en: 'Adhvik' },
    blurb: {
      kn: 'ಕನ್ನಡ ಇಂಡಿಯಲ್ಲಿ ಸತತವಾಗಿ ಹಾಡು ಬಿಡುಗಡೆ ಮಾಡುತ್ತಿರುವವರು. ಅಲೆಮಾರಿತನವೇ ಇವರ ಬಹುತೇಕ ಹಾಡುಗಳ ಜೀವ.',
      en: 'One of the steadiest release schedules in Kannada indie. Restlessness runs through most of what they write.',
    },
    links: {
      youtube: 'https://www.youtube.com/@TheRealAdhvik',
    },
  },
  {
    id: 'mysore-xpress',
    name: { kn: 'ಮೈಸೂರ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್', en: 'Mysore Xpress' },
    blurb: {
      kn: 'ಮೈಸೂರಿನ ಬ್ಯಾಂಡ್, ಮೈಸೂರಿನ ಬಗ್ಗೆಯೇ ಹಾಡುಗಳು. ಊರಿನ ಹೆಮ್ಮೆಯನ್ನು ಸದ್ದಿಲ್ಲದೆ ಹೊತ್ತವರು.',
      en: 'A Mysuru band singing about Mysuru, carrying the pride of the place without ever shouting about it.',
    },
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
  },
  {
    id: 'karthik-chennoji-rao',
    name: { kn: 'ಕಾರ್ತಿಕ್ ಚೆನ್ನೋಜಿ ರಾವ್', en: 'Karthik Chennoji Rao' },
    blurb: {
      kn: 'ಇಂಡಿ ರಾಕ್‌ನಿಂದ ಸಿನಿಮಾದವರೆಗೆ ನಡೆದವರು. ಸೊಲೊ ಹಾಡುಗಳಲ್ಲಿ ದನಿ ಹೆಚ್ಚು ಸರಳ, ಹೆಚ್ಚು ಹತ್ತಿರ.',
      en: 'They came from indie rock into film work. On their own releases the voice is plainer and much closer.',
    },
    links: {
      youtube: 'https://www.youtube.com/@karthikchennojirao',
    },
  },
  {
    id: 'chirayu',
    name: { kn: 'ಚಿರಾಯು', en: 'Chirayu' },
    blurb: {
      kn: 'ಕನ್ನಡ ರ‍್ಯಾಪಿನ ಹೊಸ ದನಿಗಳಲ್ಲಿ ಒಬ್ಬರು. ಬರವಣಿಗೆ ವೇಗವಾಗಿದ್ದರೂ ಮಾತು ಸ್ಪಷ್ಟ.',
      en: 'One of the newer voices in Kannada rap. The writing moves fast but never blurs.',
    },
  },
  {
    id: 'varijashree-venugopal',
    name: { kn: 'ವರಿಜಾಶ್ರೀ ವೇಣುಗೋಪಾಲ್', en: 'Varijashree Venugopal' },
    blurb: {
      kn: 'ಕರ್ನಾಟಕ ಸಂಗೀತ, ಜಾಝ್, ಕೊಳಲು, ಮತ್ತು ದನಿಯನ್ನೇ ವಾದ್ಯವಾಗಿಸುವ ಕಲೆ. ಜಗತ್ತಿನ ವೇದಿಕೆಗಳಲ್ಲಿ ಕನ್ನಡವನ್ನು ಹಾಡುತ್ತಿರುವವರು.',
      en: 'Carnatic training, jazz phrasing, flute, and a voice used as an instrument in its own right. They sing Kannada on stages a long way from home.',
    },
    links: {
      wikipedia: 'https://en.wikipedia.org/wiki/Varijashree_Venugopal',
      youtube: 'https://www.youtube.com/c/Varijashree',
    },
  },
  {
    id: 'kutcheri',
    name: { kn: 'ಕಚೇರಿ', en: 'Kutcheri' },
    blurb: {
      kn: 'ಬೆಂಗಳೂರಿನ ಇಂಡಿ ರಾಕ್ ಬ್ಯಾಂಡ್. ಒಪ್ಪಿಗೆ ಸಿಗದ ಪ್ರೀತಿಯ ಬಗ್ಗೆ ಇವರಷ್ಟು ನೇರವಾಗಿ ಬರೆದವರು ಕಡಿಮೆ.',
      en: 'A Bengaluru indie rock band. Few people write about unreturned love this plainly.',
    },
  },
  {
    id: 'vishwi',
    name: { kn: 'ವಿಶ್ವಿ', en: 'Vishwi' },
    blurb: {
      kn: 'ಬದುಕೇ ಒಂದು ಸವಾರಿ ಎಂಬ ಹಾಡು. ಹಿತ್ತಾಳೆ ವಾದ್ಯಗಳ ಸದ್ದು ಕನ್ನಡ ಇಂಡಿಯಲ್ಲಿ ಅಪರೂಪ.',
      en: 'A song about life as one long ride. Brass this bright is rare in Kannada indie.',
    },
    links: {
      youtube: 'https://www.youtube.com/@vishwi',
    },
  },
  {
    id: 'tarana',
    name: { kn: 'ತರಾನಾ', en: 'Tarana' },
    blurb: {
      kn: 'ಕಳೆದುಹೋದ ದಿನಗಳ ಬಗ್ಗೆ ಬರೆದ ಹಾಡು. ಸದ್ದು ಕಡಿಮೆ, ಉಳಿಯುವುದು ಹೆಚ್ಚು.',
      en: 'A song about days that have already gone. Quiet on the surface, and it stays.',
    },
    links: {
      youtube: 'https://www.youtube.com/@Tarana_theband',
    },
  },
  {
    id: 'suraj-km',
    name: { kn: 'ಸೂರಜ್ ಕೆ.ಎಂ.', en: 'Suraj KM' },
    blurb: {
      kn: 'ಸ್ವಂತ ಚಾನೆಲ್ಲಿನಲ್ಲೇ ಒಂದೊಂದಾಗಿ ಹಾಡು ಹಾಕುತ್ತ ಬೆಳೆದವರು. ಯಾವ ಲೇಬಲ್ಲಿನ ಹಂಗೂ ಇಲ್ಲ.',
      en: 'They built it up one upload at a time on their own channel, without a label anywhere in sight.',
    },
    links: {
      youtube: 'https://www.youtube.com/@suraj_km',
    },
  },
  {
    id: 'mamta-sagar',
    name: { kn: 'ಮಮತಾ ಸಾಗರ್', en: 'Mamta Sagar' },
    blurb: {
      kn: 'ಕನ್ನಡದ ಕವಿ ಮತ್ತು ನಾಟಕಕಾರರು. ನದಿಯೊಳಗೆ ಹಾಡು ಇವರ ಸಾಲುಗಳ ಮೇಲೆ ನಿಂತಿದೆ.',
      en: 'A Kannada poet and playwright. Nadiyolage is built on their lines.',
    },
  },
  {
    id: 'kanakadasa',
    name: { kn: 'ಕನಕದಾಸರು', en: 'Kanakadasa' },
    blurb: {
      kn: '೧೬ನೇ ಶತಮಾನದ ಹರಿದಾಸರು. ಇವರ ಕೀರ್ತನೆಗಳು ಈಗಲೂ ಹೊಸ ಧ್ವನಿಗಳಲ್ಲಿ ಹಾಡಲ್ಪಡ್ತಿವೆ.',
      en: 'The 16th century Haridasa poet, still being sung in new voices four hundred years on.',
    },
  },
  {
    id: 'shishunala-sharifa',
    name: { kn: 'ಶಿಶುನಾಳ ಶರೀಫರು', en: 'Shishunala Sharifa' },
    blurb: {
      kn: '೧೯ನೇ ಶತಮಾನದ ಸಂತ ಕವಿ. ಸರಳ ಸಾಲುಗಳಲ್ಲಿ ದೊಡ್ಡ ಪ್ರಶ್ನೆಗಳನ್ನು ಇಟ್ಟವರು.',
      en: 'The 19th century saint-poet who put the largest questions into the plainest lines.',
    },
  },
  {
    id: 'kiran-kipo',
    name: { kn: 'ಕಿರಣ್ ಕಿಪೊ', en: 'Kiran kiPo' },
  },
  {
    id: 's-i-d',
    name: { kn: 'ಎಸ್.ಐ.ಡಿ.', en: 'S.I.D' },
  },
  {
    id: 'chiranthana-am',
    name: { kn: 'ಚಿರಂತನ ಎ.ಎಂ.', en: 'Chiranthana AM' },
  },
  {
    id: 'sumant-shridhar',
    name: { kn: 'ಸುಮಂತ್ ಶ್ರೀಧರ್', en: 'Sumant Shridhar' },
  },
  {
    id: 'aditi-prahalad',
    name: { kn: 'ಅದಿತಿ ಪ್ರಹ್ಲಾದ್', en: 'Aditi Prahalad' },
  },
  {
    id: 'ashwin-mandoth',
    name: { kn: 'ಅಶ್ವಿನ್ ಮಂಡೋತ್', en: 'Ashwin Mandoth' },
  },
  {
    id: 'manish-kodira',
    name: { kn: 'ಮನೀಶ್ ಕೊಡಿರ', en: 'Manish Kodira' },
  },
  {
    id: 'sanjana-doss',
    name: { kn: 'ಸಂಜನಾ ಡಾಸ್', en: 'Sanjana Doss' },
  },
  {
    id: 'bijoy-shetty',
    name: { kn: 'ಬಿಜೊಯ್ ಶೆಟ್ಟಿ', en: 'Bijoy Shetty' },
  },
  {
    id: 'sonu-nigam',
    name: { kn: 'ಸೋನು ನಿಗಮ್', en: 'Sonu Nigam' },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Sonu_Nigam' },
  },
  {
    id: 'nagarjun-sharma',
    name: { kn: 'ನಾಗಾರ್ಜುನ್ ಶರ್ಮ', en: 'Nagarjun Sharma' },
  },
  {
    id: 'jerusha-christopher',
    name: { kn: 'ಜೆರುಷಾ ಕ್ರಿಸ್ಟೋಫರ್', en: 'Jerusha Christopher' },
  },
  {
    id: 'mayuri-nataraja',
    name: { kn: 'ಮಯೂರಿ ನಟರಾಜ', en: 'Mayuri Nataraja' },
  },
  {
    id: 'prakyath-narayan',
    name: { kn: 'ಪ್ರಖ್ಯಾತ್ ನಾರಾಯಣ್', en: 'Prakyath Narayan' },
  },
  {
    id: 'chinmayee',
    name: { kn: 'ಚಿನ್ಮಯೀ', en: 'Chinmayee' },
  },
  {
    id: 'avinash-balekkala',
    name: { kn: 'ಅವಿನಾಶ್ ಬಾಳೆಕ್ಕಳ', en: 'Avinash Balekkala' },
  },
  {
    id: 'priya-mali',
    name: { kn: 'ಪ್ರಿಯಾ ಮಾಲಿ', en: 'Priya Mali' },
  },
  {
    id: 'harsh',
    name: { kn: 'ಹರ್ಷ್', en: 'Harsh' },
  },
  {
    id: 'aishwarya-rangarajan',
    name: { kn: 'ಐಶ್ವರ್ಯಾ ರಂಗರಾಜನ್', en: 'Aishwarya Rangarajan' },
  },
  {
    id: 'thanusha-km',
    name: { kn: 'ತನುಷಾ ಕೆ.ಎಂ.', en: 'Thanusha K M' },
  },
  {
    id: 'keerthan-holla',
    name: { kn: 'ಕೀರ್ತನ್ ಹೊಳ್ಳ', en: 'Keerthan Holla' },
  },
  {
    id: 'bela-fleck',
    name: { kn: 'ಬೇಲಾ ಫ್ಲೆಕ್', en: 'Béla Fleck' },
    blurb: {
      kn: 'ಅಮೆರಿಕದ ಬ್ಯಾಂಜೊ ವಾದಕರು. ರಂಜನಿಯಲ್ಲಿ ವರಿಜಾಶ್ರೀ ಜೊತೆ ನುಡಿಸಿದವರು.',
      en: 'The American banjo player, alongside Varijashree on Ranjani.',
    },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/B%C3%A9la_Fleck' },
  },
  {
    id: 'yazin-nizar',
    name: { kn: 'ಯಾಜಿನ್ ನಿಜಾರ್', en: 'Yazin Nizar' },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Yazin_Nizar' },
  },
  {
    id: 'sparsha-rk',
    name: { kn: 'ಸ್ಪರ್ಶ ಆರ್.ಕೆ.', en: 'Sparsha RK' },
  },
  {
    id: 'kiran-kaverappa',
    name: { kn: 'ಕಿರಣ್ ಕಾವೇರಪ್ಪ', en: 'Kiran Kaverappa' },
  },
  {
    id: 'phani-kalyan',
    name: { kn: 'ಫಣಿ ಕಲ್ಯಾಣ್', en: 'Phani Kalyan' },
  },
  {
    id: 'da-ra-bendre',
    name: { kn: 'ದ.ರಾ. ಬೇಂದ್ರೆ', en: 'Da Ra Bendre' },
    blurb: {
      kn: 'ವರಕವಿ. ಕನ್ನಡದ ದೊಡ್ಡ ಕವಿಗಳಲ್ಲಿ ಒಬ್ಬರು, ಜ್ಞಾನಪೀಠ ಪಡೆದವರು. ಧಾರವಾಡದ ಮಾತಿನ ಲಯವನ್ನೇ ಕವಿತೆ ಮಾಡಿದವರು.',
      en: 'One of the great Kannada poets, a Jnanpith laureate, who made the rhythm of Dharwad speech into verse.',
    },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/D._R._Bendre' },
  },
  {
    id: 'raghavendra-kamath',
    name: { kn: 'ರಾಘವೇಂದ್ರ ಕಾಮತ್', en: 'Raghavendra Kamath' },
  },
  {
    id: 'pramod-maravante',
    name: { kn: 'ಪ್ರಮೋದ್ ಮರವಂತೆ', en: 'Pramod Maravante' },
  },
  {
    id: 'rajhesh-vaidhya',
    name: { kn: 'ರಾಜೇಶ್ ವೈದ್ಯ', en: 'Rajhesh Vaidhya' },
  },
  {
    id: 'rafael-rocha',
    name: { kn: 'ರಫೆಲ್ ರೋಚಾ', en: 'Rafael Rocha' },
  },
  {
    id: 'michael-league',
    name: { kn: 'ಮೈಕೆಲ್ ಲೀಗ್', en: 'Michael League' },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Michael_League' },
  },
  {
    id: 'praveen-d-rao',
    name: { kn: 'ಪ್ರವೀಣ್ ಡಿ. ರಾವ್', en: 'Praveen D Rao' },
  },
  {
    id: 'samyukta-hornad',
    name: { kn: 'ಸಂಯುಕ್ತಾ ಹೊರನಾಡು', en: 'Samyukta Hornad' },
  },
  {
    id: 'girish-karnad',
    name: { kn: 'ಗಿರೀಶ್ ಕಾರ್ನಾಡ್', en: 'Girish Karnad' },
    blurb: {
      kn: 'ನಾಟಕಕಾರರು, ನಟರು, ನಿರ್ದೇಶಕರು. ಜ್ಞಾನಪೀಠ ಪಡೆದವರು. ಇವರ ರಂಗಗೀತೆಗಳು ಇವತ್ತಿಗೂ ಹೊಸ ದನಿಗಳಲ್ಲಿ ಕೇಳ್ತಿವೆ.',
      en: 'Playwright, actor and director, a Jnanpith laureate. His songs for the stage are still being picked up by new voices.',
    },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Girish_Karnad' },
  },
  {
    id: 'b-v-karanth',
    name: { kn: 'ಬಿ.ವಿ. ಕಾರಂತ', en: 'B V Karanth' },
    blurb: {
      kn: 'ಕನ್ನಡ ರಂಗಭೂಮಿಯ ಸಂಗೀತವನ್ನೇ ಬದಲಾಯಿಸಿದವರು. ನಾಟಕದ ಹಾಡು ಹೇಗಿರಬೇಕು ಅನ್ನೋದನ್ನ ಹೊಸದಾಗಿ ಬರೆದವರು.',
      en: 'The man who rewrote what music in Kannada theatre could sound like.',
    },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/B._V._Karanth' },
  },
  {
    id: 'jubair-muhammed',
    name: { kn: 'ಜುಬೈರ್ ಮುಹಮ್ಮದ್', en: 'Jubair Muhammed' },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Jubair_Muhammed' },
  },
  {
    id: 'pramod-acharya',
    name: { kn: 'ಪ್ರಮೋದ್ ಆಚಾರ್ಯ', en: 'Pramod Acharya' },
  },
  {
    id: 'kuvempu',
    name: { kn: 'ಕುವೆಂಪು', en: 'Kuvempu' },
    blurb: {
      kn: 'ರಾಷ್ಟ್ರಕವಿ. ಕನ್ನಡದ ಮೊದಲ ಜ್ಞಾನಪೀಠ. ಇವರ ಸಾಲುಗಳು ಇವತ್ತಿಗೂ ಹೊಸ ರಾಗ ಹಿಡೀತಿವೆ.',
      en: 'The Rashtrakavi, and the first Jnanpith in Kannada. His lines keep finding new tunes.',
    },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Kuvempu' },
  },
  {
    id: 'basavanna',
    name: { kn: 'ಬಸವಣ್ಣ', en: 'Basavanna' },
    blurb: {
      kn: '೧೨ನೇ ಶತಮಾನದ ವಚನಕಾರರು, ಸಮಾಜ ಸುಧಾರಕರು. ದೇವರನ್ನ ಮಾತಾಡಿಸಿದಷ್ಟೇ ಸಲೀಸಾಗಿ ಜಾತಿಯನ್ನೂ ಪ್ರಶ್ನಿಸಿದವರು.',
      en: 'The 12th century vachanakara and reformer, who questioned caste as plainly as he addressed god.',
    },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Basava' },
  },
  {
    id: 'purandara-dasa',
    name: { kn: 'ಪುರಂದರ ದಾಸರು', en: 'Purandara Dasa' },
    blurb: {
      kn: 'ಕರ್ನಾಟಕ ಸಂಗೀತದ ಪಿತಾಮಹ. ಐನೂರು ವರ್ಷ ಆದರೂ ಇವರ ಪದಗಳು ಹೊಸ ಬ್ಯಾಂಡುಗಳ ಬಾಯಲ್ಲಿ ಇವೆ.',
      en: 'The grandfather of Carnatic music. Five hundred years on, his songs are still in the mouths of new bands.',
    },
    links: { wikipedia: 'https://en.wikipedia.org/wiki/Purandara_Dasa' },
  },
  {
    id: 'manju-pavagada',
    name: { kn: 'ಮಂಜು ಪಾವಗಡ', en: 'Manju Pavagada' },
  },
  {
    id: 'rd-tillu',
    name: { kn: 'ಆರ್.ಡಿ. ತಿಲ್ಲು', en: 'RD Tillu' },
  },
  {
    id: 'aadarsh-subramaniam',
    name: { kn: 'ಆದರ್ಶ್ ಸುಬ್ರಮಣಿಯನ್', en: 'Aadarsh Subramaniam' },
  },
  {
    id: 'shivakumar-mavali',
    name: { kn: 'ಶಿವಕುಮಾರ್ ಮಾವಳಿ', en: 'Shivakumar Mavali' },
  },
  {
    id: 'maadeva',
    name: { kn: 'ಮಾದೇವ', en: 'Maadeva' },
  },
  {
    id: 'anup-kr',
    name: { kn: 'ಅನೂಪ್ ಕೆ.ಆರ್.', en: 'Anup K.R.' },
    blurb: {
      kn: 'ಲೂಪ್ ಸ್ಟೇಷನ್ ಇಟ್ಟುಕೊಂಡು ವೇದಿಕೆಯ ಮೇಲೇ ಹಾಡು ಕಟ್ಟುವವರು. ಬೀಟ್‌ಬಾಕ್ಸ್, ರಾಪ್, ಹಾಡುಗಾರಿಕೆ, ಎಲ್ಲವೂ ಒಂದೇ ದನಿಯಿಂದ.',
      en: 'Builds a song on stage out of a loop station: the beatbox, the rap and the singing all come out of one voice.',
    },
    links: { youtube: 'https://www.youtube.com/@anupk.r.5012' },
  },
  {
    id: 'raghothama-ns',
    name: { kn: 'ರಘೋತ್ತಮ ಎನ್.ಎಸ್.', en: 'Raghothama NS' },
  },
  {
    id: 'pratap-bhatt',
    name: { kn: 'ಪ್ರತಾಪ್ ಭಟ್', en: 'Pratap Bhatt' },
  },
]

/**
 * Every song, in tape order. `credits[0]` is the billed lead.
 *
 * Order here is the running order of the site's default queue, so it is
 * authored rather than sorted; the song list re-sorts for display.
 */
export const songs: Song[] = [
  {
    id: 'nadiyolage',
    title: 'Nadiyolage',
    titleKn: 'ನದಿಯೊಳಗೆ',
    youtubeId: '6WuoRV66ti8',
    credits: [{ artist: 'vasu-dixit' }, { artist: 'mamta-sagar', role: 'words' }],
    genres: ['folk'],
    moods: ['latenight', 'longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'yellaaru-maaduvdu',
    title: 'Yellaaru Maaduvdu',
    titleKn: 'ಎಲ್ಲಾರು ಮಾಡುವುದು',
    youtubeId: 'rge-N2izCr4',
    credits: [{ artist: 'vasu-dixit' }, { artist: 'kanakadasa', role: 'words' }],
    genres: ['devotional', 'folk'],
    moods: ['latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'neelamegha',
    title: 'Neelamegha',
    titleKn: 'ನೀಲಮೇಘ',
    youtubeId: 'GlVj43_S1mw',
    credits: [{ artist: 'vasu-dixit' }],
    genres: ['folk'],
    moods: ['longing', 'rain', 'focus'],
    childSafe: true,
  },
  {
    id: 'nee-hinga-nodabyada',
    title: 'Nee Hinga Nodabyada',
    titleKn: 'ನೀ ಹಿಂಗ ನೋಡಬ್ಯಾಡ',
    youtubeId: '3zB7KJmtecw',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['folk'],
    moods: ['longing', 'joy'],
    childSafe: true,
  },
  {
    id: 'nee-hinga-nodabyada-2-0',
    title: 'Nee Hinga Nodabyada 2.0',
    titleKn: 'ನೀ ಹಿಂಗ ನೋಡಬ್ಯಾಡ ೨.೦',
    youtubeId: 'W1HQJnn3rFo',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['folk', 'electronic'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'kodagana-koli-nungitha',
    title: 'Kodagana Koli Nungitha',
    titleKn: 'ಕೊಡಗನ ಕೋಳಿ ನುಂಗಿತ್ತ',
    youtubeId: 'Af55JPHuRjs',
    credits: [{ artist: 'raghu-dixit' }, { artist: 'shishunala-sharifa', role: 'words' }],
    genres: ['devotional', 'folk'],
    moods: ['latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'parasiva',
    title: 'Parasiva',
    titleKn: 'ಪರಶಿವ',
    youtubeId: '63PTx_1WEq4',
    credits: [
      { artist: 'raghu-dixit' },
      { artist: 'raghavendra-kamath', role: 'words' },
    ],
    genres: ['devotional', 'folk'],
    moods: ['latenight', 'focus'],
    childSafe: true,
  },
  {
    // Sharifa again, from the same Courtyard Jam Sessions as Kodagana Koli.
    id: 'lokada-kalaji',
    title: 'Lokada Kalaji',
    titleKn: 'ಲೋಕದ ಕಾಳಜಿ',
    youtubeId: 'e4h0VoZpdI8',
    credits: [{ artist: 'raghu-dixit' }, { artist: 'shishunala-sharifa', role: 'words' }],
    genres: ['devotional', 'folk'],
    moods: ['latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'gudugudiya-sedi-nodo',
    title: 'Gudugudiya Sedi Nodo',
    titleKn: 'ಗುಡುಗುಡಿಯ ಸೇದಿ ನೋಡೋ',
    youtubeId: '99138T2WeOQ',
    credits: [{ artist: 'raghu-dixit' }, { artist: 'shishunala-sharifa', role: 'words' }],
    genres: ['devotional', 'folk'],
    moods: ['joy', 'focus'],
    childSafe: true,
  },
  {
    // From Shakkar (2024). Not the Adhvik song of the same name.
    id: 'alemaari-raghu-dixit',
    title: 'Alemaari',
    titleKn: 'ಅಲೆಮಾರಿ',
    youtubeId: 'RqLSlcm32WI',
    credits: [
      { artist: 'raghu-dixit' },
      { artist: 'rajhesh-vaidhya', role: 'featured' },
      { artist: 'kiran-kaverappa', role: 'words' },
    ],
    genres: ['folk', 'fusion'],
    moods: ['road', 'restless'],
    childSafe: true,
  },
  {
    // Bendre's lines, set to a trumpet-heavy Kannada folk rhythm.
    id: 'kudilikke-hatthidyanna',
    title: 'Kudilikke Hatthidyanna',
    titleKn: 'ಕುಡಿಲಿಕ್ಕೆ ಹತ್ತಿದ್ಯಣ್ಣಾ',
    youtubeId: 'lfkNnd7aG_s',
    credits: [
      { artist: 'raghu-dixit' },
      { artist: 'rafael-rocha', role: 'featured' },
      { artist: 'da-ra-bendre', role: 'words' },
    ],
    genres: ['folk', 'fusion'],
    moods: ['joy', 'restless'],
  },
  {
    id: 'geeya-geeya',
    title: 'Geeya Geeya',
    titleKn: 'ಗೀಯಾ ಗೀಯಾ',
    youtubeId: 'rkz2-fI7rTo',
    credits: [
      { artist: 'raghu-dixit' },
      { artist: 'michael-league', role: 'featured' },
      { artist: 'praveen-d-rao', role: 'featured' },
      { artist: 'vasuki-vaibhav', role: 'words' },
    ],
    genres: ['folk', 'fusion'],
    moods: ['joy', 'road'],
    childSafe: true,
  },
  {
    // The Kannada telling of Shakkarpari, with the same banjo on it.
    id: 'sakkare-chakori',
    title: 'Sakkare Chakori',
    titleKn: 'ಸಕ್ಕರೆ ಚಕೋರಿ',
    youtubeId: 'zW2T9GWlVnk',
    credits: [
      { artist: 'raghu-dixit' },
      { artist: 'bela-fleck', role: 'featured' },
      { artist: 'kiran-kaverappa', role: 'words' },
    ],
    genres: ['folk', 'fusion'],
    moods: ['joy', 'longing'],
    childSafe: true,
  },
  {
    id: 'tsunami',
    title: 'Tsunami',
    titleKn: 'ಸುನಾಮಿ',
    youtubeId: 'jrHuE2XfZSs',
    credits: [
      { artist: 'raghu-dixit' },
      { artist: 'samyukta-hornad', role: 'featured' },
      { artist: 'raghavendra-kamath', role: 'words' },
    ],
    genres: ['folk', 'rock'],
    moods: ['restless', 'joy'],
    childSafe: true,
  },
  {
    // The Tamil Amma from Jag Changa, rewritten in Kannada and released on
    // its own for Mother's Day.
    id: 'amma',
    title: 'Amma',
    titleKn: 'ಅಮ್ಮ',
    youtubeId: 'xg5Hc5TOZJE',
    credits: [
      { artist: 'raghu-dixit' },
      { artist: 'pramod-maravante', role: 'words' },
    ],
    genres: ['folk'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'jangama',
    title: 'Jangama',
    titleKn: 'ಜಂಗಮ',
    youtubeId: 'ZeNR1ZzvNlQ',
    credits: [{ artist: 'swarathma' }],
    genres: ['folk', 'rock'],
    moods: ['restless'],
    childSafe: true,
  },
  {
    id: 'belongaluru',
    title: 'Belongaluru',
    titleKn: 'ಬೆಲಾಂಗ್ಳೂರು',
    youtubeId: 'ZvX3pLloaps',
    credits: [{ artist: 'swarathma' }],
    genres: ['rock'],
    moods: ['restless', 'road'],
  },
  {
    id: 'dont-worry',
    title: "Don't Worry",
    titleKn: 'ಡೋಂಟ್ ವರಿ',
    youtubeId: 'ksANu45I16U',
    credits: [{ artist: 'all-ok' }],
    genres: ['hiphop'],
    moods: ['joy'],
  },
  {
    id: 'yaakinge',
    title: 'Yaakinge',
    titleKn: 'ಯಾಕಿಂಗೆ',
    youtubeId: 'Asts0TK82s8',
    credits: [{ artist: 'all-ok' }],
    genres: ['hiphop'],
    moods: ['longing'],
  },
  {
    id: 'nan-kannadiga',
    title: 'Nan Kannadiga',
    titleKn: 'ನಾನ್ ಕನ್ನಡಿಗ',
    youtubeId: 'Sl_JnlsZIVs',
    credits: [
      { artist: 'all-ok' },
      { artist: 'rahul-dit-o', role: 'featured' },
      { artist: 'mc-bijju', role: 'featured' },
    ],
    genres: ['hiphop'],
    moods: ['restless', 'joy'],
  },
  {
    id: 'thaderahita',
    title: 'Thaderahita',
    titleKn: 'ತಡೆರಹಿತ',
    youtubeId: 'EXHmUGAzUMc',
    credits: [{ artist: 'mc-bijju' }, { artist: 'kiran-kipo', role: 'featured' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    id: 'ivathilla-naale',
    title: 'Ivathilla Naale',
    titleKn: 'ಇವತ್ತಿಲ್ಲ ನಾಳೆ',
    youtubeId: 'JFoWHiIzR98',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    id: 'kaage',
    title: 'Kaage',
    titleKn: 'ಕಾಗೆ',
    youtubeId: 'bDkN8k-DWwA',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['restless', 'latenight'],
  },
  {
    id: 'lit',
    title: 'LIT',
    titleKn: 'ಲಿಟ್',
    youtubeId: 'xlCsTl8YNnA',
    credits: [
      { artist: 'rahul-dit-o' },
      { artist: 's-i-d', role: 'with' },
      { artist: 'mc-bijju', role: 'with' },
    ],
    genres: ['hiphop'],
    moods: ['restless', 'joy'],
  },
  {
    id: 'swaha',
    title: 'Swaha',
    titleKn: 'ಸ್ವಾಹಾ',
    youtubeId: 'G8Y1Hiyxm2E',
    credits: [
      { artist: 'lagori' },
      { artist: 'rahul-dit-o', role: 'with' },
      { artist: 'mc-bijju', role: 'with' },
    ],
    genres: ['hiphop', 'rock'],
    moods: ['restless'],
  },
  {
    id: 'helkolakondooru',
    title: 'Helkolakondooru',
    titleKn: 'ಹೇಳ್ಕೊಳಕ್ಕೊಂದೂರು',
    youtubeId: 'GJE9wfXZ3ww',
    credits: [{ artist: 'lagori' }],
    genres: ['rock'],
    moods: ['joy'],
  },
  {
    id: 'tulasi',
    title: 'Tulasi',
    titleKn: 'ತುಳಸಿ',
    youtubeId: 'Y8ZApXcnhy4',
    credits: [{ artist: 'sumedh-k' }, { artist: 'sumant-shridhar', role: 'with' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'maaye',
    title: 'Maaye',
    titleKn: 'ಮಾಯೆ',
    youtubeId: 'Yxx-zTuw1xE',
    credits: [{ artist: 'sumedh-k' }],
    genres: ['indiepop'],
    moods: ['latenight', 'longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'saagara',
    title: 'Saagara',
    titleKn: 'ಸಾಗರ',
    youtubeId: 'ZcRGOUJXJQg',
    credits: [{ artist: 'chiranthana-am' }, { artist: 'sumedh-k', role: 'with' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    // "- Topic" is YouTube's auto-generated official channel for a label's catalogue, not a fan re-upload.
    id: 'daaha',
    title: 'Daaha',
    titleKn: 'ದಾಹ',
    youtubeId: 'CirEMx-__no',
    credits: [{ artist: 'sumedh-k' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    // Uploaded on Mitra Hegde's channel, who sings on it. Still official.
    id: 'meghave',
    title: 'Meghave',
    titleKn: 'ಮೇಘವೇ',
    youtubeId: 'e9cAxbdivFw',
    credits: [
      { artist: 'sumedh-k' },
      { artist: 'aditi-prahalad', role: 'featured' },
      { artist: 'ashwin-mandoth', role: 'featured' },
      { artist: 'mitra-hegde', role: 'featured' },
    ],
    genres: ['indiepop'],
    moods: ['rain', 'longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'kareyole',
    title: 'Kareyole',
    titleKn: 'ಕರೆಯೊಲೆ',
    youtubeId: 'HSzJL-GJBHc',
    credits: [{ artist: 'sanjith-hegde' }],
    genres: ['indiepop'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'nange-allava',
    title: 'Nange Allava',
    titleKn: 'ನಂಗೆ ಅಲ್ಲವಾ',
    youtubeId: 'RVMnT4nq9NU',
    credits: [{ artist: 'sanjith-hegde' }, { artist: 'sanjana-doss', role: 'with' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    // Draws on Purandaradasa's "Tarakka Bindige".
    id: 'taare-bindigeya',
    title: 'Taare Bindigeya',
    titleKn: 'ತಾರೆ ಬಿಂದಿಗೆಯ',
    youtubeId: 'HzpOXAHJN1M',
    credits: [{ artist: 'sanjith-hegde' }, { artist: 'bijoy-shetty', role: 'with' }],
    genres: ['devotional', 'indiepop'],
    moods: ['latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'maayavi',
    title: 'Maayavi',
    titleKn: 'ಮಾಯಾವಿ',
    youtubeId: 'TMY1g8pAktk',
    credits: [
      { artist: 'sonu-nigam' },
      { artist: 'sanjith-hegde' },
      { artist: 'nagarjun-sharma', role: 'with' },
    ],
    genres: ['indiepop'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'ninna-notavu',
    title: 'Ninna Notavu',
    titleKn: 'ನಿನ್ನ ನೋಟವು',
    youtubeId: 'FDCc2beB77I',
    credits: [{ artist: 'tanmay-gururaj' }],
    genres: ['indiepop'],
    moods: ['longing', 'joy'],
    childSafe: true,
  },
  {
    id: 'nasheya-gungale',
    title: 'Nasheya Gungale',
    titleKn: 'ನಶೆಯ ಗುಂಗಲೆ',
    youtubeId: '9dlbKgxvg_A',
    credits: [{ artist: 'tanmay-gururaj' }, { artist: 'jerusha-christopher', role: 'featured' }],
    genres: ['indiepop'],
    moods: ['latenight', 'longing'],
  },
  {
    // Official upload from Madhura Audio. Words by Kiran Kaverappa, composed by Phani Kalyan.
    id: 'neene',
    title: 'Neene',
    titleKn: 'ನೀನೇ',
    youtubeId: 'xRWXjBavcqY',
    credits: [
      { artist: 'yazin-nizar' },
      { artist: 'sparsha-rk' },
      { artist: 'kiran-kaverappa', role: 'words' },
      { artist: 'phani-kalyan', role: 'music' },
    ],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'seetha-kalyana',
    title: 'Seetha Kalyana',
    titleKn: 'ಸೀತಾ ಕಲ್ಯಾಣ',
    youtubeId: 'wsGnsRa5wxE',
    credits: [{ artist: 'curry' }],
    genres: ['electronic', 'indiepop'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'nannavale',
    title: 'Nannavale',
    titleKn: 'ನನ್ನವಳೆ',
    youtubeId: 'egbFaBl8Of4',
    credits: [{ artist: 'curry' }],
    genres: ['electronic'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'manase',
    title: 'Manase',
    titleKn: 'ಮನಸೆ',
    youtubeId: 'yQOjJLdzJqY',
    credits: [{ artist: 'curry' }],
    genres: ['electronic'],
    moods: ['latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'bhasavagide',
    title: 'Bhasavagide',
    titleKn: 'ಭಾಸವಾಗಿದೆ',
    youtubeId: 'J8IQ40P9e08',
    credits: [{ artist: 'narayan-sharma' }],
    genres: ['indiepop', 'folk'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'baanancha-daati',
    title: 'Baanancha Daati',
    titleKn: 'ಬಾನಂಚ ದಾಟಿ',
    youtubeId: '3YbVZ5f4Gj0',
    credits: [{ artist: 'narayan-sharma' }, { artist: 'sumedh-k', role: 'with' }],
    genres: ['indiepop'],
    moods: ['road', 'longing'],
    childSafe: true,
  },
  {
    id: 'uttara-kannada',
    title: 'Uttara Kannada',
    titleKn: 'ಉತ್ತರ ಕನ್ನಡ',
    youtubeId: 'BJ-gIBC4w5g',
    credits: [{ artist: 'narayan-sharma' }],
    genres: ['folk'],
    moods: ['road', 'rain', 'focus'],
    childSafe: true,
  },
  {
    id: 'fineapple',
    title: 'Fineapple',
    titleKn: 'ಫೈನಾಪಲ್',
    youtubeId: 'ol6mmFtZbJY',
    credits: [{ artist: 'pineapple-express' }],
    genres: ['fusion'],
    moods: ['joy', 'restless'],
  },
  {
    // A theatre classic, not a film song: Karanth's tune and Karnad's words,
    // taken off the stage and cut as a single in 2023.
    id: 'gajavadana',
    title: 'Gajavadana',
    titleKn: 'ಗಜವದನ',
    youtubeId: '942-EZTHELs',
    credits: [
      { artist: 'vasuki-vaibhav' },
      { artist: 'b-v-karanth', role: 'music' },
      { artist: 'girish-karnad', role: 'words' },
    ],
    genres: ['devotional', 'folk'],
    moods: ['focus', 'joy'],
    childSafe: true,
  },
  {
    id: 'last-seen',
    title: 'Last Seen',
    titleKn: 'ಲಾಸ್ಟ್ ಸೀನ್',
    youtubeId: 'HDvHzdP7I1Y',
    credits: [
      { artist: 'vasuki-vaibhav' },
      { artist: 'jubair-muhammed', role: 'music' },
      { artist: 'pramod-acharya', role: 'words' },
    ],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'gira-gira',
    title: 'Gira Gira',
    titleKn: 'ಗಿರ ಗಿರ',
    youtubeId: 'y4QPOKGcnuI',
    credits: [
      { artist: 'vasuki-vaibhav' },
      { artist: 'mayuri-nataraja', role: 'with' },
      { artist: 'prakyath-narayan', role: 'with' },
    ],
    genres: ['indiepop'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'ninnane',
    title: 'Ninnane',
    titleKn: 'ನಿನ್ನನೇ',
    youtubeId: 'Hl-cljNHfCo',
    credits: [
      { artist: 'mitra-hegde' },
      { artist: 'manish-kodira', role: 'with' },
      { artist: 'sumedh-k', role: 'with' },
    ],
    genres: ['indiepop'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'nanariye',
    title: 'Nanariye',
    titleKn: 'ನನಗರಿಯೆ',
    youtubeId: 'OBKYBEeBdic',
    credits: [{ artist: 'mitra-hegde' }],
    genres: ['indiepop'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'marujanma',
    title: 'Marujanma',
    titleKn: 'ಮರುಜನ್ಮ',
    youtubeId: 'FUOOO9LcEzI',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'alemaari',
    title: 'Alemaari',
    titleKn: 'ಅಲೆಮಾರಿ',
    youtubeId: '-TXZG0lh8PY',
    credits: [{ artist: 'adhvik' }, { artist: 'chinmayee', role: 'featured' }],
    genres: ['indiepop', 'folk'],
    moods: ['road'],
    childSafe: true,
  },
  {
    id: 'ninna-gungalli',
    title: 'Ninna Gungalli',
    titleKn: 'ನಿನ್ನ ಗುಂಗಲ್ಲಿ',
    youtubeId: 'iLf_yqF9VjA',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'stay-with-me',
    title: 'Stay With Me',
    titleKn: 'ಸ್ಟೇ ವಿಥ್ ಮಿ',
    youtubeId: 'iU8QqpBhMaY',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['latenight', 'longing'],
    childSafe: true,
  },
  {
    id: 'moha',
    title: 'Moha',
    titleKn: 'ಮೋಹ',
    youtubeId: 'dXo1UkRaw3A',
    credits: [{ artist: 'thanusha-km' }, { artist: 'keerthan-holla' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'nammooru',
    title: 'Nammooru',
    titleKn: 'ನಮ್ಮೂರು',
    youtubeId: '5akMHLngXiY',
    credits: [{ artist: 'mysore-xpress' }],
    genres: ['rock', 'folk'],
    moods: ['joy', 'road'],
    childSafe: true,
  },
  {
    // Billed "Anup x MC Bijju", so both are leads rather than one featuring
    // the other. Anup calls it acoustic hip hop, which is exactly what it is.
    id: 'hosa-jeevana',
    title: 'Hosa Jeevana',
    titleKn: 'ಹೊಸ ಜೀವನ',
    youtubeId: 'v18FaG21k0s',
    credits: [{ artist: 'anup-kr' }, { artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['joy', 'restless'],
  },
  {
    // ಮನದನಿ, the voice of the heart. An independent single, not a film song:
    // Purple Monk Tattooz put it out on its own. The upload romanises it
    // "Manadhani"; ಮನದನಿ is the spelling that is actually right.
    id: 'manadhani',
    title: 'Manadani',
    titleKn: 'ಮನದನಿ',
    youtubeId: 'umMZwRN0Y1w',
    credits: [
      { artist: 'rajat-hegde' },
      { artist: 'raghothama-ns', role: 'music' },
      { artist: 'pratap-bhatt', role: 'words' },
    ],
    genres: ['indiepop'],
    moods: ['longing', 'rain'],
    childSafe: true,
  },
  {
    id: 'aahana',
    title: 'Aahana',
    titleKn: 'ಆಹಾನ',
    youtubeId: 'oFyJAYNohAk',
    credits: [{ artist: 'rajat-hegde' }, { artist: 'narayan-sharma', role: 'with' }],
    genres: ['indiepop'],
    moods: ['longing', 'joy'],
    childSafe: true,
  },
  {
    id: 'chinnada-hoovu',
    title: 'Chinnada Hoovu',
    titleKn: 'ಚಿನ್ನದ ಹೂವು',
    youtubeId: 'P3CvKQTVr8c',
    credits: [{ artist: 'karthik-chennoji-rao' }, { artist: 'avinash-balekkala', role: 'with' }],
    genres: ['indiepop', 'folk'],
    moods: ['joy', 'longing'],
    childSafe: true,
  },
  {
    id: 'papi-chirayu',
    title: 'Papi Chirayu',
    titleKn: 'ಪಾಪಿ ಚಿರಾಯು',
    youtubeId: 'jxUoMVRAYL4',
    credits: [{ artist: 'chirayu' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    id: 'rap-god',
    title: 'Rap God',
    titleKn: 'ರ‍್ಯಾಪ್ ಗಾಡ್',
    youtubeId: '8GYxPhOrHu4',
    credits: [{ artist: 'chirayu' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    id: 'nee',
    title: 'Nee',
    titleKn: 'ನೀ',
    youtubeId: 'fJoii5IURrk',
    credits: [{ artist: 'varijashree-venugopal' }],
    genres: ['fusion'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'ranjani',
    title: 'Ranjani',
    titleKn: 'ರಂಜನಿ',
    youtubeId: 'EPZLl9XycOc',
    credits: [{ artist: 'varijashree-venugopal' }, { artist: 'bela-fleck', role: 'featured' }],
    genres: ['fusion'],
    moods: ['joy', 'focus'],
    childSafe: true,
  },
  {
    id: 'harivaa-jhari',
    title: 'Harivaa Jhari',
    titleKn: 'ಹರಿವಾ ಝರಿ',
    youtubeId: 'g6Q2yMu8C3s',
    credits: [{ artist: 'varijashree-venugopal' }],
    genres: ['fusion'],
    moods: ['rain', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'preeti-sadhyave',
    title: 'Preeti Sadhyave?',
    titleKn: 'ಪ್ರೀತಿ ಸಾಧ್ಯವೇ?',
    youtubeId: '8Ob9D_PhC_c',
    credits: [{ artist: 'kutcheri' }],
    genres: ['rock', 'indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'endigu',
    title: 'Endigu',
    titleKn: 'ಎಂದಿಗೂ',
    youtubeId: 'KWc04PcvZpk',
    credits: [{ artist: 'kutcheri' }],
    genres: ['rock'],
    moods: ['longing', 'restless'],
    childSafe: true,
  },
  {
    id: 'bhoorame',
    title: 'Bhoorame',
    titleKn: 'ಭೂರಮೆ',
    youtubeId: 'jjzE71kE4UQ',
    credits: [
      { artist: 'priya-mali' },
      { artist: 'nagarjun-sharma', role: 'with' },
      { artist: 'harsh', role: 'with' },
    ],
    genres: ['indiepop'],
    moods: ['longing', 'joy'],
    childSafe: true,
  },
  {
    id: 'nanna-savaari',
    title: 'Nanna Savaari',
    titleKn: 'ನನ್ನ ಸವಾರಿ',
    youtubeId: 'tjd_9l5iAhQ',
    credits: [{ artist: 'vishwi' }, { artist: 'aishwarya-rangarajan', role: 'with' }],
    genres: ['indiepop', 'fusion'],
    moods: ['road', 'joy'],
    childSafe: true,
  },
  {
    id: 'kaledhode',
    title: 'Kaledhode',
    titleKn: 'ಕಳೆದೋದೆ',
    youtubeId: 'qTSjEnYYfT0',
    credits: [{ artist: 'tarana' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight', 'focus'],
    childSafe: true,
  },
  {
    id: 'rockstar',
    title: 'Rockstar',
    titleKn: 'ರಾಕ್‌ಸ್ಟಾರ್',
    youtubeId: 'kAEDS_cYwzY',
    credits: [{ artist: 'suraj-km' }],
    genres: ['rock', 'indiepop'],
    moods: ['restless', 'joy'],
  },
  {
    id: 'horaadu-nee',
    title: 'Horaadu Nee',
    titleKn: 'ಹೋರಾಡು ನೀ',
    youtubeId: 'HUiCpPfUXvI',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop', 'rock'],
    moods: ['restless'],
    childSafe: true,
  },
  {
    id: 'kaadige',
    title: 'Kaadige',
    titleKn: 'ಕಾಡಿಗೆ',
    youtubeId: 'Jz7nqW692w8',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'sanchaari',
    title: 'Sanchaari',
    titleKn: 'ಸಂಚಾರಿ',
    youtubeId: 'qr1nVeFK_3k',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['road'],
    childSafe: true,
  },
  {
    id: 'thaare',
    title: 'Thaare',
    titleKn: 'ತಾರೆ',
    youtubeId: '4kKmTaEjl4Y',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['latenight', 'longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'manujanolavu',
    title: 'Manujanolavu',
    titleKn: 'ಮನುಜನೊಲವು',
    youtubeId: '-epOyPLciIQ',
    credits: [{ artist: 'vasu-dixit' }, { artist: 'kuvempu', role: 'words' }],
    genres: ['folk'],
    moods: ['focus', 'longing'],
    childSafe: true,
  },
  {
    id: 'habbakke',
    title: 'Habbakke',
    titleKn: 'ಹಬ್ಬಕ್ಕೆ',
    youtubeId: '6i0wD94jcNA',
    credits: [{ artist: 'vasu-dixit' }, { artist: 'basavanna', role: 'words' }],
    genres: ['devotional', 'folk'],
    moods: ['focus', 'joy'],
    childSafe: true,
  },
  {
    id: 'mullu',
    title: 'Mullu (Reignited)',
    titleKn: 'ಮುಳ್ಳು',
    youtubeId: 'Al7ZLlBMTk8',
    credits: [{ artist: 'vasu-dixit' }, { artist: 'purandara-dasa', role: 'words' }],
    genres: ['devotional', 'folk'],
    moods: ['focus', 'latenight'],
    childSafe: true,
  },
  {
    id: 'innu-yaaka-baralilla',
    title: 'Innu Yaaka Baralilla',
    titleKn: 'ಇನ್ನೂ ಯಾಕ ಬರಲಿಲ್ಲ',
    youtubeId: 'hd74eaMrl9s',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['folk'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'neene-illade',
    title: 'Neene Illade',
    titleKn: 'ನೀನೇ ಇಲ್ಲದೆ',
    youtubeId: 'zKIAuYB6_Uk',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'nan-raja',
    title: 'Nan Raja',
    titleKn: 'ನನ್ ರಾಜಾ',
    youtubeId: 'VZ5j4L2pxHM',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['folk'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'lovvu-lovvu',
    title: 'Lovvu Lovvu',
    titleKn: 'ಲವ್ವು ಲವ್ವು',
    youtubeId: 'DHMRLdJeKdU',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['folk', 'indiepop'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'naa-muttidella-chinna',
    title: 'Naa Muttidella Chinna',
    titleKn: 'ನಾ ಮುಟ್ಟಿದೆಲ್ಲ ಚಿನ್ನ',
    youtubeId: 'EreAENv_y6c',
    credits: [{ artist: 'sangeetha-rajeev' }, { artist: 'manju-pavagada', role: 'with' }],
    genres: ['indiepop', 'folk'],
    moods: ['joy', 'restless'],
    childSafe: true,
  },
  {
    id: 'appa',
    title: 'Appa',
    titleKn: 'ಅಪ್ಪ',
    youtubeId: 'Jlf-6fWW_cM',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'noda-noda',
    title: 'Noda Noda',
    titleKn: 'ನೋಡ ನೋಡ',
    youtubeId: 'kjAkqk7dBlE',
    credits: [{ artist: 'sangeetha-rajeev' }],
    genres: ['indiepop', 'folk'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'ninna-bitre',
    title: 'Ninna Bitre',
    titleKn: 'ನಿನ್ನ ಬಿಟ್ರೆ',
    youtubeId: 'Ek2Su3mOfpE',
    credits: [{ artist: 'all-ok' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'awat-iwat',
    title: 'Awat Iwat',
    titleKn: 'ಅವತ್ ಇವತ್',
    youtubeId: 'SzDfbw9C9jo',
    credits: [{ artist: 'all-ok' }],
    genres: ['hiphop'],
    moods: ['restless', 'joy'],
  },
  {
    id: 'shiva',
    title: 'Shiva',
    titleKn: 'ಶಿವ',
    youtubeId: 'ynGZU6hTCfo',
    credits: [{ artist: 'all-ok' }],
    genres: ['devotional', 'indiepop'],
    moods: ['focus'],
    childSafe: true,
  },
  {
    id: 'aagodella-olledakke',
    title: 'Aagodella Olledakke',
    titleKn: 'ಆಗೋದೆಲ್ಲ ಒಳ್ಳೇದಕ್ಕೆ',
    youtubeId: 'YS1g7GjtEKo',
    credits: [{ artist: 'all-ok' }],
    genres: ['indiepop'],
    moods: ['joy', 'road'],
    childSafe: true,
  },
  {
    id: 'jama-jama',
    title: 'Jama Jama',
    titleKn: 'ಜಮಾ ಜಮಾ',
    youtubeId: 'C-ms21R-cVA',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['restless', 'joy'],
  },
  {
    id: 'hands-up',
    title: 'Hands Up',
    titleKn: 'ಹ್ಯಾಂಡ್ಸ್ ಅಪ್',
    youtubeId: 'Odwkb_bFMnI',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    id: 'makkugiri',
    title: 'Makkugiri',
    titleKn: 'ಮಕ್ಕುಗಿರಿ',
    youtubeId: 'NvZRtC0H8dw',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    // From the Bedroom Baraha EP.
    id: 'shubhodayadalli',
    title: 'Shubhodayadalli',
    titleKn: 'ಶುಭೋದಯದಲ್ಲಿ',
    youtubeId: 'iJbqxBnm740',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['focus', 'latenight'],
  },
  {
    // From the Bedroom Baraha EP.
    id: 'sorry-song',
    title: 'Sorry Song',
    titleKn: 'ಸಾರಿ ಸಾಂಗ್',
    youtubeId: 'CW8STapcH8M',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['longing'],
  },
  {
    id: 'hengo-baduktini',
    title: 'Hengo Baduktini',
    titleKn: 'ಹೆಂಗೋ ಬದುಕ್ತೀನಿ',
    youtubeId: 'y-tSkAAdbd4',
    credits: [{ artist: 'mc-bijju' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    id: 'thithi',
    title: 'Thithi',
    titleKn: 'ತಿಥಿ',
    youtubeId: '_JVGa1oNkzc',
    credits: [{ artist: 'rahul-dit-o' }],
    genres: ['hiphop'],
    moods: ['restless', 'latenight'],
  },
  {
    id: 'sakkathagiddini',
    title: 'Sakkathagiddini',
    titleKn: 'ಸಕ್ಕತಾಗಿದ್ದೀನಿ',
    youtubeId: 'Mi5XySOVjjk',
    credits: [{ artist: 'rahul-dit-o' }],
    genres: ['hiphop'],
    moods: ['joy', 'restless'],
  },
  {
    id: 'plz-worry',
    title: 'Plz Worry',
    titleKn: 'ಪ್ಲೀಸ್ ವರಿ',
    youtubeId: 'VM00gsWcupI',
    credits: [{ artist: 'rahul-dit-o' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    id: 'jai-bhim',
    title: 'Jai Bhim',
    titleKn: 'ಜೈ ಭೀಮ್',
    youtubeId: 'xSxdeAUkXOQ',
    credits: [{ artist: 'rahul-dit-o' }, { artist: 'rd-tillu', role: 'with' }],
    genres: ['hiphop'],
    moods: ['restless'],
  },
  {
    // A Kannada janapada song, with no author to credit but the tradition it came from.
    id: 'sojugada-sooju-mallige',
    title: 'Sojugada Sooju Mallige',
    titleKn: 'ಸೊಜುಗದ ಸೂಜು ಮಲ್ಲಿಗೆ',
    youtubeId: 'dpST7dCzKj0',
    credits: [{ artist: 'lagori' }, { artist: 'maadeva', role: 'featured' }],
    genres: ['folk'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'tulasidala',
    title: 'Tulasidala',
    titleKn: 'ತುಳಸಿದಳ',
    youtubeId: 'LQmG0tdaIO8',
    credits: [{ artist: 'sumedh-k' }],
    genres: ['indiepop'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'taavare',
    title: 'Taavare',
    titleKn: 'ತಾವರೆ',
    youtubeId: 'NSL-AJ9F9EY',
    credits: [{ artist: 'sumedh-k' }, { artist: 'sumant-shridhar', role: 'featured' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'yaaru',
    title: 'Yaaru',
    titleKn: 'ಯಾರು',
    youtubeId: 'f4EbF24pyQw',
    credits: [{ artist: 'sumedh-k' }, { artist: 'chiranthana-am', role: 'with' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'beedi',
    title: 'Beedi',
    titleKn: 'ಬೀದಿ',
    youtubeId: 'e4-r2GCP1hE',
    credits: [{ artist: 'sumedh-k' }, { artist: 'chiranthana-am', role: 'with' }],
    genres: ['indiepop'],
    moods: ['road', 'restless'],
    childSafe: true,
  },
  {
    id: 'svayamvara',
    title: 'Svayamvara',
    titleKn: 'ಸ್ವಯಂವರ',
    youtubeId: 'SSkpoersDpA',
    credits: [{ artist: 'sumedh-k' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'ecchara',
    title: 'Ecchara',
    titleKn: 'ಎಚ್ಚರ',
    youtubeId: 'Q4__EqJK8i0',
    credits: [{ artist: 'sumedh-k' }],
    genres: ['indiepop'],
    moods: ['focus', 'restless'],
    childSafe: true,
  },
  {
    id: 'hinnudi',
    title: 'Hinnudi',
    titleKn: 'ಹಿನ್ನುಡಿ',
    youtubeId: 'omHTVltDnm4',
    credits: [{ artist: 'narayan-sharma' }],
    genres: ['indiepop', 'folk'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'kaledu-hoda',
    title: 'Kaledu Hoda',
    titleKn: 'ಕಳೆದು ಹೋದ',
    youtubeId: 'yhO_iSaE-I4',
    credits: [
      { artist: 'narayan-sharma' },
      { artist: 'aadarsh-subramaniam', role: 'with' },
      { artist: 'shivakumar-mavali', role: 'with' },
    ],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'kone-aase',
    title: 'Kone Aase',
    titleKn: 'ಕೊನೆ ಆಸೆ',
    youtubeId: 'fM7UoiJ8V0c',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'nenapale',
    title: 'Nenapale',
    titleKn: 'ನೆನಪಲೇ',
    youtubeId: 'A20fTOz1rFM',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'hagura',
    title: 'Hagura',
    titleKn: 'ಹಗುರ',
    youtubeId: 'mCDh5kxrvqE',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['focus'],
    childSafe: true,
  },
  {
    id: 'bhavishya',
    title: 'Bhavishya',
    titleKn: 'ಭವಿಷ್ಯ',
    youtubeId: '9o9IRlweS3o',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['restless', 'focus'],
    childSafe: true,
  },
  {
    id: 'aparichita',
    title: 'Aparichita',
    titleKn: 'ಅಪರಿಚಿತ',
    youtubeId: '920tSoJfzWE',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    id: 'goobe-kannu',
    title: 'Goobe Kannu',
    titleKn: 'ಗೂಬೆ ಕಣ್ಣು',
    youtubeId: 'W5f5ubydX1k',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['latenight'],
    childSafe: true,
  },
  {
    id: 'amma-adhvik',
    title: 'Amma',
    titleKn: 'ಅಮ್ಮ',
    youtubeId: 'Ibk2vLa0Dlo',
    credits: [{ artist: 'adhvik' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'nagu',
    title: 'Nagu',
    titleKn: 'ನಗು',
    youtubeId: 'XaQELQyXgrc',
    credits: [{ artist: 'karthik-chennoji-rao' }],
    genres: ['indiepop'],
    moods: ['joy'],
    childSafe: true,
  },
  {
    id: 'maleye',
    title: 'Maleye',
    titleKn: 'ಮಳೆಯೇ',
    youtubeId: 'bCfnx6Zogp4',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['rain', 'longing'],
    childSafe: true,
  },
  {
    id: 'preethi-kathe',
    title: 'Preethi Kathe',
    titleKn: 'ಪ್ರೀತಿ ಕಥೆ',
    youtubeId: 'htYPYXE__1A',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'saagara-suraj-km',
    title: 'Saagara',
    titleKn: 'ಸಾಗರ',
    youtubeId: 'f1wr9jejCGE',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['longing', 'focus'],
    childSafe: true,
  },
  {
    id: 'naa-nannali',
    title: 'Naa Nannali',
    titleKn: 'ನಾ ನನ್ನಲಿ',
    youtubeId: 'UDUA0sBbI0A',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['focus', 'longing'],
    childSafe: true,
  },
  {
    id: 'eke-heege',
    title: 'Eke Heege',
    titleKn: 'ಏಕೆ ಹೀಗೆ',
    youtubeId: 'GxhZ75QWJ20',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'nee-suraj-km',
    title: 'Nee',
    titleKn: 'ನೀ',
    youtubeId: '4TbLwMQpYro',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['longing'],
    childSafe: true,
  },
  {
    id: 'sakhiye',
    title: 'Sakhiye',
    titleKn: 'ಸಖಿಯೇ',
    youtubeId: 'jeKVQgCen8E',
    credits: [{ artist: 'suraj-km' }],
    genres: ['indiepop'],
    moods: ['longing', 'latenight'],
    childSafe: true,
  },
  {
    // From Vari (The Live Sessions).
    id: 'kannada',
    title: 'Kannada',
    titleKn: 'ಕನ್ನಡ',
    youtubeId: 'ILwvVf9UGdc',
    credits: [{ artist: 'varijashree-venugopal' }, { artist: 'praveen-d-rao', role: 'featured' }],
    genres: ['fusion', 'folk'],
    moods: ['joy', 'focus'],
    childSafe: true,
  },
  {
    id: 'rama-nama',
    title: 'Rama Nama',
    titleKn: 'ರಾಮ ನಾಮ',
    youtubeId: 'ZAnn3mN9FfQ',
    credits: [{ artist: 'mitra-hegde' }, { artist: 'sumedh-k', role: 'with' }],
    genres: ['devotional', 'indiepop'],
    moods: ['focus', 'latenight'],
    childSafe: true,
  },]

/** A song's title in both scripts, for the bilingual display components. */
export function songTitle(song: Song): Bilingual {
  return { en: song.title, kn: song.titleKn ?? song.title }
}

const artistById = new Map(artists.map((artist) => [artist.id, artist]))

export function findArtist(id: string | undefined): Artist | undefined {
  return id ? artistById.get(id) : undefined
}

/** A credit with its artist resolved, so callers never hold a bare id. */
export interface ResolvedCredit {
  artist: Artist
  role: CreditRole
}

/**
 * Everyone credited on a song, in billing order.
 *
 * Throws on an unknown id rather than dropping the credit silently. A missing
 * name on a page about crediting people is exactly the failure worth making
 * loud, and it can only happen from a typo in this file.
 */
export function songCredits(song: Song): ResolvedCredit[] {
  return song.credits.map(({ artist, role }) => {
    const found = artistById.get(artist)
    if (!found) throw new Error(`Song "${song.id}" credits an unknown artist: "${artist}"`)
    return { artist: found, role: role ?? 'lead' }
  })
}

/**
 * The names a row shows when it has room for one line: the leads, joined.
 *
 * Featured and writing credits are deliberately left out here and shown in
 * full where there is space for them. A deck bar reading four names truncates
 * to one and a half, which credits nobody.
 */
export function billing(song: Song): Bilingual {
  const leads = songCredits(song).filter((credit) => credit.role === 'lead')
  const named = leads.length ? leads : songCredits(song).slice(0, 1)
  return {
    kn: named.map((credit) => credit.artist.name.kn).join(', '),
    en: named.map((credit) => credit.artist.name.en).join(', '),
  }
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
 * YouTube is exact: we hold a verified video id for every song. Spotify and
 * Apple are searches scoped to the song and its billed lead, because we do not
 * hold per-song ids for them and a guessed one lands on a 404 or, worse, on
 * somebody else's record. Fill `spotifyUrl` / `appleMusicUrl` on a song and
 * that exact link replaces the search.
 */
export function songLinks(song: Song): { platform: Platform; url: string; exact: boolean }[] {
  const query = encodeURIComponent(`${song.title} ${billing(song).en}`)

  return [
    {
      platform: 'youtube' as const,
      url: `https://www.youtube.com/watch?v=${song.youtubeId}`,
      exact: true,
    },
    {
      platform: 'spotify' as const,
      url: song.spotifyUrl ?? `https://open.spotify.com/search/${query}`,
      exact: Boolean(song.spotifyUrl),
    },
    {
      platform: 'appleMusic' as const,
      url: song.appleMusicUrl ?? `https://music.apple.com/in/search?term=${query}`,
      exact: Boolean(song.appleMusicUrl),
    },
    {
      platform: 'ytMusic' as const,
      url: song.ytMusicUrl ?? `https://music.youtube.com/search?q=${query}`,
      exact: Boolean(song.ytMusicUrl),
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

const itemByKey = new Map<string, QueueItem>()

/** One song as the player holds it: everything a row or the deck needs. */
export interface QueueItem {
  song: Song
  /** Everyone credited, resolved, in billing order. */
  credits: ResolvedCredit[]
  /** The billed lead. Where a row links to one artist, it links here. */
  artist: Artist
  /** Every lead name in one string, both scripts. What most rows show. */
  billing: Bilingual
  /** `song.id`. Stable identity for one queued song. */
  key: string
}

export const queue: QueueItem[] = songs.map((song) => {
  const credits = songCredits(song)
  return {
    song,
    credits,
    artist: credits[0].artist,
    billing: billing(song),
    key: song.id,
  }
})

for (const item of queue) itemByKey.set(item.key, item)

/** The queue entry for a song, so a page holding a `Song` can play it. */
export function itemFor(song: Song): QueueItem {
  const item = itemByKey.get(song.id)
  if (!item) throw new Error(`No queue entry for song "${song.id}"`)
  return item
}

/**
 * Every song an artist is credited on, in tape order.
 *
 * This is the whole point of the shape: an artist page is a query over the
 * songs rather than a list owned by the artist, so a singer who appears once on
 * somebody else's record still gets that song on their page.
 */
export function songsBy(artistId: string): QueueItem[] {
  return queue.filter((item) => item.song.credits.some((credit) => credit.artist === artistId))
}

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

/**
 * Artists billed as the lead on at least one song. The roster proper, and what
 * /artists gives a card to.
 */
export const leadingArtists: Artist[] = artistsAlphabetical.filter((artist) =>
  songs.some((song) =>
    song.credits.some((credit) => credit.artist === artist.id && (credit.role ?? 'lead') === 'lead'),
  ),
)

/**
 * Everyone else who is credited: featured singers, players, the poets whose
 * words a song is built on. They get a page and a name, but not a card: a card
 * with one song and no write-up is a worse way to credit someone than a line in
 * a list that says plainly what this is.
 */
export const supportingArtists: Artist[] = artistsAlphabetical.filter(
  (artist) => !leadingArtists.includes(artist),
)

/** How many songs are cleared for family listening, shown next to the toggle. */
export const childSafeCount = songs.filter((song) => song.childSafe).length
