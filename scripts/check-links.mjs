/* global console, process */
// 静的書き出し結果(out/)の内部リンクと sitemap の URL がすべて実在するか検証する。
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const out = "out"
const origin = "https://vrn.reload.co.jp"

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return htmlFiles(path)
    return entry.name.endsWith(".html") ? [path] : []
  })

const exists = (href) => {
  const path = decodeURIComponent(href.split(/[?#]/)[0])
  if (path.endsWith("/")) return existsSync(join(out, path, "index.html"))
  return existsSync(join(out, path)) || existsSync(join(out, `${path}.html`))
}

const broken = []
for (const file of htmlFiles(out)) {
  for (const [, href] of readFileSync(file, "utf8").matchAll(
    /href="(\/[^"/][^"]*|\/)"/g
  )) {
    if (href.startsWith("/_next/")) continue
    if (!exists(href)) broken.push(`${file}: ${href}`)
  }
}
for (const [, url] of readFileSync(join(out, "sitemap.xml"), "utf8").matchAll(
  /<loc>([^<]+)<\/loc>/g
)) {
  if (!exists(url.replace(origin, ""))) broken.push(`sitemap.xml: ${url}`)
}

if (broken.length > 0) {
  console.error(
    `Broken internal links (${broken.length}):\n${broken.join("\n")}`
  )
  process.exit(1)
}
console.log("Internal links OK")
