# ಸ್ವಚ್ಛಂದ · Swachchanda

A listening room for independent Kannada music. One page, bilingual, songs play
in-page through the YouTube IFrame API, no accounts, no backend, no audio hosted
or redistributed here.

```bash
pnpm install
pnpm dev
```

Suggesting a song, correcting a credit, or asking for your own song to be taken
down needs no code and no account: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Adding artists and songs

Everything lives in [`src/data/artists.ts`](src/data/artists.ts): the people in
`artists`, the songs in `songs`, and the association between them on each song.

**Songs are not nested under an artist.** A song names its own credits, in
billing order, and an artist page is a query over that (`songsBy`). Filing every
song under exactly one artist was the old shape and it quietly lied: half of
these are collaborations, and the second, third and fourth names were simply not
on the site. Sumedh K sings on seven songs here and his page showed five.

```ts
// in `artists`, whoever is not already there
{ id: 'sanjana-doss', name: { kn: 'ಸಂಜನಾ ಡಾಸ್', en: 'Sanjana Doss' } }

// in `songs`
{
  id: 'nange-allava',              // stable slug, this is the queue key
  title: 'Nange Allava',
  titleKn: 'ನಂಗೆ ಅಲ್ಲವಾ',
  youtubeId: 'dQw4w9WgXcQ',
  credits: [{ artist: 'sanjith-hegde' }, { artist: 'sanjana-doss', role: 'with' }],
  genres: ['indiepop'],            // what it is, see src/data/taxonomy.ts
  moods: ['longing'],              // what it's for
  childSafe: true,                 // optional, see below
}
```

`blurb` on an artist is **optional**. Plenty of people here are credited on
somebody else's record and there is nothing sourced to say about them beyond the
name. A name with no write-up is an honest entry; an invented write-up is not.
Artists with a blurb and a lead credit get a card on /artists, everyone else
gets a line in "Also credited" and a page of their own.

### Credit roles

| role | means |
|---|---|
| `lead` (default) | billed first, who the song goes out under |
| `with` | credited on the official release, role not asserted |
| `featured` | the release says "ft." |
| `words` | wrote the lyrics, and a source says so |
| `music` | composed it, and a source says so |

`with` is deliberately vague because most sources are: a YouTube title reading
`Song | A | B` does not say who sang and who played. Claiming a role we do not
know is worse than saying plainly that they are on the record. `words` and
`music` are only for credits an actual source states.

An unknown id in `credits` **throws at load** rather than dropping the name. On
a site whose whole job is crediting people, a silently missing name is exactly
the failure worth making loud, and it can only come from a typo in this file.

`genres` and `moods` are required so that adding a song forces a decision:
an untagged song would be invisible to every filter. The vocabulary lives in
[`src/data/taxonomy.ts`](src/data/taxonomy.ts); add to it freely.

### childSafe

`childSafe: true` is an **allowlist**. "Family listening" mode shows only songs
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
it. It is also the best source for credits: an official upload usually names
everyone on the record in its title.

`check:embeds` boots a real IFrame player per id and records what the API
reports, because an uploader can disable embedding on a perfectly live video and
oEmbed will still happily describe it. Anything it reports gets
`unplayable: true` in the data file; such a song still appears in every list,
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
| [`src/data/artists.ts`](src/data/artists.ts) | The people, the songs, and who is credited on what. |

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

Picking a mood filters the queue, re-cues the song on the deck, and narrows the
background photographs to the frames that suit that mood. Whether it also
*starts* the song depends on where it was picked: on the front page and in
Ekantha a mood is the only control, so it is the request and it plays. On the
song list the same component filters a view being read, so it does not, and the
row or the "play this set" button is the request. That is `browseOnly` on
`MoodRow` and the `andPlay` argument to `setFilters`. `moodImageIds` in [`src/data/heroImages.ts`](src/data/heroImages.ts) is a
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

On a computer it takes the whole screen, the way a video player does: a quiet
room with a URL bar, a tab strip and a dock above it is not quiet. Every entry
point asks for fullscreen *in its own click handler*, because a browser only
grants it inside a real gesture, and an effect that runs after the route change
is too late. It is capability-checked and every rejection is swallowed, since
iOS Safari does not implement fullscreen on elements at all and a browser
refusing is a normal outcome. `F` toggles it, and leaving the room by any route
gives the screen back.

Escape in fullscreen belongs to the browser: it gives the screen back and does
nothing else. Leaving the room as well would make one key do two things and land
you on the front page when you only wanted your window back. A second press
leaves. Leaving is otherwise offered three ways (visible control, Escape,
browser back), because a room you cannot obviously get out of is a trap.
Entering is offered from the nav, the front page, the tape at the foot of the
screen, and the open player.

Keystrokes only reach the room while focus is inside our own document, and the
YouTube iframe takes focus when playback starts. Once it has, Escape goes to
YouTube and the page never sees it, so the room reclaims focus whenever the
window blurs into an iframe.

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
silently undone by a stale hand-built list, and one action clears them.

The edits **survive a filter change**. They used to be cleared on the argument
that a different set of songs deserves a clean queue, which meant dragging a
queue into shape and then picking a mood threw the arrangement away. The overlay
shape is what makes keeping them safe: `manualOrder` ranks whatever is present
and appends the rest, so a song the new mood brings in is never swallowed. The
cost is that a removed song stays removed even after you pick a mood it belongs
to, so the list can be quietly shorter than the filter claims; `resetQueue` is
offered the whole time there is anything to undo.

Under shuffle the hand order is **kept but not applied**, and the reorder
controls are hidden. Ranking the songs would put them back in that exact
sequence and leave the shuffle doing nothing. Turn shuffle off and the
arrangement returns. Removals still apply, which is why the reset control stays
available there.

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
