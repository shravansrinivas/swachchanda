/**
 * Genre and mood tags used to filter the queue.
 *
 * Genre is what the song *is*. Mood is what it's *for*, the two are
 * deliberately separate, because "folk" tells you nothing about whether a song
 * suits a late bus ride or a bright morning.
 *
 * Tags on tracks in artists.ts are curatorial judgement, not metadata from a
 * label. Disagree freely and edit them.
 */

import type { Bilingual } from './artists'

export type Genre =
  | 'folk'
  | 'devotional'
  | 'hiphop'
  | 'indiepop'
  | 'rock'
  | 'fusion'
  | 'electronic'

export type Mood = 'latenight' | 'longing' | 'restless' | 'joy' | 'rain' | 'road' | 'focus'

export const genreLabels: Record<Genre, Bilingual> = {
  folk: { kn: 'ಜಾನಪದ', en: 'Folk' },
  devotional: { kn: 'ದಾಸಪದ, ವಚನ', en: 'Dasa pada & vachana' },
  hiphop: { kn: 'ಹಿಪ್-ಹಾಪ್', en: 'Hip-hop' },
  indiepop: { kn: 'ಇಂಡಿ ಪಾಪ್', en: 'Indie pop' },
  rock: { kn: 'ರಾಕ್', en: 'Rock' },
  fusion: { kn: 'ಫ್ಯೂಷನ್', en: 'Fusion' },
  electronic: { kn: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್', en: 'Electronic' },
}

/** Mood labels lean evocative rather than clinical, this is a mixtape. */
export const moodLabels: Record<Mood, Bilingual> = {
  latenight: { kn: 'ತಡರಾತ್ರಿ', en: 'Late night' },
  longing: { kn: 'ಹಂಬಲ', en: 'Longing' },
  restless: { kn: 'ಚಡಪಡಿಕೆ', en: 'Restless' },
  joy: { kn: 'ಖುಷಿ', en: 'Bright' },
  rain: { kn: 'ಮಳೆ', en: 'Rain' },
  road: { kn: 'ದಾರಿಯಲ್ಲಿ', en: 'On the road' },
  focus: { kn: 'ಕೆಲಸ', en: 'Work and focus' },
}

export const allGenres = Object.keys(genreLabels) as Genre[]
export const allMoods = Object.keys(moodLabels) as Mood[]
