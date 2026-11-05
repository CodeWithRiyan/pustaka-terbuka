import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Fragment, ReactNode } from "react"

export default function Menu({
  open,
  onOpenChange,
  menus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  menus: {
    label?: string
    items?: {
      label: string
      onClick?: () => void
      asChild?: ReactNode
    }[]
  }[]
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuContent>
        {menus.map((menu) => (
          <Fragment key={menu.label}>
            {menu.label && (
              <>
                <DropdownMenuLabel>menu.label</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {menu.items?.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={item.onClick}
                asChild={!!item.asChild}
              >
                {item.asChild ? item.asChild : item.label}
              </DropdownMenuItem>
            ))}
          </Fragment>
        ))}
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
