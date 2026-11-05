"use client"

import { useI18n } from "@/i18n/context"

export const CONTENT_ID = "content"

/**
 * "Skip to content": the first thing Tab reaches. Visually hidden until it
 * has focus, so keyboard users can jump past the header straight to the page.
 */
export function SkipLink() {
  const { t } = useI18n()

  return (
    <a
      href={`#${CONTENT_ID}`}
      onClick={(event) => {
        event.preventDefault()
        document.getElementById(CONTENT_ID)?.focus()
      }}
      className="bg-background fixed top-2 left-2 z-50 -translate-y-[200%] rounded-md px-4 py-2 shadow focus-visible:translate-y-0"
    >
      {t.skipToContent}
    </a>
  )
}

export default SkipLink
