"use client"

import SmartImage from "@/components/custom/smart-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OPEN_LIBRARY_URL, coverUrl } from "@/lib/open-library"
import { useGetBookQuery } from "@/store/book/api"
import { ExternalLink } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { ScaleLoader } from "react-spinners"

export function DetailBook() {
  const id = useSearchParams().get("id") ?? ""
  const { data: book, isFetching, isError } = useGetBookQuery(id, {
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
        <h1 className="text-2xl font-bold">Buku tidak ditemukan</h1>
        <p className="text-muted-foreground mt-4">
          Buku yang kamu cari tidak ada di Open Library.
        </p>
      </div>
    )
  }

  const openLibraryUrl = `${OPEN_LIBRARY_URL}/works/${book.id}`

  return (
    <div className="min-h-full w-full space-y-8 px-6 pt-32 pb-10 md:px-40">
      <Button href="/books" size="sm">
        Kembali
      </Button>
      <div className="flex w-full flex-col-reverse gap-6 lg:flex-row lg:items-center">
        <div className="w-full space-y-4">
          <div>
            <h5 className="text-primary font-bold">
              {book.authors.join(", ") || "-"}
            </h5>
            <h1 className="line-clamp-2 text-3xl font-bold">{book.title}</h1>
          </div>
          <ul>
            <li>
              <span className="inline-flex min-w-32">Terbit pertama</span>
              <span>{`: ${book.firstPublishYear ?? "-"}`}</span>
            </li>
            <li>
              <span className="inline-flex min-w-32">ID Open Library</span>
              <span>{`: ${book.id}`}</span>
            </li>
          </ul>
          {book.subjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.subjects.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          )}
          <Button href={openLibraryUrl} target="_blank" rel="noreferrer">
            <ExternalLink />
            <span>Lihat di Open Library</span>
          </Button>
        </div>
        <SmartImage
          src={coverUrl(book.coverId, "L")}
          alt={book.title}
          containerClassName="md:w-60"
        />
      </div>
      {book.description && (
        <div>
          <h4 className="text-lg font-bold">Deskripsi</h4>
          <p className="whitespace-pre-line">{book.description}</p>
        </div>
      )}
    </div>
  )
}
