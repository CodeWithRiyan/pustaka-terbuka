import { DetailBook } from "@/components/pages/book"
import { Suspense } from "react"

export const metadata = { title: "Detail buku - pustaka-terbuka" }

// The book id is read from ?id= on the client, so the page works as a
// static export without generating one page per book.
export default function DetailBookPage() {
  return (
    <Suspense>
      <DetailBook />
    </Suspense>
  )
}
