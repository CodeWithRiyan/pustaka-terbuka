import Books from "@/components/pages/book/books"
import { Suspense } from "react"

export const metadata = { title: "Koleksi buku - pustaka-terbuka" }

export default function BooksPage() {
  return (
    <Suspense>
      <Books />
    </Suspense>
  )
}
