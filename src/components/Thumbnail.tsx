import { useState } from 'react'

/**
 * A song's YouTube thumbnail.
 *
 * `mqdefault` is requested rather than `default` because these render at
 * roughly 56px wide on a 2x/3x phone screen, where the 120px variant is
 * visibly soft. Every video has an mqdefault, so there is no 404 risk from
 * the resolution choice itself.
 *
 * The image is decorative alongside a visible title, so a failure to load
 * falls back to a tape-coloured block rather than a broken-image icon.
 */
export function Thumbnail({
  youtubeId,
  alt,
  className = '',
  dim = false,
}: {
  youtubeId: string
  alt: string
  className?: string
  /** Fade it back, for tracks that cannot be played. */
  dim?: boolean
}) {
  const [failed, setFailed] = useState(false)

  return (
    <span
      className={`relative block aspect-video overflow-hidden rounded-[2px] bg-tape ring-1 ring-dust/15 ${className}`}
    >
      {!failed && (
        <img
          src={`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity ${dim ? 'opacity-35' : 'opacity-100'}`}
        />
      )}
    </span>
  )
}
