"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/i18n/context"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSearchModal } from "@/store/modal/action"

import Modal from "./modal"

export default function SearchModal() {
  const dispatch = useAppDispatch()
  const { isOpenSearch } = useAppSelector((state) => state.modal)
  const router = useRouter()
  const { t } = useI18n()
  const [keyword, setKeyword] = useState("")

  const close = () => {
    dispatch(setSearchModal({ isOpenSearch: false }))
    setKeyword("")
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = keyword.trim()
    if (!trimmed) return
    close()
    router.push(`/search?keyword=${encodeURIComponent(trimmed)}`)
  }

  return (
    <Modal
      open={Boolean(isOpenSearch)}
      title={t.search.title}
      description={t.search.help}
      centered
      onClose={close}
      className="w-full sm:max-w-full md:max-w-3xl"
    >
      <form onSubmit={onSubmit} className="flex gap-2" role="search">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={t.search.placeholder}
          aria-label={t.search.title}
          className="h-10 w-full"
          autoFocus
        />
        <Button type="submit" variant="secondary" size="lg">
          <SearchIcon aria-hidden />
          <span className="sr-only">{t.search.submit}</span>
        </Button>
      </form>
    </Modal>
  )
}
