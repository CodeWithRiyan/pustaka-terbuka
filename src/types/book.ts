import { IPageMeta } from "./pagination"

/** A book (an Open Library "work"), normalised for the UI. */
export interface IBook {
  /** Open Library work id, e.g. "OL45804W". */
  id: string
  title: string
  authors: string[]
  /** Open Library CoverID, used to build the cover URL. */
  coverId: number | null
  firstPublishYear: number | null
}

export interface IBookDetail extends IBook {
  description: string | null
  subjects: string[]
}

export interface IBookResponse {
  books: IBook[]
  pagination: IPageMeta
}

export interface ISubjectParams {
  subject: string
  page: number
  limit: number
}

export interface ISearchParams {
  keyword: string
  page: number
  limit: number
}
