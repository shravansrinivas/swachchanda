import { useEffect, useRef, useState } from 'react'
import { HERO_INTERVAL_MS, type HeroImage } from '../data/heroImages'

/**
 * Advance the background on a timer, whenever a new song starts, and whenever
 * the pool itself changes.
 *
 * The pool is mood-scoped: picking "late night" narrows it to the frames that
 * suit late night, so the photograph answers the mood rather than drifting
 * independently of it. A pool change jumps straight to its first frame, because
 * the point of picking a mood is to see it take effect now.
 *
 * Deliberately starts at index 0, with no randomness, so the page opens on the
 * same image every time.
 *
 * @param pool       frames currently in play, in order
 * @param advanceKey changes identity when a new track starts; null when idle
 */
export function useHeroRotation(pool: HeroImage[], advanceKey: string | null): HeroImage {
  const [index, setIndex] = useState(0)
  const lastKeyRef = useRef(advanceKey)

  // Identity of the pool, so a re-render with the same frames does not reset.
  const poolKey = pool.map((image) => image.id).join(',')
  const lastPoolRef = useRef(poolKey)

  /**
   * A mood change rewrites the pool on one render and the cued song on the
   * next, so the track-advance below would fire just after this reset and bump
   * straight off frame 0. Two moods that share a photo then both land on it and
   * the background appears not to have changed at all. This swallows exactly
   * one advance so the pool change wins.
   */
  const skipNextAdvance = useRef(false)

  useEffect(() => {
    if (poolKey === lastPoolRef.current) return
    lastPoolRef.current = poolKey
    setIndex(0)
    skipNextAdvance.current = true
  }, [poolKey])

  useEffect(() => {
    if (pool.length <= 1) return
    const id = window.setTimeout(() => {
      setIndex((current) => (current + 1) % pool.length)
    }, HERO_INTERVAL_MS)
    return () => window.clearTimeout(id)
  }, [index, pool.length])

  useEffect(() => {
    if (pool.length <= 1) return
    // Only a *change* of track advances, not the initial null, and not a
    // pause or resume of the song already playing.
    if (advanceKey !== null && advanceKey !== lastKeyRef.current) {
      if (skipNextAdvance.current) skipNextAdvance.current = false
      else setIndex((current) => (current + 1) % pool.length)
    }
    lastKeyRef.current = advanceKey
  }, [advanceKey, pool.length])

  return pool[Math.min(index, pool.length - 1)] ?? pool[0]
}
