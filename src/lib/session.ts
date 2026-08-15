/**
 * A random number fixed for the lifetime of the page.
 *
 * The roster should not open on the same song every single time, but it should
 * not reshuffle under you either: picking "late night", wandering to /credits
 * and coming back should return the same suggestion and the same running order.
 * One seed per page load gives both. Reload for a different opening.
 *
 * Generated at module scope on purpose. It is read during render, so it has to
 * be stable across every render of the session, and a value computed inside a
 * component or a memo would not be.
 */
export const SESSION_SEED = Math.floor(Math.random() * 0xffffffff)

/** Stable 32-bit hash of a string, mixed with the session seed. */
function hash(text: string): number {
  let h = SESSION_SEED ^ 0x9e3779b9
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0
  }
  return h >>> 0
}

/**
 * Where a given set should start this session.
 *
 * Deterministic in (session seed, key, length), so the same filter set always
 * resolves to the same starting song for as long as the page is open, and to a
 * different one next time.
 */
export function sessionStart(key: string, length: number): number {
  if (length <= 0) return 0
  return hash(key) % length
}
