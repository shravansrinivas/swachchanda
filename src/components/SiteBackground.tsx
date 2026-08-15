import { useEffect, useRef, useState } from 'react'
import { heroImages, heroSrc, type HeroImage } from '../data/heroImages'

/**
 * The photograph, behind every page rather than only the hero.
 *
 * Fixed rather than scrolling, so the image stays put while content moves over
 * it, the way a backdrop would.
 *
 * Only the current mood's pool is mounted, plus whichever frame was showing
 * just before it. Mounting the whole library was fine at six images and is not
 * at fourteen: they all sit inside a full-bleed fixed layer, so none would be
 * lazy-loaded and a phone would fetch every one. Keeping the outgoing frame
 * mounted is what lets a pool change still cross-fade rather than cut, and it
 * has to be state rather than a ref, because the outgoing frame only appears
 * if its arrival causes a render.
 *
 */

/**
 * How hard the scrim works.
 *
 * `hero` sits under the front page, which carries a lot of text over a
 * photograph. `page` is the heaviest, for routes that are mostly body copy.
 * `calm` is Ekantha: almost no text, so the photograph is allowed to come
 * forward, which is most of what makes that room feel different.
 *
 * Even `hero` is fairly heavy. The home screen carries a wordmark, a tagline, a
 * mood row and a track title, and a scrim light enough to flatter the
 * photograph left those sitting on a crowd scene and unreadable.
 */
export type Scrim = 'hero' | 'page' | 'calm'

export function SiteBackground({
  pool,
  active,
  scrim,
}: {
  pool: HeroImage[]
  active: HeroImage
  scrim: Scrim
}) {
  const [outgoingId, setOutgoingId] = useState<string | null>(null)
  const previousActiveId = useRef(active.id)

  useEffect(() => {
    if (previousActiveId.current === active.id) return
    setOutgoingId(previousActiveId.current)
    previousActiveId.current = active.id
  }, [active.id])

  const mounted = [...pool]
  const outgoing = outgoingId ? heroImages.find((image) => image.id === outgoingId) : undefined
  for (const extra of [outgoing, active]) {
    if (extra && !mounted.some((image) => image.id === extra.id)) mounted.push(extra)
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-tape">
      {mounted.map((image) => (
        <img
          key={image.id}
          src={heroSrc(image, 1400)}
          srcSet={`${heroSrc(image, 800)} 800w, ${heroSrc(image, 1400)} 1400w, ${heroSrc(image, 2000)} 2000w`}
          sizes="100vw"
          alt=""
          fetchPriority={image.id === active.id ? 'high' : 'low'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-in-out ${
            image.id === active.id ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          scrim === 'page'
            ? 'bg-tape/94'
            : scrim === 'calm'
              ? 'bg-tape/78'
              : 'bg-gradient-to-b from-tape/88 via-tape/78 to-tape/92'
        }`}
      />

      <div className="grain absolute inset-0" />
    </div>
  )
}
