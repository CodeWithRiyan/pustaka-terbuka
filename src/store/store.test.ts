import { describe, expect, it } from "vitest"

import { stubFetch } from "@/test/render"

import { makeStore } from "."
import { bookApi } from "./book/api"
import { setSearchModal } from "./modal/action"
import { modalReducer } from "./modal/reducer"

describe("bookApi", () => {
  it("asks Open Library for a subject page with the right offset", async () => {
    const fetchMock = stubFetch({
      "/subjects/fiction.json": { work_count: 40, works: [] },
    })
    const store = makeStore()

    const result = await store.dispatch(
      bookApi.endpoints.getBooksBySubject.initiate({
        subject: "fiction",
        page: 2,
        limit: 20,
      })
    )

    const url = String((fetchMock.mock.calls[0][0] as Request).url)
    expect(url).toContain("/subjects/fiction.json?limit=20&offset=20")
    expect(result.data?.pagination.totalPages).toBe(2)
  })

  it("searches with only the fields the site reads", async () => {
    const fetchMock = stubFetch({
      "/search.json": { numFound: 0, docs: [] },
    })
    const store = makeStore()

    await store.dispatch(
      bookApi.endpoints.searchBooks.initiate({
        keyword: "bumi manusia",
        page: 1,
        limit: 20,
      })
    )

    const url = String((fetchMock.mock.calls[0][0] as Request).url)
    expect(url).toContain("q=bumi%20manusia")
    expect(url).toContain(
      "fields=key%2Ctitle%2Cauthor_name%2Ccover_i%2Cfirst_publish_year"
    )
  })

  it("loads a work and its authors' names, skipping authors that fail", async () => {
    stubFetch({
      "/works/OL45804W.json": {
        key: "/works/OL45804W",
        title: "Fantastic Mr Fox",
        authors: [
          { author: { key: "/authors/OL34184A" } },
          { author: { key: "/authors/OLmissingA" } },
        ],
      },
      "/authors/OL34184A.json": { name: "Roald Dahl" },
    })
    const store = makeStore()

    const result = await store.dispatch(
      bookApi.endpoints.getBook.initiate("OL45804W")
    )

    expect(result.data).toMatchObject({
      id: "OL45804W",
      title: "Fantastic Mr Fox",
      authors: ["Roald Dahl"],
    })
  })

  it("reports a work that does not exist as an error", async () => {
    stubFetch({})
    const store = makeStore()

    const result = await store.dispatch(
      bookApi.endpoints.getBook.initiate("OLnopeW")
    )

    expect(result.isError).toBe(true)
  })

  it("loads a work without authors", async () => {
    stubFetch({ "/works/OL1W.json": { key: "/works/OL1W", title: "A" } })
    const store = makeStore()

    const result = await store.dispatch(
      bookApi.endpoints.getBook.initiate("OL1W")
    )

    expect(result.data?.authors).toEqual([])
  })
})

describe("modal state", () => {
  it("opens and closes the search dialog, ignoring other actions", () => {
    const opened = modalReducer(
      undefined,
      setSearchModal({ isOpenSearch: true })
    )
    expect(opened.isOpenSearch).toBe(true)
    expect(modalReducer(opened, { type: "OTHER", payload: {} })).toBe(opened)
  })
})
