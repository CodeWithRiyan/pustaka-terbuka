"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { CardPortraitBook } from "@/components/custom"
import Pagination from "@/components/custom/pagination"
import { CardPortraitSkeleton } from "@/components/skeletons"
import { INIT_PAGE_META } from "@/constants"
import { useI18n } from "@/i18n/context"
import { SubjectId } from "@/i18n/types"
import { SUBJECTS, isSubject } from "@/lib/open-library"
import { useGetBooksBySubjectQuery } from "@/store/book/api"

export default function Books() {
  const { t } = useI18n()
  const requested = useSearchParams().get("subject")
  const [subject, setSubject] = useState<SubjectId>(
    isSubject(requested) ? requested : SUBJECTS[0]
  )
  const [page, setPage] = useState<number>(INIT_PAGE_META.page)

  const { data, isFetching, isError } = useGetBooksBySubjectQuery({
    subject,
    page,
    limit: INIT_PAGE_META.limit,
  })

  return (
    <div className="bg-background min-h-screen w-full space-y-4 pt-32 pb-10">
      <div className="min-h-full w-full space-y-4 px-6 md:px-40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t.books.heading}</h1>
          <label className="flex items-center gap-2 text-sm">
            <span>{t.books.subject}</span>
            <select
              value={subject}
              onChange={(event) => {
                if (isSubject(event.target.value)) {
                  setSubject(event.target.value)
                  setPage(1)
                }
              }}
              className="bg-background h-9 rounded-md border px-2"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {t.subjects[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
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
          page={page}
          totalPages={data?.pagination.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
