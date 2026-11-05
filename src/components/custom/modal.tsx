import { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/utils"

export interface ModalProps {
  open: boolean
  title: ReactNode
  description?: ReactNode
  onClose: () => void
  children?: ReactNode
  className?: string
  centered?: boolean
}

/** A dialog with a title and a translated close button. */
export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className,
  centered,
}: ModalProps) {
  const { t } = useI18n()

  return (
    <Dialog open={open}>
      <DialogContent
        className={cn("sm:max-w-[425px]", className)}
        onClickOutside={onClose}
        onClickClose={onClose}
        onEscapeKeyDown={onClose}
        closeLabel={t.close}
        centered={centered}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
