import { Link } from 'react-router-dom'
import { artistsAlphabetical as artists } from '../data/artists'
import {
  BUILT_BY,
  BUILT_ON,
  CONTACT_EMAIL,
  GITHUB_URL,
  INSTAGRAM_HANDLE,
  instagramUrl,
} from '../data/copy'
import type { CreditGroup } from '../data/credits'
import { inspirationCredits, playlistCredits, toolCredits } from '../data/credits'
import { heroImages, photographerUrl, unsplashUrl } from '../data/heroImages'
import { useLanguage } from '../lib/language'
import { FeedbackLine } from '../components/FeedbackLine'
import { SectionHeading } from '../components/SectionHeading'

/**
 * Everything that helped, on one page.
 *
 * The artist & copyright statement sits first and is set at body size in the
 * primary text colour, not fine print. It is the most important block here.
 */
export function CreditsPage() {
  const { t, lang, kn } = useLanguage()

  return (
    <div className="px-5 py-8">
      <SectionHeading side={t.sideB} title={t.creditsHeading} lang={lang} />

      <p className={`mb-10 max-w-[50ch] text-[0.95rem] leading-relaxed text-label/85 ${kn ? 'kn' : ''}`}>
        {t.creditsIntro}
      </p>

      {/* The music. */}
      <section aria-labelledby="artist-credits">
        <h2
          id="artist-credits"
          className={`mb-3 text-[1.35rem] text-dial ${
            kn ? 'kn-display' : 'font-display font-medium tracking-[-0.02em]'
          }`}
        >
          {t.artistCreditsHeading}
        </h2>

        <p className={`max-w-[52ch] text-[0.95rem] leading-relaxed text-label/85 ${kn ? 'kn' : ''}`}>
          {t.artistCreditsBody}
        </p>

        <p className={`stamp mt-6 text-dust/85 ${kn ? 'kn tracking-normal' : ''}`}>
          {t.featuredArtistsLabel}
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
          {artists.map((artist, i) => (
            <li key={artist.id} className={`text-[0.95rem] text-label/80 ${kn ? 'kn' : ''}`}>
              <Link to={`/artists/${artist.id}`} className="transition-colors hover:text-dial">
                {artist.name[lang]}
              </Link>
              {i < artists.length - 1 && <span className="text-dust/75"> ·</span>}
            </li>
          ))}
        </ul>
      </section>

      <FeedbackLine className="mt-7" />

      <CreditBlock group={playlistCredits} />

      {/* Photographs, Unsplash attribution for every image in the rotation. */}
      <section aria-labelledby="photo-credits" className="mt-10 border-t border-dust/15 pt-7">
        <h2
          id="photo-credits"
          className={`mb-3 text-[1.1rem] text-label ${kn ? 'kn-display' : 'font-display font-medium'}`}
        >
          {t.photoCreditsHeading}
        </h2>
        <ul className="space-y-1.5">
          {heroImages.map((image) => (
            <li key={image.id} className="font-mono text-xs text-dust">
              <a
                href={photographerUrl(image)}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dust/30 underline-offset-2 hover:text-dial"
              >
                {image.photographer}
              </a>{' '}
              <a
                href={unsplashUrl}
                target="_blank"
                rel="noreferrer"
                className="text-dust/80 underline decoration-dust/30 underline-offset-2 hover:text-dial"
              >
                {t.onUnsplash}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <CreditBlock group={inspirationCredits} />
      <CreditBlock group={toolCredits} />

      {/* Site credits last, the smallest claim on the page. */}
      <section aria-labelledby="site-credits" className="mt-10 border-t border-dust/15 pt-7">
        <h2 id="site-credits" className={`stamp mb-3 text-dial ${kn ? 'kn tracking-normal' : ''}`}>
          {t.siteCreditsHeading}
        </h2>
        <p className={`flex items-center gap-2.5 text-[0.95rem] text-label/80 ${kn ? 'kn' : ''}`}>
          <img
            src="/gss-gh.jpg"
            alt=""
            aria-hidden="true"
            width={30}
            height={30}
            className="h-[30px] w-[30px] shrink-0 rounded-full object-cover ring-1 ring-dust/25"
          />
          {t.builtBy(BUILT_BY, BUILT_ON[lang])}
        </p>
        <p className={`mt-1 text-[0.95rem] text-dial/85 ${kn ? 'kn' : ''}`}>{t.independenceLine}</p>
        <p className={`mt-2 max-w-[50ch] text-sm leading-relaxed text-dust ${kn ? 'kn' : ''}`}>
          {t.sourceNote}
        </p>
        <ul className="mt-4 space-y-1.5 font-mono text-xs text-dust">
          <li>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-2 hover:text-dial"
            >
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-dial"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </li>
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-dial"
            >
              {GITHUB_URL.replace('https://', '')}
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

function CreditBlock({ group }: { group: CreditGroup }) {
  const { lang, kn } = useLanguage()

  return (
    <section aria-labelledby={`${group.id}-heading`} className="mt-10 border-t border-dust/15 pt-7">
      <h2
        id={`${group.id}-heading`}
        className={`mb-3 text-[1.1rem] text-label ${kn ? 'kn-display' : 'font-display font-medium'}`}
      >
        {group.heading[lang]}
      </h2>

      {group.intro && (
        <p className={`mb-4 max-w-[50ch] text-sm leading-relaxed text-label/85 ${kn ? 'kn' : ''}`}>
          {group.intro[lang]}
        </p>
      )}

      <ul className="space-y-2.5">
        {group.links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-[0.95rem] text-verdigris underline decoration-verdigris/40 underline-offset-[3px] transition-colors hover:text-dial"
            >
              {link.label}
            </a>
            {link.note && (
              <p className={`mt-0.5 text-sm text-dust ${kn ? 'kn' : ''}`}>{link.note[lang]}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
