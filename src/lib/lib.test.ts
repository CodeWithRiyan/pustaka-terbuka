import { describe, expect, it } from "vitest"

import {
  coverUrl,
  fromSearch,
  fromSubject,
  isSubject,
  pageMeta,
  toBookDetail,
  workId,
} from "./open-library"
import { pageItems } from "./pagination"

describe("open-library helpers", () => {
  it("builds cover URLs from a CoverID only", () => {
    expect(coverUrl(240727)).toBe(
      "https://covers.openlibrary.org/b/id/240727-M.jpg"
    )
    expect(coverUrl(240727, "L")).toContain("240727-L.jpg")
    expect(coverUrl(null)).toBeNull()
  })

  it("strips the /works/ prefix", () => {
    expect(workId("/works/OL45804W")).toBe("OL45804W")
  })

  it("computes page metadata, never fewer than one page", () => {
    expect(pageMeta(45, 2, 20)).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalItems: 45,
      itemsPerPage: 20,
      hasNextPage: true,
      hasPrevPage: true,
    })
    expect(pageMeta(0, 1, 20).totalPages).toBe(1)
  })

  it("knows the offered subjects", () => {
    expect(isSubject("fiction")).toBe(true)
    expect(isSubject("cooking")).toBe(false)
    expect(isSubject(null)).toBe(false)
  })
})

describe("Open Library responses", () => {
  it("maps a subject listing, filling gaps with empty values", () => {
    const result = fromSubject(
      {
        work_count: 3019,
        works: [
          {
            key: "/works/OL38684W",
            title: "Lord Jim",
            cover_id: 8236295,
            first_publish_year: 1900,
            authors: [{ name: "Joseph Conrad" }],
          },
          { key: "/works/OL1W", title: "Untitled" },
        ],
      },
      1,
      12
    )
    expect(result.books).toEqual([
      {
        id: "OL38684W",
        title: "Lord Jim",
        authors: ["Joseph Conrad"],
        coverId: 8236295,
        firstPublishYear: 1900,
      },
      {
        id: "OL1W",
        title: "Untitled",
        authors: [],
        coverId: null,
        firstPublishYear: null,
      },
    ])
    expect(result.pagination.totalPages).toBe(252)
  })

  it("maps search results", () => {
    const result = fromSearch(
      {
        numFound: 247,
        docs: [
          {
            key: "/works/OL307247W",
            title: "Bumi Manusia",
            author_name: ["Pramoedya Ananta Toer"],
            cover_i: 6643692,
            first_publish_year: 1972,
          },
          { key: "/works/OL2W", title: "No details" },
        ],
      },
      2,
      20
    )
    expect(result.books[0]).toEqual({
      id: "OL307247W",
      title: "Bumi Manusia",
      authors: ["Pramoedya Ananta Toer"],
      coverId: 6643692,
      firstPublishYear: 1972,
    })
    expect(result.books[1]).toMatchObject({ authors: [], coverId: null })
    expect(result.pagination).toMatchObject({ currentPage: 2, totalPages: 13 })
  })

  it("maps a work with a plain description and a missing first cover", () => {
    const book = toBookDetail(
      {
        key: "/works/OL45804W",
        title: "Fantastic Mr Fox",
        description: "A fox outwits three farmers.",
        subjects: Array.from({ length: 15 }, (_, i) => `s${i}`),
        covers: [-1, 6498519],
        first_publish_date: "October 1, 1970",
      },
      ["Roald Dahl"]
    )
    expect(book).toEqual({
      id: "OL45804W",
      title: "Fantastic Mr Fox",
      authors: ["Roald Dahl"],
      coverId: 6498519,
      firstPublishYear: 1970,
      description: "A fox outwits three farmers.",
      subjects: Array.from({ length: 12 }, (_, i) => `s${i}`),
    })
  })

  it("maps a work whose description is an object, or missing everything", () => {
    expect(
      toBookDetail(
        { key: "/works/OL1W", title: "A", description: { value: "Text" } },
        []
      ).description
    ).toBe("Text")
    expect(toBookDetail({ key: "/works/OL2W", title: "B" }, [])).toEqual({
      id: "OL2W",
      title: "B",
      authors: [],
      coverId: null,
      firstPublishYear: null,
      description: null,
      subjects: [],
    })
  })
})

describe("pageItems", () => {
  it("shows a single page as just that page", () => {
    expect(pageItems(1, 1)).toEqual([1])
  })

  it("shows every page when there are few", () => {
    expect(pageItems(2, 4)).toEqual([1, 2, 3, 4])
  })

  it("puts gaps on the side that skips pages", () => {
    expect(pageItems(1, 10)).toEqual([1, 2, "gap-right", 10])
    expect(pageItems(10, 10)).toEqual([1, "gap-left", 9, 10])
    expect(pageItems(5, 10)).toEqual([1, "gap-left", 4, 5, 6, "gap-right", 10])
  })
})
