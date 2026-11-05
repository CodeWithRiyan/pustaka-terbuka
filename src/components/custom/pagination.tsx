"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { useI18n } from "@/i18n/context"
import { pageItems } from "@/lib/pagination"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  page: number
  totalPages?: number
  onPageChange: (page: number) => void
}

const buttonClass =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md px-3 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"

/** Previous, numbered pages with gaps, next. Buttons, not links: the page state lives in the component. */
export function Pagination({
  page,
  totalPages = 1,
  onPageChange,
}: PaginationProps) {
  const { t } = useI18n()
  if (totalPages <= 1) return null

  return (
    <nav aria-label={t.pagination.label} className="py-4">
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          <button
            type="button"
            className={buttonClass}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
            <span>{t.pagination.previous}</span>
          </button>
        </li>
        {pageItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                aria-label={t.pagination.page(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  buttonClass,
                  item === page && "bg-primary text-primary-foreground"
                )}
                onClick={() => item !== page && onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} aria-hidden className="px-2">
              …
            </li>
          )
        )}
        <li>
          <button
            type="button"
            className={buttonClass}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <span>{t.pagination.next}</span>
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
