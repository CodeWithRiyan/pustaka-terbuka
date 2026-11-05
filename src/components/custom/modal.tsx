import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai"

type TIcon = "default" | "success" | "info" | "warning" | "error"
type TVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | null

export interface ModalProps {
  open?: boolean
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  okText?: string | ReactNode
  cancelText?: string | ReactNode
  okVariant?: TVariant
  cancelVariant?: TVariant
  title?: string | ReactNode
  icon?: TIcon
  description?: string | ReactNode
  children?: ReactNode
  footer?: ReactNode
  showClose?: boolean
  loading?: boolean
  className?: string
  centered?: boolean
}

export default function Modal({
  open,
  title,
  icon = "default",
  description,
  children,
  footer,
  onOk,
  onCancel,
  okText = "Ok",
  cancelText = "Batal",
  okVariant = "default",
  cancelVariant = "secondary",
  showClose = true,
  loading,
  className,
  centered,
}: ModalProps) {
  function ModalIcon() {
    if (icon === "success") {
      return <AiOutlineCheckCircle className="text-2xl text-green-500" />
    } else if (icon === "info") {
      return <AiOutlineInfoCircle className="text-2xl text-blue-500" />
    } else if (icon === "warning") {
      return <AiOutlineExclamationCircle className="text-2xl text-yellow-500" />
    } else if (icon === "error") {
      return <AiOutlineCloseCircle className="text-2xl text-red-500" />
    }
    return ""
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className={cn("sm:max-w-[425px]", className)}
        onClickOutside={onCancel || onOk}
        onClickClose={onCancel || onOk}
        showClose={showClose}
        centered={centered}
      >
        <DialogHeader className={cn(!title && "hidden")}>
          <DialogTitle className="inline-flex items-center gap-2">
            <ModalIcon />
            <span className="line-clamp-2 inline-flex w-full">{title}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          {footer ? (
            footer
          ) : (
            <>
              {onCancel && (
                <Button variant={cancelVariant} onClick={onCancel}>
                  {cancelText}
                </Button>
              )}
              {onOk && (
                <Button
                  variant={okVariant}
                  onClick={onOk}
                  loading={loading}
                  disabled={loading}
                >
                  {okText}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
