"use client"

import { Github, LibraryBig } from "lucide-react"

import { REPO_URL } from "@/constants"
import { useI18n } from "@/i18n/context"
import { OPEN_LIBRARY_URL } from "@/lib/open-library"

export default function Footer() {
  const { t } = useI18n()
  const sources = [
    { text: t.footer.openLibraryData, href: OPEN_LIBRARY_URL },
    {
      text: t.footer.openLibraryLicence,
      href: `${OPEN_LIBRARY_URL}/developers/licensing`,
    },
  ]

  return (
    <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 font-bold sm:justify-start">
              <LibraryBig className="text-primary size-7" aria-hidden />
              <span>{t.site.name}</span>
            </div>
            <p className="text-foreground/70 max-w-md leading-relaxed">
              {t.footer.description}
            </p>
            <a
              href={REPO_URL}
              className="text-primary inline-flex items-center gap-2 hover:underline"
            >
              <Github className="size-5" aria-hidden />
              <span>{t.footer.sourceCode}</span>
            </a>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-lg font-medium">{t.footer.sources}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {sources.map(({ text, href }) => (
                <li key={href}>
                  <a
                    className="text-secondary-foreground/80 hover:underline"
                    href={href}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
