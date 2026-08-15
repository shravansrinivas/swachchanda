# Contributing

Swachchanda is a listening room for independent Kannada music. The most useful
contributions are not code: a song that should be here, a name spelt wrong, a
credit pointing at the wrong person.

## You do not need to write code

**Suggest a song.** Artist, song, and where you heard it is enough. There is an
invitation at the foot of `/songs`, or write to
[shravangs@pm.me](mailto:shravangs@pm.me?subject=Swachchanda,%20a%20song%20you%20should%20add)
or DM [@shravan.fm](https://instagram.com/shravan.fm).

**Send a correction.** A misspelt name, a missing credit, a song attributed to
the wrong artist, a page that reads badly on your phone. The feedback line at
the foot of most pages goes to the same two channels.

Credits are the likeliest thing to be wrong here. Most of them come from what
the official upload says in its own title, which is a good source and not a
complete one: it will not tell you who played bass. If you know better than the
file does, that is a real contribution.

**If you are an artist here** and want your song taken down, or credited
differently, say so and it happens the same day. No case to argue, no form. This
page exists to credit you; if it is doing the opposite for you, it is wrong.

## Running it

```bash
pnpm install
pnpm dev
```

pnpm, not npm or yarn: the lockfile is pnpm's and the version is pinned in
`package.json`.

Before you open a pull request:

```bash
pnpm build          # typecheck and production build
pnpm lint
pnpm verify:tracks  # if you touched src/data/artists.ts
pnpm check:embeds   # ditto, and see the localhost trap in the README
```

## Adding a song

Everything lives in [`src/data/artists.ts`](src/data/artists.ts) and nothing in
`src/components` needs to change. The README has
[the shape of an entry](README.md#adding-artists-and-songs) and the credit
roles; the rules that are not negotiable are these.

**The song must be sung in Kannada.** An artist being from Karnataka is not
enough, and neither is the song appearing on a Kannada playlist. Titles may be
romanised or in English as long as the singing is Kannada, and songs that move
between Kannada and English mid-verse count. That is how a lot of these bands
write.

**Credit everyone on the record**, in the order the release bills them. Songs
are not owned by one artist here: a song lists its own credits and every name on
it gets that song on their page. If you only know some of the names, add the
ones you know rather than none.

**Do not invent a role.** `with` exists precisely so you can credit someone
without claiming to know what they did. Use `words` and `music` only when a
source actually says so.

**Link the official artist or label channel**, not a fan re-upload. Re-uploads
get taken down, and crediting artists properly is the entire point.

**Run both checks.** `verify:tracks` asks whether the id resolves at all;
`check:embeds` asks whether it will play inside this page. They answer different
questions, an uploader can disable embedding on a perfectly live video, and you
want both answers.

**Tag `genres` and `moods`.** They are required so that adding a song forces a
decision. An untagged song is invisible to every filter.

**`childSafe` is an allowlist.** Mark a song `true` only if you have listened.
Nothing is ever marked *unsafe*: that would be a claim about a real artist's
work that this project has no standing to make.

## Writing copy

Every user-facing string lives in [`src/data/copy.ts`](src/data/copy.ts), in
both scripts. If you are typing a sentence into a `.tsx` file, it belongs there
instead, or the language toggle quietly stops working.

Three house rules, in order of how much they matter:

1. **Never use a singular form for a person in Kannada.** Honorific plurals
   only: ಹಿಡಿದಿಡ್ತಾರೆ, not ಹಿಡಿದಿಡ್ತಾನೆ; ಒಬ್ಬರು, not ಒಬ್ಬಳು; ಅವರ, not ಅವನ. The
   singular reads as disrespectful, and every person named here is a real
   person. English uses they/their for the same reason.
2. **No em dashes.** Anywhere: copy, comments, commit messages, docs. Use a
   comma, a colon, or a full stop.
3. **Write the Kannada, do not translate it.** Where a literal rendering would
   read like a manual (ಆಲಿಸುವ ಕೋಣೆ for "listening room"), say the thing its own
   way. The two columns are deliberately not line-for-line equivalents and verb
   endings lean spoken. A calque stands out immediately.

The picker still shows Kannada as "soon" (`KANNADA_READY` in
[`src/lib/language.ts`](src/lib/language.ts)) because the copy exists in full but
has not been read through by someone who speaks it. If you are that person, that
is a large and welcome contribution.

## Working in the code

A few things that look like tidy-ups and are not:

- **`play()` is not idempotent.** Called with the song already playing, it
  pauses, because that is what re-tapping a row you are hearing should do. Never
  call it from a mount effect. Use `toggle()` or check the status first.
- **A filter never starts audio, except where a mood is the only control.** On
  the front page and in Ekantha, picking a mood *is* the request to hear
  something, so `setFilters(next, true)` plays it. On the song list the same
  control filters a view you are reading, and starting a song under you there is
  an interruption. That is the `browseOnly` prop on `MoodRow`.
- **Contexts and providers live in separate modules** (`language.ts` and
  `LanguageProvider.tsx`). That is what keeps fast refresh working, and the
  lowercase/PascalCase split avoids a filename collision on macOS.
- **Muted text does not go below `dust/75`.** Below that it fails AA on this
  background. The palette was audited once and the old value looked fine while
  measuring 4.44:1, so measure rather than eyeball.
- **No `padding-bottom: env(safe-area-inset-bottom)` on `body`.** It sits below
  a shell that is already exactly `100svh`, so the front page scrolled by
  exactly the inset on any phone with a home indicator, and never in a desktop
  browser or an emulator, where the inset is 0. Dock clearance belongs to
  whatever is above the deck.
- **Counts are computed from the roster, never typed.** If you find yourself
  writing "60+" into a string, use `rosterMeta` instead.

Comments here explain *why*, especially where the obvious version of the code
was tried and was wrong. If you fix a bug that took a while to find, leave the
finding behind in a comment. Several of the ones in this repo are the only
reason those bugs have not come back.

## What this project will not do

- Host or redistribute audio. Everything plays from the artist's own YouTube
  upload, and the links out go where they actually get paid.
- Track readers. Analytics counts visits and nothing else. There are no
  accounts.
- Mark anyone's music as unsafe, explicit, or lesser.

## Licence

By contributing you agree that your contribution is licensed under the repo's
[LICENSE](LICENSE). That covers the site. It does not cover the music, which
belongs to the artists and labels who made it.
