"use client"

import { CardPortraitBook } from "@/components/custom"
import { CardPortraitSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { SUBJECTS } from "@/lib/open-library"
import { motionProps } from "@/lib/reveal"
import { useGetBooksBySubjectQuery } from "@/store/book/api"
import { motion } from "framer-motion"

function SubjectRow({ subject, label }: { subject: string; label: string }) {
  const { data, isFetching, isError } = useGetBooksBySubjectQuery({
    subject,
    page: 1,
    limit: 12,
  })

  return (
    <div className="min-h-full w-full space-y-8 px-6 md:px-40">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">{label}</h4>
          <Button href={`/books?subject=${subject}`} size="sm" variant="ghost">
            Lihat semua
          </Button>
        </div>
        <div className="flex gap-1 overflow-auto">
          {isFetching &&
            Array.from({ length: 6 }).map((_, i) => (
              <CardPortraitSkeleton key={i} />
            ))}
          {isError && (
            <p className="text-muted-foreground text-sm">
              Gagal memuat data dari Open Library.
            </p>
          )}
          {!isFetching &&
            data?.books.map((book) => (
              <CardPortraitBook key={book.id} book={book} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="bg-background min-h-screen w-full space-y-8 overflow-hidden pb-16">
      <motion.section
        id="hero"
        {...motionProps({ reveal: "bottom", duration: 1 })}
        className="flex flex-col items-center justify-center gap-4 px-6 pt-40 pb-12 text-center"
      >
        <h1 className="text-3xl font-bold text-balance md:text-5xl">
          Katalog perpustakaan terbuka
        </h1>
        <p className="text-muted-foreground max-w-2xl text-balance">
          Cari buku dari data publik Open Library, tanpa akun dan tanpa
          pelacakan.
        </p>
        <Button href="/books" size="lg">
          Jelajahi buku
        </Button>
      </motion.section>
      {SUBJECTS.map((s) => (
        <SubjectRow key={s.value} subject={s.value} label={s.label} />
      ))}
    </div>
  )
}
