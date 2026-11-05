import { vi } from "vitest"

/** State behind the next/navigation mock; tests set the query string and read pushes. */
export const navigation = {
  search: new URLSearchParams(),
  push: vi.fn(),
}

/** Use as: vi.mock("next/navigation", () => navigationMock()) */
export const navigationMock = () => ({
  useRouter: () => ({ push: navigation.push }),
  useSearchParams: () => navigation.search,
  usePathname: () => "/",
})
