/**
 * Which A to Z bucket a row belongs in.
 *
 * Always taken from the *romanised* field, because that is what the lists are
 * sorted on, so the rail and the order it indexes cannot disagree when the
 * language picker changes. Anything not starting with a Latin letter falls in
 * "#", which no list currently uses but which keeps the function total.
 *
 * Lives here rather than beside the rail component because a module may export
 * components or values, not both, without breaking fast refresh.
 */
export function letterFor(value: string): string {
  const first = value.trim().charAt(0).toUpperCase()
  return first >= 'A' && first <= 'Z' ? first : '#'
}
