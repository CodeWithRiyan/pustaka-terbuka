"use client"

import { CardPortraitBook } from "@/components/custom"
import BasicPagination from "@/components/mvpblocks/basic-pagination"
import { CardPortraitSkeleton } from "@/components/skeletons"
import { INIT_PAGE_META } from "@/constants"
import { useSearchBooksQuery } from "@/store/book/api"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Search() {
  const keyword = useSearchParams().get("keyword")?.trim() ?? ""
  const [page, setPage] = useState<number>(INIT_PAGE_META.page)

  const { data, isFetching, isError } = useSearchBooksQuery(
    { keyword, page, limit: INIT_PAGE_META.limit },
    { skip: !keyword }
  )

  return (
    <div className="bg-background min-h-screen w-full space-y-4 overflow-hidden pt-32 pb-10">
      <div className="min-h-full w-full space-y-8 px-6 md:px-40">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Hasil pencarian - {keyword}</h3>
          {data && (
            <p className="text-muted-foreground text-sm">
              {data.pagination.totalItems} buku ditemukan
            </p>
          )}
          {isError && (
            <p className="text-muted-foreground text-sm">
              Gagal memuat data dari Open Library.
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {isFetching &&
              Array.from({ length: 10 }).map((_, i) => (
                <CardPortraitSkeleton key={i} />
              ))}
            {!isFetching &&
              data?.books.map((book) => (
                <CardPortraitBook key={book.id} book={book} />
              ))}
          </div>
          <BasicPagination
            key={keyword}
            totalPages={data?.pagination.totalPages}
            initialPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
