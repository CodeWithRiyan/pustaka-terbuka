import { IPageMeta } from "@/types/pagination"

export const OPEN_LIBRARY_URL = "https://openlibrary.org"

/**
 * Cover URL by CoverID. Open Library rate-limits covers looked up by ISBN,
 * OCLC or LCCN, but not by CoverID, so only CoverID is used here.
 */
export function coverUrl(coverId: number | null, size: "S" | "M" | "L" = "M") {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null
}

/** "/works/OL45804W" -> "OL45804W" */
export function workId(key: string) {
  return key.replace(/^\/works\//, "")
}

export function pageMeta(total: number, page: number, limit: number): IPageMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

/** Subjects offered on the landing page and as the books filter. */
export const SUBJECTS = [
  { value: "indonesia", label: "Indonesia" },
  { value: "education", label: "Pendidikan" },
  { value: "fiction", label: "Fiksi" },
  { value: "history", label: "Sejarah" },
  { value: "science", label: "Sains" },
  { value: "children", label: "Anak-anak" },
] as const
