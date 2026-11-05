"use client"

import { CardPortraitBook } from "@/components/custom"
import BasicPagination from "@/components/mvpblocks/basic-pagination"
import { CardPortraitSkeleton } from "@/components/skeletons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INIT_PAGE_META } from "@/constants"
import { SUBJECTS } from "@/lib/open-library"
import { useGetBooksBySubjectQuery } from "@/store/book/api"
import { FilterIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Books() {
  const searchParams = useSearchParams()
  const initialSubject =
    SUBJECTS.find((s) => s.value === searchParams.get("subject"))?.value ??
    SUBJECTS[0].value

  const [subject, setSubject] = useState<string>(initialSubject)
  const [page, setPage] = useState<number>(INIT_PAGE_META.page)

  const { data, isFetching, isError } = useGetBooksBySubjectQuery({
    subject,
    page,
    limit: INIT_PAGE_META.limit,
  })

  return (
    <div className="bg-background min-h-screen w-full space-y-4 pt-32 pb-10">
      <div className="min-h-full w-full space-y-8 px-6 md:px-40">
        <div className="relative space-y-2">
          <div className="flex justify-between gap-4">
            <h2 className="text-2xl font-bold">Koleksi buku</h2>
            <Select
              value={subject}
              onValueChange={(v) => {
                setSubject(v)
                setPage(1)
              }}
            >
              <SelectTrigger icon={<FilterIcon className="size-4 opacity-50" />}>
                <SelectValue placeholder="Subjek" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            key={subject}
            totalPages={data?.pagination.totalPages}
            initialPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
