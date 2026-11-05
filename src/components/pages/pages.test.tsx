import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { navigation } from "@/test/navigation"
import { renderWithProviders, stubFetch } from "@/test/render"

import { DetailBook } from "./book"
import Books from "./book/books"
import Landing from "./landing"
import Search from "./search"

vi.mock("next/navigation", async () =>
  (await import("@/test/navigation")).navigationMock()
)

const work = (id: number, title: string) => ({
  key: `/works/OL${id}W`,
  title,
  cover_id: id,
  first_publish_year: 2000,
  authors: [{ name: `Author ${id}` }],
})

beforeEach(() => {
  navigation.search = new URLSearchParams()
})

describe("Landing", () => {
  it("shows a row per subject with its books, and says when a row fails", async () => {
    stubFetch({
      "/subjects/indonesia.json": {
        work_count: 1,
        works: [work(1, "Laskar Pelangi")],
      },
      "/subjects/fiction.json": { status: 500, body: {} },
      "/subjects/": { work_count: 0, works: [] },
    })
    renderWithProviders(<Landing />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Katalog perpustakaan terbuka",
      })
    ).toBeVisible()
    const indonesia = screen.getByRole("region", { name: "Indonesia" })
    expect(await within(indonesia).findByText("Laskar Pelangi")).toBeVisible()
    expect(
      within(indonesia).getByRole("link", { name: "Lihat semua" })
    ).toHaveAttribute("href", "/books?subject=indonesia")
    const fiction = screen.getByRole("region", { name: "Fiksi" })
    expect(
      await within(fiction).findByText("Gagal memuat data dari Open Library.")
    ).toBeVisible()
  })
})

describe("Books", () => {
  it("starts on the subject from the URL and switches subject and page", async () => {
    navigation.search = new URLSearchParams("subject=history")
    const fetchMock = stubFetch({
      "/subjects/history.json": {
        work_count: 45,
        works: [work(2, "Sejarah Indonesia")],
      },
      "/subjects/science.json": { work_count: 1, works: [work(3, "Kosmos")] },
    })
    const user = userEvent.setup()
    renderWithProviders(<Books />)

    expect(await screen.findByText("Sejarah Indonesia")).toBeVisible()
    const select = screen.getByRole("combobox", { name: "Subjek" })
    expect(select).toHaveValue("history")

    await user.click(screen.getByRole("button", { name: "Halaman 2" }))
    const urls = () => fetchMock.mock.calls.map((c) => (c[0] as Request).url)
    expect(
      urls().some((u) => u.includes("history.json?limit=20&offset=20"))
    ).toBe(true)

    await user.selectOptions(select, "science")
    expect(await screen.findByText("Kosmos")).toBeVisible()
  })

  it("falls back to the first subject and reports a failure", async () => {
    navigation.search = new URLSearchParams("subject=cooking")
    stubFetch({ "/subjects/indonesia.json": { status: 500, body: {} } })
    renderWithProviders(<Books />)

    expect(screen.getByRole("combobox", { name: "Subjek" })).toHaveValue(
      "indonesia"
    )
    expect(
      await screen.findByText("Gagal memuat data dari Open Library.")
    ).toBeVisible()
  })
})

describe("Search", () => {
  it("shows the results and how many were found", async () => {
    navigation.search = new URLSearchParams("keyword=pramoedya")
    stubFetch({
      "/search.json": {
        numFound: 1,
        docs: [
          {
            key: "/works/OL307247W",
            title: "Bumi Manusia",
            author_name: ["Pramoedya Ananta Toer"],
          },
        ],
      },
    })
    renderWithProviders(<Search />, { language: "en" })

    expect(
      screen.getByRole("heading", { name: "Search results: pramoedya" })
    ).toBeVisible()
    expect(await screen.findByRole("status")).toHaveTextContent("1 book found")
    expect(screen.getByText("Bumi Manusia")).toBeVisible()
  })

  it("does not search without a keyword, and reports a failure", async () => {
    const fetchMock = stubFetch({})
    const { unmount } = renderWithProviders(<Search />)
    expect(fetchMock).not.toHaveBeenCalled()
    unmount()

    navigation.search = new URLSearchParams("keyword=x")
    stubFetch({ "/search.json": { status: 503, body: {} } })
    renderWithProviders(<Search />)
    expect(
      await screen.findByText("Gagal memuat data dari Open Library.")
    ).toBeVisible()
  })
})

describe("DetailBook", () => {
  it("shows the book, its subjects, description and a link to Open Library", async () => {
    navigation.search = new URLSearchParams("id=OL45804W")
    stubFetch({
      "/works/OL45804W.json": {
        key: "/works/OL45804W",
        title: "Fantastic Mr Fox",
        description: "A fox outwits three farmers.",
        subjects: ["Foxes"],
        covers: [6498519],
        first_publish_date: "1970",
        authors: [{ author: { key: "/authors/OL34184A" } }],
      },
      "/authors/OL34184A.json": { name: "Roald Dahl" },
    })
    renderWithProviders(<DetailBook />, { language: "en" })

    expect(
      await screen.findByRole("heading", { level: 1, name: "Fantastic Mr Fox" })
    ).toBeVisible()
    expect(screen.getByText("Roald Dahl")).toBeVisible()
    expect(screen.getByText("1970")).toBeVisible()
    expect(screen.getByText("Foxes")).toBeVisible()
    expect(screen.getByText("A fox outwits three farmers.")).toBeVisible()
    expect(
      screen.getByRole("link", { name: "View on Open Library" })
    ).toHaveAttribute("href", "https://openlibrary.org/works/OL45804W")
    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      "/books"
    )
  })

  it("shows a bare book without authors, year, subjects or description", async () => {
    navigation.search = new URLSearchParams("id=OL1W")
    stubFetch({ "/works/OL1W.json": { key: "/works/OL1W", title: "Bare" } })
    renderWithProviders(<DetailBook />)

    expect(
      await screen.findByRole("heading", { level: 1, name: "Bare" })
    ).toBeVisible()
    expect(
      screen.queryByRole("heading", { name: "Deskripsi" })
    ).not.toBeInTheDocument()
    expect(screen.getAllByText("-")).toHaveLength(2)
  })

  it("says the book was not found, with or without an id", async () => {
    navigation.search = new URLSearchParams("id=OLnopeW")
    stubFetch({})
    const { unmount } = renderWithProviders(<DetailBook />)
    expect(
      await screen.findByRole("heading", { name: "Buku tidak ditemukan" })
    ).toBeVisible()
    unmount()

    navigation.search = new URLSearchParams()
    renderWithProviders(<DetailBook />)
    expect(
      screen.getByRole("heading", { name: "Buku tidak ditemukan" })
    ).toBeVisible()
  })
})
