// Serves the static export in out/ under the GitHub Pages base path, the way
// Pages does: <dir>/ serves <dir>/index.html, anything else unknown is 404.
import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const ROOT = join(process.cwd(), "out")
const BASE = process.env.BASE_PATH ?? "/pustaka-terbuka"
const PORT = Number(process.env.PORT ?? 4173)
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
}

function resolveFile(urlPath) {
  if (!urlPath.startsWith(BASE)) return null
  const rel = normalize(decodeURIComponent(urlPath.slice(BASE.length) || "/"))
  if (rel.includes("..")) return null
  const candidates = rel.endsWith("/")
    ? [join(ROOT, rel, "index.html")]
    : [
        join(ROOT, rel),
        join(ROOT, rel, "index.html"),
        join(ROOT, `${rel}.html`),
      ]
  return candidates.find((f) => existsSync(f) && statSync(f).isFile()) ?? null
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://localhost")
  const file = resolveFile(pathname)
  if (!file) {
    res.writeHead(404, { "Content-Type": TYPES[".html"] })
    const notFound = join(ROOT, "404.html")
    return existsSync(notFound)
      ? createReadStream(notFound).pipe(res)
      : res.end("Not found")
  }
  res.writeHead(200, {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () =>
  console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`)
)
