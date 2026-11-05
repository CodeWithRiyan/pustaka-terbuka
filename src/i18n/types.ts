/** Languages the UI is translated into. */
export type Language = "id" | "en"

/** The subjects offered on the landing page and as the books filter. */
export type SubjectId =
  | "indonesia"
  | "education"
  | "fiction"
  | "history"
  | "science"
  | "children"

/**
 * Every user-facing string. Each dictionary must implement all of it, so a
 * missing translation is a type error rather than a blank label at runtime.
 * (Pattern from the simple-geolocation 0.5.0 reference.)
 */
export interface Strings {
  site: {
    /** The site's name (the same in every language). */
    name: string
    description: string
  }
  nav: {
    label: string
    home: string
    books: string
    search: string
    openMenu: string
    closeMenu: string
    theme: string
  }
  language: {
    label: string
  }
  skipToContent: string
  landing: {
    title: string
    subtitle: string
    explore: string
    seeAll: string
  }
  subjects: Record<SubjectId, string>
  books: {
    heading: string
    subject: string
  }
  search: {
    title: string
    placeholder: string
    help: string
    submit: string
    results: (keyword: string) => string
    found: (count: number) => string
  }
  book: {
    back: string
    notFound: string
    notFoundBody: string
    firstPublished: string
    openLibraryId: string
    viewOnOpenLibrary: string
    description: string
  }
  pagination: {
    label: string
    previous: string
    next: string
    page: (page: number) => string
  }
  footer: {
    description: string
    sourceCode: string
    sources: string
    openLibraryData: string
    openLibraryLicence: string
  }
  /** Close button of dialogs. */
  close: string
  loadFailed: string
}
