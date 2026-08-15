/**
 * Everything that helped build this page, gathered in one place so the
 * /credits route can render it without any of it being hardcoded in JSX.
 *
 * If something helped and isn't listed here, that's a bug, add it.
 */

import type { Bilingual } from './artists'

export interface CreditLink {
  label: string
  url: string
  note?: Bilingual
}

export interface CreditGroup {
  id: string
  heading: Bilingual
  /** Set above the links, why this group is being credited. */
  intro?: Bilingual
  links: CreditLink[]
}

/**
 * The Spotify playlists the roster was built from. These are the reason the
 * list looks the way it does, the people who maintain them did the curation
 * work long before this page existed.
 */
export const playlistCredits: CreditGroup = {
  id: 'playlists',
  heading: { kn: 'ಪಟ್ಟಿಗಳು', en: 'Playlists this was built from' },
  intro: {
    kn: 'ಈ ಪುಟದ ಕಲಾವಿದರ ಪಟ್ಟಿ ಶೂನ್ಯದಿಂದ ಹುಟ್ಟಿದ್ದಲ್ಲ. ಈ ಸ್ಪಾಟಿಫೈ ಪಟ್ಟಿಗಳನ್ನು ಕಟ್ಟಿ ನಿರ್ವಹಿಸುವವರು ಈ ಕೆಲಸವನ್ನು ಮೊದಲೇ ಮಾಡಿದ್ದಾರೆ.',
    en: 'This roster did not come out of nowhere. The people who build and maintain these Spotify playlists did the finding long before this page existed.',
  },
  links: [
    {
      // 37i9dQZF1DX… is Spotify's own editorial id prefix, worth saying, since
      // two of these four are called the same thing.
      label: 'Kannada Indie',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX55uyETlpZlJ',
      note: { kn: 'ಸ್ಪಾಟಿಫೈ ಸಂಪಾದಕೀಯ ಪಟ್ಟಿ.', en: 'Spotify’s own editorial playlist.' },
    },
    { label: 'Indie Kannada', url: 'https://open.spotify.com/playlist/7uwYmj7QPFNQn6cUHABijw' },
    {
      label: 'Kannada indie exists too',
      url: 'https://open.spotify.com/playlist/7bOVv8YR58iYMg5SOh0QdD',
    },
    {
      label: 'Kannada Indie',
      url: 'https://open.spotify.com/playlist/2vVqX0dPYWOLj0SH5JH5UL',
      note: { kn: 'ಕೇಳುಗರೊಬ್ಬರು ಕಟ್ಟಿದ ಪಟ್ಟಿ.', en: 'A listener-built one under the same name.' },
    },
  ],
}

export const inspirationCredits: CreditGroup = {
  id: 'inspiration',
  heading: { kn: 'ಸ್ಫೂರ್ತಿ', en: 'Made in the shade of' },
  intro: {
    kn: 'ಕನ್ನಡ ಸಂಗೀತಕ್ಕಾಗಿ ಅಂತರ್ಜಾಲದಲ್ಲಿ ಇವರು ಮೊದಲು ಏನನ್ನೋ ಕಟ್ಟಿದರು, ಅದೂ ಬಹಳ ಚೆನ್ನಾಗಿ. ಅವು ಇದ್ದುದರಿಂದಲೇ ಇದು ಇದೆ.',
    en: 'Two people built something for Kannada music on the internet before this, and did it better than most. This one exists because those did.',
  },
  links: [
    {
      label: 'Naada',
      url: 'https://naada-blr.vercel.app/',
      note: { kn: 'ಬೆಂಗಳೂರಿನ ಸಂಗೀತ, ಒಂದೇ ಪುಟದಲ್ಲಿ.', en: 'Bengaluru’s music, gathered onto one page.' },
    },
    {
      label: '2000s Kannada',
      url: 'https://kannada2000s.vercel.app/',
      note: {
        kn: 'ಒಂದು ದಶಕದ ಕನ್ನಡ ಹಾಡುಗಳ ನೆನಪಿನ ಪೆಟ್ಟಿಗೆ.',
        en: 'A memory box of one decade of Kannada songs.',
      },
    },
  ],
}

export const toolCredits: CreditGroup = {
  id: 'tools',
  heading: { kn: 'ಕಟ್ಟಲು ಬಳಸಿದ್ದು', en: 'Built with' },
  intro: {
    kn: 'ಈ ಪುಟವನ್ನು ಕಟ್ಟಲು ಬಳಸಿದ ಪರಿಕರಗಳು. ಎಲ್ಲವೂ ಉಚಿತ ಅಥವಾ ಮುಕ್ತ ಮೂಲ.',
    en: 'The tools that made this page. All of them free or open source.',
  },
  links: [
    {
      label: 'Claude Code',
      url: 'https://claude.com/claude-code',
      note: {
        kn: 'ಈ ಪುಟದ ಬಹುಪಾಲು ಕೋಡ್ ಇದರ ಜೊತೆ ಜೋಡಿಯಾಗಿ ಬರೆದದ್ದು.',
        en: 'Most of the code on this page was written in pair with it.',
      },
    },
    { label: 'React', url: 'https://react.dev' },
    { label: 'Vite', url: 'https://vite.dev' },
    { label: 'Tailwind CSS', url: 'https://tailwindcss.com' },
    {
      label: 'YouTube IFrame Player API',
      url: 'https://developers.google.com/youtube/iframe_api_reference',
      note: {
        kn: 'ಹಾಡುಗಳು ಈ ಪುಟದೊಳಗೇ ನುಡಿಯುವುದು ಇದರಿಂದ.',
        en: 'What lets the songs play inside the page instead of sending you away.',
      },
    },
    {
      label: 'Google Fonts',
      url: 'https://fonts.google.com',
      note: {
        kn: 'ಬಾಲೂ ತಮ್ಮ ೨, ನೋಟೋ ಸಾನ್ಸ್ ಕನ್ನಡ, ಸ್ಪೇಸ್ ಗ್ರೊಟೆಸ್ಕ್, ಕೊರಿಯರ್ ಪ್ರೈಮ್.',
        en: 'Baloo Tamma 2, Noto Sans Kannada, Space Grotesk, Courier Prime.',
      },
    },
  ],
}
