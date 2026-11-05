import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSearchModal } from "@/store/modal/action"
import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "../ui/form"
import { Input } from "../ui/input"
import Modal from "./modal"

const FormSchema = z.object({
  search: z.string().optional(),
})

export default function SearchModal() {
  const dispatch = useAppDispatch()
  const { isOpenSearch } = useAppSelector((state) => state.modal)
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const keyword = data.search?.trim()
    if (!keyword) return

    dispatch(setSearchModal({ isOpenSearch: false }))
    form.reset()
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`)
  }

  return (
    <Modal
      open={isOpenSearch}
      title="Cari Buku"
      centered
      onCancel={() => {
        dispatch(setSearchModal({ isOpenSearch: false }))
        form.reset()
      }}
      footer={<></>}
      className="w-full sm:max-w-full md:max-w-3xl"
    >
      <div className="flex flex-col items-center gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormControl>
                  <FormItem className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        placeholder="e.g: Pramoedya"
                        className="h-10 w-full"
                      />
                      <Button type="submit" variant="secondary" size="lg">
                        <SearchIcon />
                      </Button>
                    </div>
                    <FormDescription>
                      Masukkan judul, nama penulis, atau ISBN untuk mencari buku
                      di Open Library.
                    </FormDescription>
                  </FormItem>
                </FormControl>
              )}
            />
          </form>
        </Form>
      </div>
    </Modal>
  )
}
