import Search from "@/components/pages/search"
import { Suspense } from "react"

export const metadata = { title: "Pencarian - pustaka-terbuka" }

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  )
}
