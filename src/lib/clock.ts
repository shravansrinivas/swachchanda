/**
 * mm:ss, or --:-- when the duration is not known yet.
 *
 * Lives apart from the components that use it so fast refresh keeps working
 * (a module may export components or plain values, not both).
 */
export function clock(seconds: number, known = true): string {
  if (!known || !Number.isFinite(seconds) || seconds < 0) return '--:--'
  const whole = Math.floor(seconds)
  const m = Math.floor(whole / 60)
  const s = whole % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Four-digit mechanical counter, the way a tape deck showed position. */
export function tapeCounter(seconds: number): string {
  return String(Math.floor(seconds * 1.7) % 10000).padStart(4, '0')
}
