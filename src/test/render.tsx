import { render } from "@testing-library/react"
import { ReactNode } from "react"
import { Provider } from "react-redux"
import { vi } from "vitest"

import { I18nProvider } from "@/i18n/I18nProvider"
import { Language } from "@/i18n/types"
import { makeStore } from "@/store"

/** Render inside a fresh store and a fixed language (Indonesian unless given). */
export function renderWithProviders(
  ui: ReactNode,
  { language = "id" as Language, store = makeStore() } = {}
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <I18nProvider initialLanguage={language}>{ui}</I18nProvider>
      </Provider>
    ),
  }
}

/** Answer fetch by URL substring with JSON bodies (status 200 unless given). */
export function stubFetch(
  routes: Record<string, unknown | { status: number; body: unknown }>
) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url =
      typeof input === "string"
        ? input
        : "url" in input
          ? input.url
          : input.toString()
    for (const [part, answer] of Object.entries(routes)) {
      if (url.includes(part)) {
        const { status, body } =
          answer && typeof answer === "object" && "status" in answer
            ? (answer as { status: number; body: unknown })
            : { status: 200, body: answer }
        return new Response(JSON.stringify(body), {
          status,
          headers: { "Content-Type": "application/json" },
        })
      }
    }
    return new Response("not found", { status: 404 })
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}
