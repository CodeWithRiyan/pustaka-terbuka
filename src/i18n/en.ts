import { Strings } from "./types"

export const en: Strings = {
  site: {
    name: "pustaka-terbuka",
    description:
      "An open library catalog from public data. No account, no tracking.",
  },
  nav: {
    label: "Pages",
    home: "Home",
    books: "Books",
    search: "Search",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    theme: "Switch light or dark theme",
  },
  language: {
    label: "Language",
  },
  skipToContent: "Skip to content",
  landing: {
    title: "An open library catalog",
    subtitle:
      "Look up books from Open Library's public data, with no account and no tracking.",
    explore: "Browse books",
    seeAll: "See all",
  },
  subjects: {
    indonesia: "Indonesia",
    education: "Education",
    fiction: "Fiction",
    history: "History",
    science: "Science",
    children: "Children",
  },
  books: {
    heading: "Book collection",
    subject: "Subject",
  },
  search: {
    title: "Search books",
    placeholder: "e.g. Pramoedya",
    help: "Enter a title, an author's name or an ISBN to search Open Library.",
    submit: "Search",
    results: (keyword) => `Search results: ${keyword}`,
    found: (count) => `${count} ${count === 1 ? "book" : "books"} found`,
  },
  book: {
    back: "Back",
    notFound: "Book not found",
    notFoundBody: "The book you are looking for is not in Open Library.",
    firstPublished: "First published",
    openLibraryId: "Open Library ID",
    viewOnOpenLibrary: "View on Open Library",
    description: "Description",
  },
  pagination: {
    label: "Pages of results",
    previous: "Previous",
    next: "Next",
    page: (page) => `Page ${page}`,
  },
  footer: {
    description:
      "An open library catalog from public data. No account, no tracking.",
    sourceCode: "Source code",
    sources: "Data sources",
    openLibraryData: "Book data and covers: Open Library",
    openLibraryLicence: "Open Library data licensing",
  },
  close: "Close",
  loadFailed: "Could not load data from Open Library.",
}
