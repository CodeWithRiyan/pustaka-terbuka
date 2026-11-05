"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

interface Tab {
  id: string
  label: string
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, tabs, activeTab, onTabChange, ...props }, ref) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [hoverStyle, setHoverStyle] = useState({})
    const [activeStyle, setActiveStyle] = useState({
      left: "0px",
      width: "0px",
    })
    const tabRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
      setActiveIndex(tabs.findIndex((tab) => tab.id === activeTab))
    }, [activeTab, tabs])

    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex]
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
      }
    }, [hoveredIndex])

    const activeElement = tabRefs.current[activeIndex]

    useEffect(() => {
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }, [activeElement])

    useEffect(() => {
      requestAnimationFrame(() => {
        const firstElement = tabRefs.current[0]
        if (firstElement) {
          const { offsetLeft, offsetWidth } = firstElement
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          })
        }
      })
    }, [])

    // Enhanced: Watch for resize changes
    useEffect(() => {
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          const currentActiveElement = tabRefs.current[activeIndex]
          if (currentActiveElement) {
            const { offsetLeft, offsetWidth } = currentActiveElement
            setActiveStyle({
              left: `${offsetLeft}px`,
              width: `${offsetWidth}px`,
            })
          }
        })
      })

      // Observe all tab elements for size changes
      tabRefs.current.forEach((tabElement) => {
        if (tabElement) {
          resizeObserver.observe(tabElement)
        }
      })

      return () => {
        resizeObserver.disconnect()
      }
    }, [activeIndex, tabs])

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="bg-secondary absolute flex h-[30px] items-center rounded-[6px] transition-all duration-300 ease-out"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div
            className="bg-accent absolute bottom-[-6px] h-[3px] rounded-full transition-all duration-300 ease-out dark:bg-white"
            style={activeStyle}
          />

          {/* Tabs */}
          <div className="relative flex items-center justify-evenly space-x-[6px]">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                  return void 0
                }}
                className={cn(
                  "h-[30px] w-full cursor-pointer rounded-[6px] px-3 py-2 transition-colors duration-300",
                  index === activeIndex &&
                    "bg-secondary text-secondary-foreground"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setActiveIndex(index)
                  onTabChange?.(tab.id)
                }}
              >
                <div className="flex h-full items-center justify-center text-sm leading-5 font-medium whitespace-nowrap">
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)
Tabs.displayName = "Tabs"

export { Tabs }
