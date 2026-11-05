import { coverUrl } from "@/lib/open-library"
import { IBook } from "@/types/book"
import Link from "next/link"
import { CardPortraitSkeleton } from "../skeletons"
import SmartImage from "./smart-image"

export interface CardPortraitBookProps {
  book: IBook
  isLoading?: boolean
}

export function CardPortraitBook({ book, isLoading }: CardPortraitBookProps) {
  if (isLoading) {
    return <CardPortraitSkeleton />
  }

  return (
    <Link
      className="group hover:bg-accent/20 w-44 space-y-2 rounded-sm p-2 text-start hover:cursor-pointer"
      href={`/book?id=${encodeURIComponent(book.id)}`}
    >
      <SmartImage src={coverUrl(book.coverId)} alt={book.title} />
      <div>
        {book.authors.length > 0 && (
          <h6 className="text-foreground group-hover:text-primary truncate text-xs">
            {book.authors.join(", ")}
          </h6>
        )}
        <h5 className="line-clamp-2 text-sm font-bold">{book.title}</h5>
        {book.firstPublishYear && (
          <p className="text-muted-foreground text-xs">
            {book.firstPublishYear}
          </p>
        )}
      </div>
    </Link>
  )
}

export default CardPortraitBook
