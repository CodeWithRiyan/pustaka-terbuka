"use client"

import { useMediaQuery } from "react-responsive"

export default function useBreakpoint() {
  const sm = useMediaQuery({ query: "(min-width: 640px)" })
  const md = useMediaQuery({ query: "(min-width: 768px)" })
  const lg = useMediaQuery({ query: "(min-width: 1024px)" })
  const xl = useMediaQuery({ query: "(min-width: 1280px)" })
  const xxl = useMediaQuery({ query: "(min-width: 2080px)" })

  return { sm, md, lg, xl, xxl }
}
