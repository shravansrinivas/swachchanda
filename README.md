# ಸ್ವಚ್ಛಂದ · Swachchanda

A listening room for independent Kannada music. One page, bilingual, songs play
in-page through the YouTube IFrame API, no accounts, no backend, no audio hosted
or redistributed here.

```bash
pnpm install
pnpm dev
```

## Adding artists and songs

Everything lives in [`src/data/artists.ts`](src/data/artists.ts). Append to the
`artists` array, no component changes needed. The minimum for a song is a title
and an 11-character YouTube video id:

```ts
{
  id: 'artist-slug',
  name: { kn: 'ಕಲಾವಿದ', en: 'Artist' },
  blurb: { kn: '…', en: '…' },
  tracks: [
    {
      title: 'Song',
      titleKn: 'ಹಾಡು',
      youtubeId: 'dQw4w9WgXcQ',
      genres: ['indiepop'],      // what it is , see src/data/taxonomy.ts
      moods: ['latenight'],      // what it's for
      childSafe: true,           // optional, see below
    },
  ],
  links: { youtube: 'https://www.youtube.com/@channel' },
}
```

`genres` and `moods` are required so that adding a song forces a decision ,
an untagged track would be invisible to every filter. The vocabulary lives in
[`src/data/taxonomy.ts`](src/data/taxonomy.ts); add to it freely.

### childSafe

`childSafe: true` is an **allowlist**. "Family listening" mode shows only tracks
marked `true`, so an unmarked song is simply absent rather than wrongly vouched
for. Nothing is ever marked *unsafe*, that would be a claim about a real
artist's work that this project has no standing to make.

The flags currently in the file are a judgement call from genre and the artist's
body of work, **not** a lyric-by-lyric audit. Listen and correct them.

Then run both checks:

```bash
pnpm verify:tracks   # does the id resolve at all?
pnpm check:embeds    # will it actually play inside this page?
```

They answer different questions and you want both.

`verify:tracks` hits YouTube's oEmbed endpoint and prints the real uploader and
title for each id, so a typo or a taken-down video shows up before anyone taps
it.

`check:embeds` boots a real IFrame player per id and records what the API
reports, because an uploader can disable embedding on a perfectly live video and
oEmbed will still happily describe it. Anything it reports gets
`unplayable: true` in the data file; such a track still appears in every list,
with its thumbnail dimmed and a link out to YouTube, but it cannot be queued and
the deck will not accept it.

> One trap worth knowing: the harness has to be served from **localhost**, not
> `127.0.0.1`. YouTube rejects a raw-IP origin and reports it as error 150,
> which is the same code it uses for a genuine "embedding disabled". From
> `127.0.0.1` the script declares the whole roster unplayable and every verdict
> is wrong.

Prefer official artist and label channels over fan re-uploads: re-uploads get
taken down, and crediting artists properly is the point of the page.

**Songs must be in Kannada.** An artist being from Karnataka is not enough, and
neither is the song appearing on a Kannada playlist. A Hindi track by a Bengaluru
band belongs somewhere else. Titles may be romanised or in English ("Rockstar",
"LIT", "Stay With Me") as long as the song is sung in Kannada.

Songs that move between Kannada and English mid-verse count. Bands here write
that way, and the test is whether Kannada is one of the languages actually being
sung, not whether it is the only one.

`links` you omit become *search* URLs for that platform rather than guesses, so
they always land somewhere useful. Replace them with real artist pages as you
confirm them.

## The other data files

| File | What it holds |
|---|---|
| [`src/data/copy.ts`](src/data/copy.ts) | Every user-facing string, in both scripts. Also your name, date, Instagram handle and contact email. |
| [`src/data/heroImages.ts`](src/data/heroImages.ts) | The rotating hero photos with Unsplash attribution. Swap the `path` and photographer; rotation and credits follow. |
| [`src/data/credits.ts`](src/data/credits.ts) | Playlists, inspiration and tools shown on `/credits`. If something helped and isn't in here, that's a bug. |
| [`src/data/artists.ts`](src/data/artists.ts) | The roster. |

## Routes

| Route | Page |
|---|---|
| `/` | One screen, no scroll: mood picker and a single play control |
| `/artists` | Every artist as a J-card |
| `/artists/:artistId` | One artist, all their songs, outbound links |
| `/songs` | Search, sort, filter sheet, and the play order |
| `/about` | What this is, why, how a song gets in |
| `/credits` | Music, photographs, playlists, tools |
| `/ekantha` | The tape and nothing else |

Every count on the site is computed from the roster, never typed in. Public
figures round down to the nearest five and take a plus when there is a
remainder ("65+ songs from 25+ artists"), which moves visibly as songs are
added; nearest ten sat still through a dozen additions and read like a slogan.
The plus disappears on an exact multiple, so "65 songs" only ever appears when
there are exactly 65. Live result counts, like songs matching a filter, stay
exact because those are functional.

Which song a set opens on is random per page load but fixed for that load, via
`SESSION_SEED` in [`src/lib/session.ts`](src/lib/session.ts). Picking a mood,
wandering to /credits and coming back returns the same suggestion and the same
running order; reloading gives a different opening. The seed is generated at
module scope on purpose, because it is read during render and has to be stable
across every render of the session.

Picking a mood does three things at once: it filters the queue, re-cues the song
on the deck, and narrows the background photographs to the frames that suit that
mood. `moodImageIds` in [`src/data/heroImages.ts`](src/data/heroImages.ts) is a
mapping onto the photos already in that file rather than a fresh search, so
every frame stays within the supplied set. The order inside each mood is a
*preference* order: the first id is the frame that mood opens on.

Two details worth keeping if you edit that file. Only the current pool is
mounted, plus the outgoing frame, because these sit in a full-bleed fixed layer
where nothing is lazy-loaded and a phone would otherwise fetch all fourteen.
And `imagesForMood(null)` returns a curated six rather than everything, for the
same reason.

Only home rotates its background. Every other route holds one fixed frame from
`pageImageIds`, because an image changing under you while you read a list is a
distraction, and a page that always looks the same is easier to recognise.

The mood picker itself is one component, [`MoodRow`](src/components/MoodRow.tsx),
used by both the home screen and the song list so they cannot drift. On the song
list it takes an `onMore` button, pinned outside the scroller because sound,
family listening and sort all live behind it.

The home screen is locked to exactly one viewport and carries its own bottom
clearance, so it never scrolls; every other route pads for the deck instead. A
song is cued into the player on arrival and an autoplay attempt is made once.
Browsers block unmuted autoplay without a gesture (iOS Safari reliably so), so
that is an attempt, not a guarantee, and the play control is the real path. If
the attempt is blocked the player reports `CUED`, which clears the loading state
rather than leaving the deck reading "cueing up" forever.

`play()` is deliberately **not idempotent**: called with the song already
playing it pauses, because that is what a listener expects from re-tapping a row
they are already hearing. Never call it from a mount effect. Doing exactly that
in HomePage meant navigating back to the front page paused the music. The
one-shot autoplay attempt now lives in `PlayerProvider`, where it fires once per
page load rather than once per mount.

Playback state lives in `PlayerProvider`, above the router, the hidden YouTube
iframe is created once and never unmounted, so a song keeps going as you move
between pages. `vercel.json` rewrites all paths to `index.html` so deep links
work on a static host.

No user-facing sentence belongs in a `.tsx` file, if you're typing copy into a
component, it goes in `copy.ts` instead, so the language toggle keeps working.

### Ekantha

ಏಕಾಂತ, solitude. A route rather than a mode flag, so it can be linked, shared
and left with the back button. Because player state lives above the router,
entering and leaving never interrupts the song. It gets a lighter scrim than the
rest of the site: it carries almost no text, so the photograph is allowed
forward, and that is most of what makes the room feel different.

Leaving is offered three ways (visible control, Escape, browser back), because a
room you cannot obviously get out of is a trap. Entering is offered from the
nav, the front page and the tape at the foot of the screen.

### Colour contrast

`dust` was `#8A8578`, which measured **4.44:1 against the page at full
opacity**, so it failed AA for body text even before any transparency; most uses
were at 50 to 70 percent, i.e. 2.1 to 2.9:1. It is now `#B0AA99` (7.05:1), and
muted text does not go below 75 percent. Lower opacities are reserved for rules
and separators. If you change either colour, re-check rather than eyeballing it:
this one looked fine and was not.

### The queue can be hand-edited

Songs can be reordered and dropped from the queue for the session. The edits are
an *overlay* on the derived order (`removed` and `manualOrder` in
`PlayerProvider`), not a replacement for it, so a filter change cannot be
silently undone by a stale hand-built list, and one action clears them. Changing
a filter resets both, since carrying removals across would hide songs the reader
just asked to see.

Reordering works by dragging the grip handle, and by arrow buttons. The drag is
bound to the handle rather than the whole row, because the queue lives in a
scrolling column inside a scrolling sheet on touch and a whole-row drag fights
both. Its listeners go on `window` without pointer capture: the live preview
reorders the list, so React moves the handle's own DOM node mid-drag, which
drops any capture set on it. The buttons stay because drag is unusable from a
keyboard.

The list shows the whole order rather than only what is ahead, so songs already
played stay visible and reachable; the current row is highlighted and scrolled
to.

### Sorting orders the queue, not just the view

`sort` lives in `PlayerProvider`, so /songs shows the queue in its real order
and next/previous walk exactly what you read. Alphabetical by title is the
default: a 63-song list in roster order is only navigable if you already know
the roster. Comparison is on the romanised fields, so the order does not shift
when the language picker does. Artist listings use `artistsAlphabetical`;
`artists` keeps its authored order because that is the tape order.

### Chrome follows the picker, content shows both scripts

Buttons, headings and instructions follow the language picker; reading the same
button twice is noise. But song titles, artist names and genre/mood tags always
carry **both** scripts, whatever the picker says, because those are the thing
itself rather than a label for it. `BiText` in
[`src/components/Bilingual.tsx`](src/components/Bilingual.tsx) does this, side by
side with a middot rather than stacked: stacking doubled the height of every row
and made lists look like they had twice as many entries as they did. It renders
one string when the two are identical.

### Kannada is written but not yet offered

`KANNADA_READY` in [`src/lib/language.ts`](src/lib/language.ts) is `false`. The
Kannada copy exists in full and nothing has been removed; the picker just shows
that half as "soon" and refuses the switch. Flip the flag to `true` once someone
who speaks it has read it through, and the choice goes live. No other change is
needed, because every label is already written in both scripts.

### On the Kannada

The Kannada is **written, not translated**. Where a literal rendering would read
like a manual (`ಆಲಿಸುವ ಕೋಣೆ` for "listening room"), the Kannada says the thing
its own way instead, so the two columns deliberately are not line-for-line
equivalents, and verb endings lean spoken (`ಬರೀತಾನೆ`, `ಕೇಳ್ತೀನಿ`, `ಸಿಗುತ್ತೆ`).
Keep that register when you add copy; a calque will stand out immediately.

The page opens in Kannada. Flip `DEFAULT_LANG` in [`src/App.tsx`](src/App.tsx)
to lead in English.

## Links

Three levels, and each is honest about what it knows:

- **Song level** (in the player): YouTube is exact, since every track has a
  verified video id. Spotify and Apple are *searches* scoped to the song and
  artist, because no per-song ids are held for them. Set `spotifyUrl` /
  `appleMusicUrl` on a track and the exact link replaces the search.
- **Artist level** (on the artist page): the same idea, scoped to the artist.
- **Profiles** (Instagram, Wikipedia): only ever shown when the URL is actually
  held in the data. Never a search, never a guess, and absent ones simply do not
  render. Every Wikipedia URL in the file was checked for a 200 before it went
  in; Instagram handles are only there if they were seen on a real source. Add
  more to `links` on any artist.

## Credits

Music belongs to its artists and labels; see the footer. Photographs are from
Unsplash, credited by photographer in the hero and the footer.
