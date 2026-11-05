import { OPEN_LIBRARY_URL, pageMeta, workId } from "@/lib/open-library"
import {
  IBook,
  IBookDetail,
  IBookResponse,
  ISearchParams,
  ISubjectParams,
} from "@/types/book"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import queryString from "query-string"

interface SubjectWork {
  key: string
  title: string
  cover_id?: number | null
  first_publish_year?: number | null
  authors?: { name: string }[]
}

interface SubjectResponse {
  work_count: number
  works: SubjectWork[]
}

interface SearchDoc {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
}

interface SearchResponse {
  numFound: number
  docs: SearchDoc[]
}

interface WorkResponse {
  key: string
  title: string
  description?: string | { value: string }
  subjects?: string[]
  covers?: number[]
  first_publish_date?: string
  authors?: { author: { key: string } }[]
}

const SEARCH_FIELDS = "key,title,author_name,cover_i,first_publish_year"

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({ baseUrl: OPEN_LIBRARY_URL }),
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooksBySubject: builder.query<IBookResponse, ISubjectParams>({
      query: ({ subject, page, limit }) =>
        `/subjects/${encodeURIComponent(subject)}.json?${queryString.stringify({
          limit,
          offset: (page - 1) * limit,
        })}`,
      transformResponse: (res: SubjectResponse, _meta, { page, limit }) => ({
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
      }),
      providesTags: ["Book"],
    }),
    searchBooks: builder.query<IBookResponse, ISearchParams>({
      query: ({ keyword, page, limit }) =>
        `/search.json?${queryString.stringify({
          q: keyword,
          page,
          limit,
          fields: SEARCH_FIELDS,
        })}`,
      transformResponse: (res: SearchResponse, _meta, { page, limit }) => ({
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
      }),
      providesTags: ["Book"],
    }),
    getBook: builder.query<IBookDetail, string>({
      // A work lists author keys only, so names are fetched separately.
      async queryFn(id, _api, _extra, baseQuery) {
        const work = await baseQuery(`/works/${encodeURIComponent(id)}.json`)
        if (work.error) return { error: work.error }
        const w = work.data as WorkResponse

        const authorKeys = w.authors?.map((a) => a.author.key) ?? []
        const authorResults = await Promise.all(
          authorKeys.map((key) => baseQuery(`${key}.json`))
        )
        const authors = authorResults
          .map((r) => (r.data as { name?: string } | undefined)?.name)
          .filter((name): name is string => Boolean(name))

        const description =
          typeof w.description === "string"
            ? w.description
            : (w.description?.value ?? null)
        const year = w.first_publish_date?.match(/\d{4}/)?.[0]

        return {
          data: {
            id: workId(w.key),
            title: w.title,
            authors,
            coverId: w.covers?.find((c) => c > 0) ?? null,
            firstPublishYear: year ? Number(year) : null,
            description,
            subjects: w.subjects?.slice(0, 12) ?? [],
          },
        }
      },
      providesTags: ["Book"],
    }),
  }),
})

export const {
  useGetBooksBySubjectQuery,
  useSearchBooksQuery,
  useGetBookQuery,
} = bookApi
