/**
 * Returns an array containing an arithmetic progression.
 *
 * @param start Specifies the range’s initial value. The start is inclusive (included in the returned array)
 * @param stop The stop value is exclusive; it is not included in the result
 * @param step If step is positive, the last element is the largest start + i * step less than stop; if step is negative, the last element is the smallest start + i * step greater than stop
 */
export function range(start: number, stop: number, step = 1): number[] {
  const n = Math.max(0, Math.ceil((stop - start) / step));
  const range = new Array(n);

  let i = -1;

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}