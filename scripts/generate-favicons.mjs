// Raster exports from the editable key SVG. Uses Next's existing Sharp dependency.
import { readFile, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const sharp = createRequire(require.resolve("next/package.json"))("sharp")
const directory = path.join(root, "public/favicon")
const icon = await readFile(path.join(directory, "favicon.svg"))
const appIcon = Buffer.from(icon.toString().replace('rx="12" ', "").replace('id="chaves-mark"', 'id="chaves-mark" transform="translate(6.4 6.4) scale(.8)"'))
const png = (source, size) => sharp(source, { density: 384 }).resize(size, size).png().toBuffer()

for (const size of [16, 32, 48, 96]) {
  await writeFile(path.join(directory, `favicon-${size}x${size}.png`), await png(icon, size))
}
for (const [name, size] of [["apple-touch-icon.png", 180], ["web-app-manifest-192x192.png", 192], ["web-app-manifest-512x512.png", 512]]) {
  await writeFile(path.join(directory, name), await png(appIcon, size))
}

// ICO directory followed by PNG payloads, preserving 16/32/48px fallbacks.
const sizes = [16, 32, 48]
const images = await Promise.all(sizes.map(size => png(icon, size)))
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16
  header[entry] = size
  header[entry + 1] = size
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(images[index].length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += images[index].length
}
await writeFile(path.join(directory, "favicon.ico"), Buffer.concat([header, ...images]))
await sharp(path.join(root, "public/identity/chaves-key.svg"), { density: 384 }).resize(1024).png().toFile(path.join(root, "public/identity/chaves-key.png"))
console.log("Generated key favicon, PNG, Apple, app, and reusable identity assets.")
