/**
 * Long-form copy for /about. Kept out of copy.ts because that file is for
 * chrome, labels, buttons, one-liners, and this is prose.
 *
 * As everywhere else, the Kannada is written rather than translated. Read each
 * column on its own; they say the same thing, not the same words.
 */

import type { Bilingual } from './artists'

export interface AboutSection {
  id: string
  heading: Bilingual
  /** Rendered as separate <p> elements, in order. */
  body: Bilingual[]
}

export const aboutSections: AboutSection[] = [
  {
    id: 'what',
    heading: { kn: 'ಇದೇನು', en: 'What this is' },
    body: [
      {
        kn: 'ಸ್ವಚ್ಛಂದ ಒಂದು ಸಣ್ಣ ಪುಟ. ಕನ್ನಡದಲ್ಲಿ ಸಿನಿಮಾದ ಹೊರಗೆ ಹಾಡು ಮಾಡ್ತಿರೋ ಜನರನ್ನ ಒಂದೇ ಕಡೆ ತಂದು, ಅವರ ಹಾಡುಗಳನ್ನ ಇಲ್ಲೇ ಕೂತು ಕೇಳೋ ಹಾಗೆ ಮಾಡೋದಷ್ಟೇ ಇದರ ಕೆಲಸ.',
        en: 'Swachchanda is a small page. It gathers people making Kannada music outside the film industry into one place, and lets you sit and listen to them without leaving.',
      },
      {
        kn: 'ಹೆಸರಿನ ಅರ್ಥ, ಯಾರ ಹಂಗೂ ಇಲ್ಲದೆ, ತನ್ನಿಷ್ಟದಂತೆ. ಇಲ್ಲಿನ ಹಾಡುಗಳ ಬಗ್ಗೆಯೂ ಅಷ್ಟೇ ಹೇಳಬಹುದು.',
        en: 'The word means free, unbound, moving of its own will. The same could be said of most of the songs on it.',
      },
    ],
  },
  {
    id: 'why',
    heading: { kn: 'ಯಾಕೆ', en: 'Why it exists' },
    body: [
      {
        kn: 'ಕನ್ನಡದ ಸ್ವತಂತ್ರ ಸಂಗೀತ ಈಗ ಚೆನ್ನಾಗಿ ನಡೀತಿದೆ. ಆದರೆ ಅದು ಚದುರಿ ಹೋಗಿದೆ, ಒಂದು ಹಾಡು ಇನ್‌ಸ್ಟಾ ರೀಲಿನಲ್ಲಿ, ಇನ್ನೊಂದು ಯಾರೋ ಮಾಡಿದ ಪಟ್ಟಿಯಲ್ಲಿ, ಮತ್ತೊಂದು ಯೂಟ್ಯೂಬು ತಾನಾಗೇ ತೋರಿಸಿದ್ದು. ಎಲ್ಲಾ ಒಟ್ಟಿಗೆ ಕೂತು ಕೇಳೋಕೆ ಒಂದು ಜಾಗ ಸಿಗ್ತಿರಲಿಲ್ಲ.',
        en: 'Kannada independent music is having a good decade. But it is scattered, one song in a reel, another in somebody’s playlist, a third because YouTube decided to show it to you. There was no one room you could sit in and just listen.',
      },
      {
        kn: 'ಇದು ಆ ಕೋಣೆ. ಅಷ್ಟೇ. ಇದು ಆ್ಯಪ್ ಅಲ್ಲ, ಸ್ಟಾರ್ಟಪ್ ಅಲ್ಲ, ಯಾರಿಗೂ ಪೈಪೋಟಿ ಅಲ್ಲ.',
        en: 'This is that room. Nothing more, not an app, not a startup, not competing with anyone.',
      },
    ],
  },
  {
    id: 'independence',
    heading: { kn: 'ಆಗಸ್ಟ್ ೧೫', en: 'The date' },
    body: [
      {
        kn: 'ಇದನ್ನ ೧೫ ಆಗಸ್ಟ್ ೨೦೨೬ರಂದು ಕಟ್ಟಿದ್ದು. ಭಾರತದ ೮೦ನೇ ಸ್ವಾತಂತ್ರ್ಯ ದಿನ.',
        en: 'This was put together on 15 August 2026, India’s 80th Independence Day.',
      },
      {
        kn: 'ಸ್ವಚ್ಛಂದ ಅಂದರೆ ಯಾರ ಹಂಗೂ ಇಲ್ಲದೆ, ತನ್ನಿಷ್ಟದಂತೆ ಇರೋದು. ಇಲ್ಲಿನ ಪ್ರತಿಯೊಬ್ಬರೂ ಸಿನಿಮಾದ ಹೊರಗೆ, ಯಾವ ದೊಡ್ಡ ಸ್ಟುಡಿಯೋದ ಬೆಂಬಲವೂ ಇಲ್ಲದೆ, ತಮ್ಮದೇ ದುಡ್ಡು ಮತ್ತು ತಮ್ಮದೇ ಷರತ್ತಿನ ಮೇಲೆ ಸಂಗೀತ ಮಾಡುವವರು.',
        en: 'Swachchanda means free, unbound, moving of its own will. Everyone on this page makes music outside the film industry that would otherwise have carried it, with no studio behind them, on their own money and their own terms.',
      },
      {
        kn: 'ಒಂದು ದೇಶದ ಸ್ವಾತಂತ್ರ್ಯ ಮತ್ತು ಒಬ್ಬ ಕಲಾವಿದರ ಸ್ವಾತಂತ್ರ್ಯ ಒಂದೇ ಅಳತೆಯದ್ದಲ್ಲ. ಆದರೆ ಎರಡರಲ್ಲೂ ಒಂದೇ ಪ್ರಶ್ನೆ ಇದೆ: ಯಾರ ಅನುಮತಿಯೂ ಇಲ್ಲದೆ ತಮ್ಮದೇ ದನಿಯಲ್ಲಿ ಮಾತಾಡೋದು. ಹಾಗಾಗಿ ದಿನಾಂಕ ಆಕಸ್ಮಿಕವಲ್ಲ.',
        en: 'A country’s independence and an artist’s are not the same size of thing. But the question underneath both is the same one: speaking in your own voice without asking anybody’s permission. So the date was not a coincidence.',
      },
    ],
  },

  {
    id: 'how',
    heading: { kn: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತೆ', en: 'How it plays' },
    body: [
      {
        kn: 'ಒಂದು ಹಾಡು ಒತ್ತಿದಾಗ ಅದು ಯೂಟ್ಯೂಬಿನಿಂದ ಬರುತ್ತೆ, ಕಲಾವಿದರೇ ಅಥವಾ ಅವರ ಲೇಬಲ್ಲೇ ಹಾಕಿರೋ ಅಧಿಕೃತ ವಿಡಿಯೋದಿಂದ. ವಿಡಿಯೋ ಕಾಣಿಸಲ್ಲ, ಸದ್ದು ಮಾತ್ರ. ಕೆಳಗಿನ ಟೇಪು ನೀವು ಯಾವ ಪುಟಕ್ಕೆ ಹೋದರೂ ಜೊತೆಗೇ ಬರುತ್ತೆ.',
        en: 'When you press a song it comes from YouTube, from the official upload by the artist or their label. The video stays hidden; you get the sound. The tape at the bottom follows you from page to page.',
      },
      {
        kn: 'ಈ ಪುಟದಲ್ಲಿ ಒಂದೂ ಹಾಡು ಇಟ್ಟುಕೊಂಡಿಲ್ಲ. ಒಂದೂ ಫೈಲು ಇಲ್ಲಿಂದ ಹೋಗಲ್ಲ. ಡೌನ್‌ಲೋಡು ಇಲ್ಲ.',
        en: 'No audio is stored here. No file leaves this page. There is nothing to download.',
      },
    ],
  },
  {
    id: 'picking',
    heading: { kn: 'ಹಾಡು ಹೇಗೆ ಸೇರುತ್ತೆ', en: 'How a song gets in' },
    body: [
      {
        kn: 'ಯಾವ ಅಲ್ಗಾರಿದಮ್ಮೂ ಇಲ್ಲ. ಕೆಲವು ಸ್ಪಾಟಿಫೈ ಪಟ್ಟಿಗಳಿಂದ ಶುರುವಾಯ್ತು, ಆಮೇಲೆ ಒಂದೊಂದೇ ಹಾಡು ಕೇಳಿ ಸೇರಿಸಿದ್ದು. ಪ್ರತಿ ವಿಡಿಯೋ ಐಡಿಯನ್ನೂ ಪರೀಕ್ಷಿಸಿ, ಅದು ನಿಜವಾಗಿ ಇದೆ ಮತ್ತು ಅಧಿಕೃತ ಚಾನೆಲ್ಲಿಂದ ಬಂದಿದೆ ಅಂತ ಖಚಿತ ಮಾಡಿಕೊಂಡಮೇಲೇ ಹಾಕಿದ್ದು.',
        en: 'No algorithm. It started from a few Spotify playlists, then grew one song at a time. Every video id was checked to confirm it actually resolves and comes from an official channel before it went in.',
      },
      {
        kn: 'ಶೈಲಿ ಮತ್ತು ಮೂಡಿನ ಗುರುತುಗಳು ನನ್ನ ಅಭಿಪ್ರಾಯ ಅಷ್ಟೇ, ಯಾವ ಲೇಬಲ್ಲೂ ಕೊಟ್ಟಿದ್ದಲ್ಲ. ಒಪ್ಪದಿದ್ದರೆ ಹೇಳಿ.',
        en: 'The sound and mood tags are my opinion, not metadata from a label. Disagree and tell me.',
      },
    ],
  },
  {
    id: 'family',
    heading: { kn: 'ಮನೆಯವರ ಜೊತೆ ಕೇಳೋದು', en: 'Listening with anyone around' },
    body: [
      {
        kn: 'ಇಲ್ಲಿ ರ‍್ಯಾಪೂ ಇದೆ, ದಾಸಪದವೂ ಇದೆ. ಎಲ್ಲಾ ಹಾಡೂ ಎಲ್ಲಾ ಕಡೆ ಹಾಕೋಕೆ ಆಗಲ್ಲ ಅನ್ನೋದು ನಿಜ. ಅದಕ್ಕೆ ಒಂದು ಸಣ್ಣ ಸ್ವಿಚ್ ಇದೆ.',
        en: 'There is rap here and there is 15th-century devotional poetry. Not every song suits every room, so there is a small switch for it.',
      },
      {
        kn: 'ಆದರೆ ಪ್ರಾಮಾಣಿಕವಾಗಿ ಹೇಳಬೇಕು: ಆ ಪಟ್ಟಿ ನಾನು ಗುರುತು ಹಾಕಿದ ಹಾಡುಗಳನ್ನಷ್ಟೇ ತೋರಿಸುತ್ತೆ. ಯಾವ ಹಾಡನ್ನೂ “ಕೆಟ್ಟದ್ದು” ಅಂತ ಗುರುತು ಹಾಕಿಲ್ಲ, ಒಬ್ಬ ಕಲಾವಿದನ ಬಗ್ಗೆ ಹಾಗೆ ಹೇಳೋ ಹಕ್ಕು ನನಗಿಲ್ಲ. ಪಟ್ಟಿಯಲ್ಲಿ ಇಲ್ಲದ ಹಾಡು ಅಂದರೆ ನಾನು ಇನ್ನೂ ಕೂತು ಕೇಳಿಲ್ಲ ಅಷ್ಟೇ.',
        en: 'To be straight about it: that switch shows only songs I have marked as safe. Nothing is marked *unsafe*, I have no standing to say that about someone’s work. A song missing from the list only means I haven’t sat down with it yet.',
      },
    ],
  },
  {
    id: 'ekantha',
    heading: { kn: 'ಏಕಾಂತ', en: 'Ekantha' },
    body: [
      {
        kn: 'ಏಕಾಂತ ಅಂದರೆ ಒಬ್ಬರೇ ಇರೋದು. ಈ ಸೈಟಿನೊಳಗೇ ಇರೋ ಇನ್ನಷ್ಟು ಸದ್ದಿಲ್ಲದ ಕೋಣೆ ಅದು: ಟೇಪು, ಅದರ ಮೇಲಿನ ಬರಹ, ಮತ್ತು ಗುಂಡಿಗಳು. ಪಟ್ಟಿ ಇಲ್ಲ, ಮೆನು ಇಲ್ಲ, ಎಣಿಕೆ ಇಲ್ಲ.',
        en: 'Ekantha means solitude. It is a quieter room inside this one: the tape, the words on it, and the controls. No lists, no menus, no counting.',
      },
      {
        kn: 'ಮೇಲಿನ ಮೆನುವಿನಿಂದ, ಮುಖಪುಟದಿಂದ, ಅಥವಾ ಕೆಳಗಿನ ಟೇಪಿನ ಗುಂಡಿಯಿಂದ ಒಳಹೋಗಬಹುದು. ಹೊರಬರೋಕೆ ಮೇಲಿನ ಬಟನ್, ಎಸ್ಕೇಪ್ ಕೀ, ಅಥವಾ ಬ್ರೌಸರಿನ ಬ್ಯಾಕ್. ಒಳಗೆ ಹೋದಾಗಲೂ ಹೊರಬಂದಾಗಲೂ ಹಾಡು ನಿಲ್ಲಲ್ಲ.',
        en: 'Enter it from the menu, from the front page, or from the button on the tape at the foot of the screen. Leave with the button at the top, the Escape key, or browser back. The song does not stop either way.',
      },
    ],
  },
  {
    id: 'who',
    heading: { kn: 'ಯಾರು ಕಟ್ಟಿದ್ದು', en: 'Who built it' },
    body: [
      {
        kn: 'ಒಬ್ಬ ಕೇಳುಗ, ಒಂದು ವಾರಾಂತ್ಯ, ಮತ್ತು ತುಂಬಾ ಟ್ಯಾಬುಗಳು. ಸಂಗೀತದಲ್ಲಿ ನನ್ನ ಕೆಲಸ ಏನೂ ಇಲ್ಲ, ಸುತ್ತಲಿನ ಈ ಪುಟ ಮಾತ್ರ ನನ್ನದು.',
        en: 'One listener, one weekend, and far too many browser tabs. None of the music is my work, only the page around it.',
      },
      {
        kn: 'ಸಹಾಯ ಮಾಡಿದ ಎಲ್ಲರ ಹೆಸರೂ ಕೃತಜ್ಞತೆ ಪುಟದಲ್ಲಿದೆ.',
        en: 'Everyone and everything that helped is named on the credits page.',
      },
    ],
  },
]
