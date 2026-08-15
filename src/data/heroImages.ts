/**
 * Hero backgrounds. Real Unsplash photos, real photographers.
 *
 * Unsplash's attribution guidelines ask for the photographer's name linked to
 * their profile, plus a link back to unsplash.com. `HeroCredit` renders both.
 * The `?utm_source` params are the referral tags Unsplash asks API consumers
 * to append, keep them on if you swap photos in.
 *
 * To change a photo: grab its id from the unsplash.com/photos/<slug>-<id> URL,
 * take the `photo-...` segment of the image URL, and fill in the photographer.
 * The rotation, cross-fade and credit line all pick it up automatically.
 */

import type { Mood } from './taxonomy'

export interface HeroImage {
  /** Unsplash photo id, e.g. gHxM2pbJxvo. Used as the React key. */
  id: string
  /** The `photo-xxxx` path segment on images.unsplash.com. */
  path: string
  /** Alt text, these are decorative, but screen readers still get a sense. */
  alt: string
  photographer: string
  /** Unsplash username, for the profile link. */
  username: string
}

const UTM = 'utm_source=swachchanda&utm_medium=referral'

export const heroImages: HeroImage[] = [
  // {
  //   id: 'gHxM2pbJxvo',
  //   path: 'photo-1694340309722-564b69c19c35',
  //   alt: 'A lit-up pub front on a Koramangala street at night, Bengaluru',
  //   photographer: 'Nithin Purple',
  //   username: 'nithinpurple1',
  // },
  {
    id: '0VPtbxMGB3M',
    path: 'photo-1742993065697-31c8ad0919dc',
    alt: 'A night market glowing under strung bulbs',
    photographer: 'Anurag Sarkar',
    username: 'vdivision',
  },
  {
    id: 'dCc7XdnTZK0',
    path: 'photo-1734120113786-a3a99b51d6bc',
    alt: 'A street food cart at night, steam catching the lamplight',
    photographer: 'Tirth Jivani',
    username: 'tirthjivani',
  },
  {
    id: '_hwFciVOj7I',
    path: 'photo-1561799113-56c0f69d3100',
    alt: 'People gathered behind a fence in the evening',
    photographer: 'Sujith Devanagari',
    username: 'sujithdevanagari',
  },
  {
    id: '17_mTUfP8mA',
    path: 'photo-1687712936173-bcfadf94699e',
    alt: 'A busy Bengaluru street after dark, headlights and shopfronts',
    photographer: 'Anshu Aditya',
    username: 'sladexwilson04',
  },
  {
    id: 'vIFyL9xfd0o',
    path: 'photo-1651963645187-59c625b9d1bb',
    alt: 'A quiet road at dusk with streetlamps coming on',
    photographer: 'Purushotham Shriki',
    username: 'purushotham_shriki',
  },
  {
    id: 'g37M8iv9dPA',
    path: 'photo-1609506640889-a7fc42ee5619',
    alt: 'A man in a white shirt riding a bicycle in daylight',
    photographer: 'Zoheb Basheer',
    username: 'zohheb101',
  },
  {
    id: 'N8bQPdaZ2iU',
    path: 'photo-1643467220785-49612855af5a',
    alt: 'A green and white train pulling into a station',
    photographer: 'Asif Ahmed',
    username: 'asidahmed',
  },
  {
    id: 'nF65yVqSD6k',
    path: 'photo-1652912368832-4d8d7ca041b1',
    alt: 'A park with a bandstand and people walking around it',
    photographer: 'Olha Kolesnyk',
    username: 'redinbook',
  },
  {
    id: 'I_8I75ogzkE',
    path: 'photo-1596018382916-56d2e341d784',
    alt: 'A brown concrete building under a blue sky',
    photographer: 'Srusti Valakamadinni',
    username: 'whisk_n_click',
  },
  {
    id: 'l2OdGlshGC0',
    path: 'photo-1600112356915-089abb8fc71a',
    alt: 'A white concrete building under a blue sky',
    photographer: 'Syed Ali',
    username: 'syedmohdali121',
  },
  {
    id: 'yahih9jwINU',
    path: 'photo-1591885587747-bee871855d92',
    alt: 'A brown building standing on a hilltop',
    photographer: 'ANANYA ANAND',
    username: 'ananya94',
  },
  {
    id: 'wa1aoHfJwj8',
    path: 'photo-1569571665379-f952b753ccc7',
    alt: 'Brown and grey concrete walls in daylight',
    photographer: 'Srinivas JD',
    username: 'kirisrini',
  },
  {
    id: 'rXWB1dF_Mh0',
    path: 'photo-1695397968094-b7c9e6bcd203',
    alt: 'Two people riding through the city on a moped',
    photographer: 'Samyuktha Nair',
    username: 'samyukthanair',
  },
]

/**
 * Which of our photographs suit which mood.
 *
 * Deliberately a mapping onto the six images already in this file rather than
 * new searches: every frame stays a Bengaluru night, so picking "bright" moves
 * you to the lit market rather than to some generic stock sunrise. Every mood
 * lists at least two so the rotation still has somewhere to go.
 */
export const moodImageIds: Record<Mood, string[]> = {
  latenight: ['dCc7XdnTZK0', '_hwFciVOj7I', 'vIFyL9xfd0o'],
  longing: ['yahih9jwINU', 'nF65yVqSD6k', '_hwFciVOj7I', 'vIFyL9xfd0o'],
  restless: ['wa1aoHfJwj8', 'rXWB1dF_Mh0', '17_mTUfP8mA'],
  joy: ['l2OdGlshGC0', 'nF65yVqSD6k', 'g37M8iv9dPA', '0VPtbxMGB3M'],
  rain: ['I_8I75ogzkE', 'dCc7XdnTZK0', 'vIFyL9xfd0o'],
  road: ['N8bQPdaZ2iU', 'g37M8iv9dPA', 'rXWB1dF_Mh0', '17_mTUfP8mA'],
  focus: ['I_8I75ogzkE', 'yahih9jwINU', 'nF65yVqSD6k', 'vIFyL9xfd0o'],
}

/**
 * The default rotation, used when no mood is chosen.
 *
 * A curated six rather than the whole library: every frame in the pool gets
 * mounted at once (see SiteBackground), so handing back all fourteen would have
 * a phone fetch all fourteen on the front page. Picked to span the set, three
 * night and three day.
 */
const DEFAULT_ROTATION = [
  // 'gHxM2pbJxvo',
  'nF65yVqSD6k',
  'dCc7XdnTZK0',
  'g37M8iv9dPA',
  'vIFyL9xfd0o',
  'rXWB1dF_Mh0',
]

/** The frames in play for a mood, or the default rotation when none is chosen. */
export function imagesForMood(mood: Mood | null): HeroImage[] {
  if (!mood) {
    const picked = DEFAULT_ROTATION.map((id) =>
      heroImages.find((image) => image.id === id),
    ).filter((image): image is HeroImage => Boolean(image))
    return picked.length ? picked : heroImages
  }
  // Mapped in the order the mood lists them, so the first frame of a mood is a
  // deliberate choice rather than whichever photo sits earliest in the file.
  const picked = moodImageIds[mood]
    .map((id) => heroImages.find((image) => image.id === id))
    .filter((image): image is HeroImage => Boolean(image))
  // Never hand back an empty pool if an id is edited out from under this.
  return picked.length ? picked : heroImages
}

/**
 * One fixed photograph per route, everywhere except home.
 *
 * Only the front page rotates. On the inner pages a background that changes
 * under you while you are reading a list or a paragraph is a distraction, and
 * a page that always looks the same is easier to recognise. Home keeps the
 * rotation because that is where the mood is chosen.
 */
export const pageImageIds: Record<string, string> = {
  '/artists': 'wa1aoHfJwj8',
  '/songs': 'nF65yVqSD6k',
  '/about': 'yahih9jwINU',
  '/credits': 'I_8I75ogzkE',
}

/** The fixed frame for a route, or undefined for routes that rotate. */
export function imageForPath(pathname: string): HeroImage | undefined {
  // Artist detail pages sit under /artists and share its frame.
  const key = pathname.startsWith('/artists') ? '/artists' : pathname
  const id = pageImageIds[key]
  return id ? heroImages.find((image) => image.id === id) : undefined
}

/** How long a photo holds before cross-fading, when nothing is playing. */
export const HERO_INTERVAL_MS = 24_000

/** Sized, compressed source for a hero image. */
export function heroSrc(image: HeroImage, width = 1400): string {
  return `https://images.unsplash.com/${image.path}?auto=format&fit=crop&w=${width}&q=70`
}

export function photographerUrl(image: HeroImage): string {
  return `https://unsplash.com/@${image.username}?${UTM}`
}

export const unsplashUrl = `https://unsplash.com/?${UTM}`
