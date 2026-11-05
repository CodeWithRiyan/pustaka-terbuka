import { SubjectId } from "@/i18n/types"
import { IBook, IBookDetail } from "@/types/book"
import { IPageMeta } from "@/types/pagination"

export const OPEN_LIBRARY_URL = "https://openlibrary.org"

/**
 * Cover URL by CoverID. Open Library rate-limits covers looked up by ISBN,
 * OCLC or LCCN, but not by CoverID, so only CoverID is used here.
 */
export function coverUrl(coverId: number | null, size: "S" | "M" | "L" = "M") {
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
    : null
}

/** "/works/OL45804W" -> "OL45804W" */
export function workId(key: string) {
  return key.replace(/^\/works\//, "")
}

export function pageMeta(
  total: number,
  page: number,
  limit: number
): IPageMeta {
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

/** Subjects offered on the landing page and as the books filter; labels live in the dictionaries. */
export const SUBJECTS: readonly SubjectId[] = [
  "indonesia",
  "education",
  "fiction",
  "history",
  "science",
  "children",
]

export const isSubject = (value: unknown): value is SubjectId =>
  SUBJECTS.includes(value as SubjectId)

/* Open Library's response shapes, as far as this site reads them. */

export interface SubjectResponse {
  work_count: number
  works: {
    key: string
    title: string
    cover_id?: number | null
    first_publish_year?: number | null
    authors?: { name: string }[]
  }[]
}

export interface SearchResponse {
  numFound: number
  docs: {
    key: string
    title: string
    author_name?: string[]
    cover_i?: number
    first_publish_year?: number
  }[]
}

export interface WorkResponse {
  key: string
  title: string
  description?: string | { value: string }
  subjects?: string[]
  covers?: number[]
  first_publish_date?: string
  authors?: { author: { key: string } }[]
}

export const fromSubject = (
  res: SubjectResponse,
  page: number,
  limit: number
) => ({
  books: res.works.map(
    (w): IBook => ({
      id: workId(w.key),
      title: w.title,
      authors: w.authors?.map((a) => a.name) ?? [],
      coverId: w.cover_id ?? null,
      firstPublishYear: w.first_publish_year ?? null,
    })
  ),
  pagination: pageMeta(res.work_count, page, limit),
})

export const fromSearch = (
  res: SearchResponse,
  page: number,
  limit: number
) => ({
  books: res.docs.map(
    (d): IBook => ({
      id: workId(d.key),
      title: d.title,
      authors: d.author_name ?? [],
      coverId: d.cover_i ?? null,
      firstPublishYear: d.first_publish_year ?? null,
    })
  ),
  pagination: pageMeta(res.numFound, page, limit),
})

/** A work plus the names of its authors (fetched separately) as one book. */
export function toBookDetail(w: WorkResponse, authors: string[]): IBookDetail {
  const description =
    typeof w.description === "string"
      ? w.description
      : (w.description?.value ?? null)
  const year = w.first_publish_date?.match(/\d{4}/)?.[0]
  return {
    id: workId(w.key),
    title: w.title,
    authors,
    // Open Library marks a missing cover with -1.
    coverId: w.covers?.find((c) => c > 0) ?? null,
    firstPublishYear: year ? Number(year) : null,
    description,
    subjects: w.subjects?.slice(0, 12) ?? [],
  }
}
