import { GITHUB_URL, INSTAGRAM_HANDLE, instagramUrl, mailtoUrl } from '../data/copy'
import { useLanguage } from '../lib/language'

export function CallOut() {
  const { t, kn } = useLanguage()

  return (
    <section className="px-5 pt-2 pb-12" aria-labelledby="callout-heading">
      <div className="grain relative overflow-hidden rounded-[3px] border border-dial/30 bg-dial/[0.06] px-5 py-7">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-dial" />

        <h2
          id="callout-heading"
          className={`text-[1.5rem] leading-snug text-label ${
            kn ? 'kn-display' : 'font-display font-medium tracking-[-0.02em]'
          }`}
        >
          {t.calloutHeading}
        </h2>

        <p className={`mt-3 max-w-[44ch] text-[0.95rem] leading-relaxed text-label/85 ${kn ? 'kn' : ''}`}>
          {t.calloutBody}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className={`rounded-full bg-dial px-4 py-2.5 text-sm text-tape transition-opacity hover:opacity-85 ${
              kn ? 'kn' : 'font-display'
            }`}
          >
            {t.calloutInstagram} · @{INSTAGRAM_HANDLE}
          </a>
          <a
            href={mailtoUrl}
            className={`rounded-full border border-dust/30 px-4 py-2.5 text-sm text-label transition-colors hover:border-dial hover:text-dial ${
              kn ? 'kn' : 'font-display'
            }`}
          >
            {t.calloutEmail}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={`rounded-full border border-dust/30 px-4 py-2.5 text-sm text-label transition-colors hover:border-dial hover:text-dial ${
              kn ? 'kn' : 'font-display'
            }`}
          >
            {t.calloutGithub}
          </a>
        </div>
      </div>
    </section>
  )
}
