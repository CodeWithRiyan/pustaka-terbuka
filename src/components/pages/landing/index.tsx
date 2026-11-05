"use client"

import { CardPortraitBook } from "@/components/custom"
import { CardPortraitSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/context"
import { SubjectId } from "@/i18n/types"
import { SUBJECTS } from "@/lib/open-library"
import { useGetBooksBySubjectQuery } from "@/store/book/api"

function SubjectRow({ subject }: { subject: SubjectId }) {
  const { t } = useI18n()
  const { data, isFetching, isError } = useGetBooksBySubjectQuery({
    subject,
    page: 1,
    limit: 12,
  })

  return (
    <section
      aria-labelledby={`subject-${subject}`}
      className="min-h-full w-full space-y-2 px-6 md:px-40"
    >
      <div className="flex items-center justify-between">
        <h2 id={`subject-${subject}`} className="text-lg font-bold">
          {t.subjects[subject]}
        </h2>
        <Button href={`/books?subject=${subject}`} size="sm" variant="ghost">
          {t.landing.seeAll}
        </Button>
      </div>
      <div className="flex gap-1 overflow-auto">
        {isFetching &&
          Array.from({ length: 6 }).map((_, i) => (
            <CardPortraitSkeleton key={i} />
          ))}
        {isError && (
          <p className="text-muted-foreground text-sm">{t.loadFailed}</p>
        )}
        {!isFetching &&
          data?.books.map((book) => (
            <CardPortraitBook key={book.id} book={book} />
          ))}
      </div>
    </section>
  )
}

export default function Landing() {
  const { t } = useI18n()

  return (
    <div className="bg-background min-h-screen w-full space-y-8 overflow-hidden pb-16">
      <section className="flex flex-col items-center justify-center gap-4 px-6 pt-40 pb-12 text-center">
        <h1 className="text-3xl font-bold text-balance md:text-5xl">
          {t.landing.title}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-balance">
          {t.landing.subtitle}
        </p>
        <Button href="/books" size="lg">
          {t.landing.explore}
        </Button>
      </section>
      {SUBJECTS.map((subject) => (
        <SubjectRow key={subject} subject={subject} />
      ))}
    </div>
  )
}
