"use client"

import { ExternalLink } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { ScaleLoader } from "react-spinners"

import SmartImage from "@/components/custom/smart-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/context"
import { OPEN_LIBRARY_URL, coverUrl } from "@/lib/open-library"
import { useGetBookQuery } from "@/store/book/api"

export function DetailBook() {
  const { t } = useI18n()
  const id = useSearchParams().get("id") ?? ""
  const {
    data: book,
    isFetching,
    isError,
  } = useGetBookQuery(id, {
    skip: !id,
  })

  if (isFetching) {
    return (
      <div className="text-primary flex min-h-screen items-center justify-center">
        <ScaleLoader color="currentColor" />
      </div>
    )
  }

  if (!id || isError || !book) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl font-bold">{t.book.notFound}</h1>
        <p className="text-muted-foreground mt-4">{t.book.notFoundBody}</p>
      </div>
    )
  }

  return (
    <div className="min-h-full w-full space-y-8 px-6 pt-32 pb-10 md:px-40">
      <Button href="/books" size="sm">
        {t.book.back}
      </Button>
      <div className="flex w-full flex-col-reverse gap-6 lg:flex-row lg:items-center">
        <div className="w-full space-y-4">
          <div>
            <p className="text-primary font-bold">
              {book.authors.join(", ") || "-"}
            </p>
            <h1 className="line-clamp-2 text-3xl font-bold">{book.title}</h1>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4">
            <dt>{t.book.firstPublished}</dt>
            <dd>{book.firstPublishYear ?? "-"}</dd>
            <dt>{t.book.openLibraryId}</dt>
            <dd>{book.id}</dd>
          </dl>
          {book.subjects.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {book.subjects.map((s) => (
                <li key={s}>
                  <Badge variant="secondary">{s}</Badge>
                </li>
              ))}
            </ul>
          )}
          <Button
            href={`${OPEN_LIBRARY_URL}/works/${book.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden />
            <span>{t.book.viewOnOpenLibrary}</span>
          </Button>
        </div>
        <SmartImage
          src={coverUrl(book.coverId, "L")}
          alt={book.title}
          containerClassName="md:w-60"
        />
      </div>
      {book.description && (
        <section>
          <h2 className="text-lg font-bold">{t.book.description}</h2>
          <p className="whitespace-pre-line">{book.description}</p>
        </section>
      )}
    </div>
  )
}
