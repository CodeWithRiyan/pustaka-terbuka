"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { CardPortraitBook } from "@/components/custom"
import Pagination from "@/components/custom/pagination"
import { CardPortraitSkeleton } from "@/components/skeletons"
import { INIT_PAGE_META } from "@/constants"
import { useI18n } from "@/i18n/context"
import { useSearchBooksQuery } from "@/store/book/api"

export default function Search() {
  const { t } = useI18n()
  const keyword = useSearchParams().get("keyword")?.trim() ?? ""
  const [page, setPage] = useState<number>(INIT_PAGE_META.page)

  const { data, isFetching, isError } = useSearchBooksQuery(
    { keyword, page, limit: INIT_PAGE_META.limit },
    { skip: !keyword }
  )

  return (
    <div className="bg-background min-h-screen w-full space-y-4 overflow-hidden pt-32 pb-10">
      <div className="min-h-full w-full space-y-2 px-6 md:px-40">
        <h1 className="text-xl font-bold">{t.search.results(keyword)}</h1>
        {data && (
          <p className="text-muted-foreground text-sm" role="status">
            {t.search.found(data.pagination.totalItems)}
          </p>
        )}
        {isError && (
          <p className="text-muted-foreground text-sm">{t.loadFailed}</p>
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
        <Pagination
          key={keyword}
          page={page}
          totalPages={data?.pagination.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
