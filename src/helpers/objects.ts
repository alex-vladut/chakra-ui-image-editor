export function equals(
  first: { [key: string]: any } | null,
  second: { [key: string]: any } | null
) {
  if (!first || !second) return false;

  for (let key of Object.keys(first)) {
    if (first[key] !== second[key]) return false;
  }
  return true;
}
