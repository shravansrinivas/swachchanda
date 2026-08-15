/**
 * Seeded shuffle.
 *
 * Deterministic on purpose: the play order is derived inside a useMemo, and an
 * un-seeded Math.random() there would hand back a different order any time
 * React chose to recompute, the queue would silently rearrange itself
 * mid-listen. A seed makes the order stable until something deliberately bumps
 * it (toggling shuffle, or changing the filters).
 */

/** mulberry32, small, fast, good enough for shuffling a track list. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates against a seeded PRNG. Returns a new array. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const random = mulberry32(seed)
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
