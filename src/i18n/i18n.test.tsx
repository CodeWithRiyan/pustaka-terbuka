import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useI18n } from "./context"
import { en } from "./en"
import { I18nProvider } from "./I18nProvider"
import { id } from "./id"
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  browserLanguages,
  detectLanguage,
  storage,
} from "./languages"

/** Flatten a dictionary to "path -> kind" so two languages can be compared. */
function shape(obj: object, prefix = ""): Record<string, string> {
  return Object.entries(obj).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key
      if (value && typeof value === "object")
        return { ...acc, ...shape(value, path) }
      acc[path] =
        typeof value === "function"
          ? `function/${(value as () => unknown).length}`
          : typeof value
      return acc
    },
    {}
  )
}

/** Every leaf string (functions called with sample arguments). */
function leaves(obj: object): string[] {
  return Object.values(obj).flatMap((value) => {
    if (typeof value === "function")
      return [String(value("Sample")), String(value(1)), String(value(2))]
    if (value && typeof value === "object") return leaves(value)
    return [String(value)]
  })
}

describe("dictionaries", () => {
  it("supports exactly Indonesian and English", () => {
    expect(SUPPORTED_LANGUAGES).toEqual(["id", "en"])
    expect(LANGUAGES.id.nativeName).toBe("Bahasa Indonesia")
    expect(LANGUAGES.en.nativeName).toBe("English")
  })

  it("Indonesian and English define the same keys with the same arities", () => {
    expect(shape(en)).toEqual(shape(id))
  })

  it("has no empty strings in either language", () => {
    for (const text of [...leaves(id), ...leaves(en)]) {
      expect(text.trim()).not.toBe("")
    }
  })

  it("actually translates (apart from names)", () => {
    const idTexts = leaves(id)
    const enTexts = leaves(en)
    const identical = idTexts.filter((text, i) => text === enTexts[i])
    expect(identical).toEqual([id.site.name, id.subjects.indonesia])
  })

  it("counts books correctly in English", () => {
    expect(en.search.found(1)).toBe("1 book found")
    expect(en.search.found(3)).toBe("3 books found")
  })
})

describe("detectLanguage", () => {
  it("prefers an earlier choice, then the browser, then Indonesian", () => {
    expect(detectLanguage("en", ["id-ID"])).toBe("en")
    expect(detectLanguage("fr", ["en-GB"])).toBe("en")
    expect(detectLanguage(null, ["fr-FR", "ID-id"])).toBe("id")
    expect(detectLanguage(null, [])).toBe(DEFAULT_LANGUAGE)
  })
})

describe("browserLanguages", () => {
  it("reads navigator.languages, or navigator.language when that is empty", () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-GB"])
    expect(browserLanguages()).toEqual(["en-GB"])
    vi.spyOn(navigator, "languages", "get").mockReturnValue([])
    vi.spyOn(navigator, "language", "get").mockReturnValue("id-ID")
    expect(browserLanguages()).toEqual(["id-ID"])
  })
})

describe("storage", () => {
  it("round-trips the choice under a namespaced key", () => {
    storage.write("en")
    expect(STORAGE_KEY).toBe("pustaka-terbuka.language")
    expect(localStorage.getItem(STORAGE_KEY)).toBe("en")
    expect(storage.read()).toBe("en")
  })

  it("never throws when localStorage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError")
    })
    expect(storage.read()).toBeNull()
    expect(() => storage.write("en")).not.toThrow()
  })
})

const Probe = () => {
  const { language, t, setLanguage } = useI18n()
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="label">{t.language.label}</span>
      <button onClick={() => setLanguage(language === "id" ? "en" : "id")}>
        toggle
      </button>
    </div>
  )
}

describe("I18nProvider", () => {
  it("detects the browser language after mount", () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"])
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    )
    expect(screen.getByTestId("language")).toHaveTextContent("en")
  })

  it("restores a saved choice over the browser language", () => {
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"])
    localStorage.setItem(STORAGE_KEY, "id")
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    )
    expect(screen.getByTestId("language")).toHaveTextContent("id")
  })

  it("switching updates strings, persists the choice and sets <html lang>", () => {
    render(
      <I18nProvider initialLanguage="id">
        <Probe />
      </I18nProvider>
    )
    expect(document.documentElement.lang).toBe("id")

    act(() => screen.getByRole("button", { name: "toggle" }).click())

    expect(screen.getByTestId("label")).toHaveTextContent("Language")
    expect(localStorage.getItem(STORAGE_KEY)).toBe("en")
    expect(document.documentElement.lang).toBe("en")
  })

  it("without a provider, falls back to Indonesian and ignores changes", () => {
    render(<Probe />)
    act(() => screen.getByRole("button", { name: "toggle" }).click())
    expect(screen.getByTestId("language")).toHaveTextContent("id")
  })
})
