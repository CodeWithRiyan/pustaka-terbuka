// Adds jest-dom matchers (toBeInTheDocument, toHaveTextContent, ...) to Vitest's expect.
import "@testing-library/jest-dom/vitest"
import { cleanup, configure } from "@testing-library/react"
import { afterEach, vi } from "vitest"

configure({ asyncUtilTimeout: 5_000 })

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
