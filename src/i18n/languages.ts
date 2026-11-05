import { en } from "./en"
import { id } from "./id"
import { Language, Strings } from "./types"

export interface LanguageDefinition {
  /** Name of the language in that language (what the picker shows). */
  nativeName: string
  strings: Strings
}

export const LANGUAGES: Record<Language, LanguageDefinition> = {
  id: { nativeName: "Bahasa Indonesia", strings: id },
  en: { nativeName: "English", strings: en },
}

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as Language[]

/** Used when neither an earlier choice nor the browser decides. */
export const DEFAULT_LANGUAGE: Language = "id"

export const STORAGE_KEY = "pustaka-terbuka.language"

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" && SUPPORTED_LANGUAGES.includes(value as Language)

/**
 * Pick the initial language: an explicit earlier choice wins, then the first
 * browser language we support (by primary subtag, so "en-GB" -> "en"), then
 * the default.
 */
export function detectLanguage(
  stored: string | null,
  browserLanguages: readonly string[]
): Language {
  if (isLanguage(stored)) return stored
  for (const tag of browserLanguages) {
    const primary = tag.toLowerCase().split("-")[0]
    if (isLanguage(primary)) return primary
  }
  return DEFAULT_LANGUAGE
}

/** localStorage can throw (privacy modes, disabled storage): never let it break the app. */
export const storage = {
  read(): string | null {
    try {
      return window.localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  },
  write(language: Language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // The choice just won't survive a reload.
    }
  },
}

export const browserLanguages = (): readonly string[] =>
  navigator.languages?.length ? navigator.languages : [navigator.language]
