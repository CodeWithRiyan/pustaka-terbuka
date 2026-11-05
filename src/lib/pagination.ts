export type PageItem = number | "gap-left" | "gap-right"

/**
 * The page buttons to show: always the first and last page, the current page
 * with `siblings` pages either side, and a gap marker where pages are skipped.
 */
export function pageItems(
  current: number,
  total: number,
  siblings = 1
): PageItem[] {
  if (total <= 1) return [1]
  const left = Math.max(current - siblings, 2)
  const right = Math.min(current + siblings, total - 1)
  const items: PageItem[] = [1]
  if (left > 2) items.push("gap-left")
  for (let page = left; page <= right; page++) items.push(page)
  if (right < total - 1) items.push("gap-right")
  items.push(total)
  return items
}
