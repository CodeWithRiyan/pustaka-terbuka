import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import queryString from "query-string"

import {
  OPEN_LIBRARY_URL,
  SearchResponse,
  SubjectResponse,
  WorkResponse,
  fromSearch,
  fromSubject,
  toBookDetail,
} from "@/lib/open-library"
import {
  IBookDetail,
  IBookResponse,
  ISearchParams,
  ISubjectParams,
} from "@/types/book"

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
      transformResponse: (res: SubjectResponse, _meta, { page, limit }) =>
        fromSubject(res, page, limit),
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
      transformResponse: (res: SearchResponse, _meta, { page, limit }) =>
        fromSearch(res, page, limit),
      providesTags: ["Book"],
    }),
    getBook: builder.query<IBookDetail, string>({
      // A work lists author keys only, so names are fetched separately.
      async queryFn(id, _api, _extra, baseQuery) {
        const work = await baseQuery(`/works/${encodeURIComponent(id)}.json`)
        if (work.error) return { error: work.error }
        const w = work.data as WorkResponse

        const authorResults = await Promise.all(
          (w.authors ?? []).map((a) => baseQuery(`${a.author.key}.json`))
        )
        const authors = authorResults
          .map((r) => (r.data as { name?: string } | undefined)?.name)
          .filter((name): name is string => Boolean(name))

        return { data: toBookDetail(w, authors) }
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
