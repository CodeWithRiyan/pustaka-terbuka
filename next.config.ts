import type { NextConfig } from "next"

// GitHub Pages serves a project site under /<repo>; the deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/pustaka-terbuka. Locally it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
