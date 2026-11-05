"use client"

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"

import { I18nContext, I18nContextValue } from "./context"
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  browserLanguages,
  detectLanguage,
  storage,
} from "./languages"
import { Language } from "./types"

export interface I18nProviderProps {
  children: ReactNode
  /** Force a language (tests); otherwise detected and persisted. */
  initialLanguage?: Language
}

/**
 * Owns the current UI language. The site is a static export, so the HTML is
 * rendered once in the default language; after mount the language is
 * detected (earlier choice, then browser), persisted on change, and kept in
 * sync with <html lang>.
 */
export const I18nProvider = ({
  children,
  initialLanguage,
}: I18nProviderProps) => {
  const [language, setLanguageState] = useState<Language>(
    initialLanguage ?? DEFAULT_LANGUAGE
  )

  useEffect(() => {
    if (initialLanguage) return
    // Runs once after mount: the static HTML can't know the visitor's choice.
    setLanguageState(detectLanguage(storage.read(), browserLanguages()))
  }, [initialLanguage])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    storage.write(next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<I18nContextValue>(
    () => ({ language, t: LANGUAGES[language].strings, setLanguage }),
    [language, setLanguage]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export default I18nProvider
