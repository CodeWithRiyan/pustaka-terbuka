"use client"

import { SITE_NAME } from "@/constants"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/hooks"
import { setSearchModal } from "@/store/modal/action"
import { AnimatePresence, motion } from "framer-motion"
import { LibraryBig, Menu, Search, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import ThemeToggleButton from "../ui/theme-toggle-button"

const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Buku", href: "/books" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openSearch = () => dispatch(setSearchModal({ isOpenSearch: true }))

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-background px-0 py-0 shadow-2xl"
          : "bg-transparent px-2 py-4 shadow-none"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <LibraryBig className="text-primary size-7" />
              <span>{SITE_NAME}</span>
            </Link>
            <ThemeToggleButton variant="circle-blur" start="top-left" />
          </div>

          <nav className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-accent font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" size="icon_md" onClick={openSearch}>
              <Search className="size-5" />
              <span className="sr-only">Cari</span>
            </Button>
          </nav>

          <motion.button
            className="hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mb-4 overflow-hidden lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="border-border bg-background/95 mt-4 space-y-2 rounded-xl border py-4 shadow-xl backdrop-blur-lg">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:bg-muted block px-4 py-3 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-4 py-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      openSearch()
                    }}
                  >
                    <Search className="size-5" />
                    <span>Cari</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
