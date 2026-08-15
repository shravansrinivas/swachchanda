import { feedbackMailtoUrl, instagramUrl } from '../data/copy'
import { useLanguage } from '../lib/language'

/**
 * An invitation to send anything back: a correction, a complaint, a note that
 * something reads badly on a phone.
 *
 * It sits next to the things most likely to be wrong (the credits, the roster,
 * the artist names) but it deliberately asks for more than corrections. Someone
 * who finds the site awkward to use will never file a "correction", and that is
 * the note most worth having.
 *
 * It routes to the same two channels as everything else rather than inventing a
 * form, because a form nobody reads is worse than an inbox somebody does.
 */
export function FeedbackLine({ className = '' }: { className?: string }) {
  const { t, kn } = useLanguage()

  return (
    <div className={`rounded-[3px] border border-dust/15 bg-deck/50 px-4 py-4 ${className}`}>
      <p className={`max-w-[52ch] text-sm leading-relaxed text-dust ${kn ? 'kn' : ''}`}>
        {t.feedbackLine}
      </p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        <a
          href={feedbackMailtoUrl}
          className={`rounded-full border border-dial/40 px-3.5 py-1.5 text-sm text-dial transition-colors hover:bg-dial hover:text-tape ${kn ? 'kn' : 'font-display'}`}
        >
          {t.feedbackAction}
        </a>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full border border-dust/25 px-3.5 py-1.5 text-sm text-dust transition-colors hover:border-dial hover:text-dial ${kn ? 'kn' : 'font-display'}`}
        >
          {t.calloutInstagram}
        </a>
      </div>
    </div>
  )
}
