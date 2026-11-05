"use client"

import { useI18n } from "@/i18n/context"
import { LANGUAGES, SUPPORTED_LANGUAGES, isLanguage } from "@/i18n/languages"

/**
 * Language picker. A native <select> for the best keyboard, screen reader
 * and mobile behaviour; each option is named in its own language.
 */
export function LanguageSelect() {
  const { language, setLanguage, t } = useI18n()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t.language.label}</span>
      <select
        aria-label={t.language.label}
        value={language}
        onChange={(event) => {
          if (isLanguage(event.target.value)) setLanguage(event.target.value)
        }}
        className="bg-background h-9 rounded-md border px-2"
      >
        {SUPPORTED_LANGUAGES.map((code) => (
          <option key={code} value={code} lang={code}>
            {LANGUAGES[code].nativeName}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguageSelect
