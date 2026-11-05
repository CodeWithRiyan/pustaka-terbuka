import { act, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { STORAGE_KEY } from "@/i18n/languages"
import { setSearchModal } from "@/store/modal/action"
import { navigation } from "@/test/navigation"
import { renderWithProviders, stubFetch } from "@/test/render"
import { IBook } from "@/types/book"

import CardPortraitBook from "./custom/card-portrait-book"
import LanguageSelect from "./custom/language-select"
import Pagination from "./custom/pagination"
import SearchModal from "./custom/search-modal"
import { CONTENT_ID, SkipLink } from "./custom/skip-link"
import Footer from "./mvpblocks/footer-4col"
import Header from "./mvpblocks/header"
import Providers from "./providers"

vi.mock("next/navigation", async () =>
  (await import("@/test/navigation")).navigationMock()
)

const BOOK: IBook = {
  id: "OL307247W",
  title: "Bumi Manusia",
  authors: ["Pramoedya Ananta Toer"],
  coverId: 6643692,
  firstPublishYear: 1972,
}

beforeEach(() => {
  navigation.search = new URLSearchParams()
  navigation.push.mockClear()
})

describe("CardPortraitBook", () => {
  it("links to the book with its cover, authors and year", () => {
    renderWithProviders(<CardPortraitBook book={BOOK} />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/book?id=OL307247W")
    expect(link).toHaveTextContent("Pramoedya Ananta Toer")
    expect(link).toHaveTextContent("1972")
    expect(within(link).getByRole("img")).toHaveAttribute("alt", "Bumi Manusia")
  })

  it("leaves out missing authors and year, and shows a skeleton while loading", () => {
    const { rerender } = renderWithProviders(
      <CardPortraitBook
        book={{ ...BOOK, authors: [], firstPublishYear: null, coverId: null }}
      />
    )
    expect(screen.getByRole("link")).toHaveTextContent(/^Bumi Manusia$/)
    rerender(<CardPortraitBook book={BOOK} isLoading />)
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})

describe("Pagination", () => {
  it("renders nothing for a single page", () => {
    const { container } = renderWithProviders(
      <Pagination page={1} totalPages={1} onPageChange={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("moves between pages and disables the ends", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    renderWithProviders(
      <Pagination page={1} totalPages={3} onPageChange={onPageChange} />,
      { language: "en" }
    )
    const nav = screen.getByRole("navigation", { name: "Pages of results" })
    expect(within(nav).getByRole("button", { name: "Previous" })).toBeDisabled()
    expect(within(nav).getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page"
    )

    await user.click(within(nav).getByRole("button", { name: "Page 1" }))
    expect(onPageChange).not.toHaveBeenCalled()
    await user.click(within(nav).getByRole("button", { name: "Page 3" }))
    await user.click(within(nav).getByRole("button", { name: "Next" }))
    expect(onPageChange.mock.calls).toEqual([[3], [2]])
  })

  it("goes back from the last page", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    renderWithProviders(
      <Pagination page={10} totalPages={10} onPageChange={onPageChange} />,
      { language: "en" }
    )
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
    await user.click(screen.getByRole("button", { name: "Previous" }))
    expect(onPageChange).toHaveBeenCalledWith(9)
  })
})

describe("LanguageSelect", () => {
  it("offers both languages named in their own language and remembers the choice", async () => {
    const user = userEvent.setup()
    renderWithProviders(<LanguageSelect />)
    const select = screen.getByRole("combobox", { name: "Bahasa" })
    expect(
      within(select)
        .getAllByRole("option")
        .map((o) => o.textContent)
    ).toEqual(["Bahasa Indonesia", "English"])

    await user.selectOptions(select, "en")

    expect(screen.getByRole("combobox", { name: "Language" })).toHaveValue("en")
    expect(localStorage.getItem(STORAGE_KEY)).toBe("en")
  })
})

describe("SkipLink", () => {
  it("moves focus to the content", async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <SkipLink />
        <main id={CONTENT_ID} tabIndex={-1}>
          content
        </main>
      </>
    )
    await user.click(screen.getByRole("link", { name: "Lompat ke konten" }))
    expect(screen.getByRole("main")).toHaveFocus()
  })
})

describe("SearchModal", () => {
  it("searches the trimmed keyword and closes; ignores an empty one", async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<SearchModal />)
    act(() => {
      store.dispatch(setSearchModal({ isOpenSearch: true }))
    })
    const dialog = await screen.findByRole("dialog", { name: "Cari buku" })

    await user.click(within(dialog).getByRole("button", { name: "Cari" }))
    expect(navigation.push).not.toHaveBeenCalled()

    await user.type(
      within(dialog).getByRole("textbox", { name: "Cari buku" }),
      "  bumi manusia "
    )
    await user.click(within(dialog).getByRole("button", { name: "Cari" }))

    expect(navigation.push).toHaveBeenCalledWith(
      "/search?keyword=bumi%20manusia"
    )
    expect(store.getState().modal.isOpenSearch).toBe(false)
  })

  it("closes with the translated close button", async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<SearchModal />, { language: "en" })
    act(() => {
      store.dispatch(setSearchModal({ isOpenSearch: true }))
    })
    await user.click(await screen.findByRole("button", { name: "Close" }))
    expect(store.getState().modal.isOpenSearch).toBe(false)
  })
})

describe("Header", () => {
  it("links the pages, opens search and labels the theme button", async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<Header />, { language: "en" })
    const nav = screen.getAllByRole("navigation", { name: "Pages" })[0]
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(within(nav).getByRole("link", { name: "Books" })).toHaveAttribute(
      "href",
      "/books"
    )
    expect(
      screen.getByRole("button", { name: "Switch light or dark theme" })
    ).toBeInTheDocument()

    await user.click(within(nav).getByRole("button", { name: "Search" }))
    expect(store.getState().modal.isOpenSearch).toBe(true)
  })

  it("opens the mobile menu, which can search and close", async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<Header />)
    await user.click(screen.getByRole("button", { name: "Buka menu" }))
    expect(screen.getByRole("button", { name: "Tutup menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    const menus = screen.getAllByRole("navigation", { name: "Halaman" })
    const mobile = menus[menus.length - 1]

    await user.click(within(mobile).getByRole("button", { name: "Cari" }))
    expect(store.getState().modal.isOpenSearch).toBe(true)
    await waitFor(() =>
      expect(
        screen.getAllByRole("navigation", { name: "Halaman" })
      ).toHaveLength(1)
    )

    await user.click(screen.getByRole("button", { name: "Buka menu" }))
    await user.click(
      within(
        screen.getAllByRole("navigation", { name: "Halaman" }).at(-1)!
      ).getByRole("link", { name: "Buku" })
    )
    await waitFor(() =>
      expect(
        screen.getAllByRole("navigation", { name: "Halaman" })
      ).toHaveLength(1)
    )
  })

  it("gets a shadow once the page scrolls", () => {
    renderWithProviders(<Header />)
    const header = screen.getByRole("banner")
    expect(header.className).not.toContain("shadow-2xl")
    act(() => {
      Object.defineProperty(window, "scrollY", {
        value: 120,
        configurable: true,
      })
      window.dispatchEvent(new Event("scroll"))
    })
    expect(header.className).toContain("shadow-2xl")
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true })
  })
})

describe("Footer", () => {
  it("credits Open Library and links the source code", () => {
    renderWithProviders(<Footer />, { language: "en" })
    expect(
      screen.getByRole("link", { name: "Book data and covers: Open Library" })
    ).toHaveAttribute("href", "https://openlibrary.org")
    expect(screen.getByRole("link", { name: "Source code" })).toHaveAttribute(
      "href",
      "https://github.com/CodeWithRiyan/pustaka-terbuka"
    )
  })
})

describe("Providers", () => {
  it("wraps a page in the skip link, header, main content and footer", () => {
    stubFetch({})
    // next-themes reads the system theme; jsdom has no matchMedia.
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
      }))
    )
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["id-ID"])
    renderWithProviders(
      <Providers>
        <p>page</p>
      </Providers>
    )
    expect(screen.getByRole("main")).toHaveTextContent("page")
    expect(
      screen.getAllByRole("link", { name: "Lompat ke konten" })
    ).not.toHaveLength(0)
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})

describe("SmartImage", () => {
  it("fades the image in on load and shows a placeholder icon on error", async () => {
    const { default: SmartImage } = await import("./custom/smart-image")
    const onLoad = vi.fn()
    const onError = vi.fn()
    const { container } = renderWithProviders(
      <SmartImage
        src="https://covers.example/1.jpg"
        alt="Cover"
        onLoad={onLoad}
        onError={onError}
      />
    )
    const img = screen.getByRole("img", { name: "Cover" })
    expect(img.className).toContain("opacity-0")

    act(() => {
      img.dispatchEvent(new Event("load"))
    })
    // next/image settles the load asynchronously (after img.decode()).
    await waitFor(() => expect(img.className).toContain("opacity-100"))
    expect(onLoad).toHaveBeenCalled()

    act(() => {
      img.dispatchEvent(new Event("error"))
    })
    expect(onError).toHaveBeenCalled()
    expect(screen.queryByRole("img", { name: "Cover" })).not.toBeInTheDocument()
    expect(container.querySelector("svg")).not.toBeNull()
  })

  it("shows the placeholder icon when there is no cover", async () => {
    const { default: SmartImage } = await import("./custom/smart-image")
    const { container } = renderWithProviders(<SmartImage src={null} alt="" />)
    expect(container.querySelector("img")).toBeNull()
    expect(container.querySelector("svg")).not.toBeNull()
  })
})
