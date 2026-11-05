import { REPO_URL, SITE_NAME } from "@/constants"
import { OPEN_LIBRARY_URL } from "@/lib/open-library"
import { Github, LibraryBig } from "lucide-react"

const sources = [
  {
    text: "Data dan sampul buku: Open Library",
    href: OPEN_LIBRARY_URL,
  },
  {
    text: "Lisensi data Open Library",
    href: `${OPEN_LIBRARY_URL}/developers/licensing`,
  },
]

export default function Footer() {
  return (
    <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 font-bold sm:justify-start">
              <LibraryBig className="text-primary size-7" />
              <span>{SITE_NAME}</span>
            </div>
            <p className="text-foreground/60 max-w-md leading-relaxed">
              Katalog perpustakaan terbuka dari data publik. Tanpa akun, tanpa
              pelacakan.
            </p>
            <a
              href={REPO_URL}
              className="text-primary inline-flex items-center gap-2 hover:underline"
            >
              <Github className="size-5" />
              <span>Kode sumber</span>
            </a>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-lg font-medium">Sumber data</p>
            <ul className="mt-4 space-y-3 text-sm">
              {sources.map(({ text, href }) => (
                <li key={href}>
                  <a
                    className="text-secondary-foreground/70 hover:underline"
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
