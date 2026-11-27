/*
  Draws the app icons (public/icons/*.png) from the Memoraa prompt-and-cursor mark, the same glyph as
  public/favicon.svg. Square, because nothing in Memoraa is rounded; the OS applies its own mask.

    icon-192.png, icon-512.png   purpose "any": the mark at about 60% of the width
    icon-maskable-512.png        purpose "maskable": the mark inside the central 40% "safe zone", so a circle
                                 or squircle mask never clips it
    apple-touch-icon.png (180)   iOS home screen

  Needs `rsvg-convert` (brew install librsvg). Run:  node scripts/generate-pwa-icons.mjs
*/
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const GLYPH = `<path fill="#ffffff" d="M70 -49V-185L346 -306Q366 -315 388.0 -321.0Q410 -327 423 -329Q410 -331 388.0 -336.5Q366 -342 346 -351L70 -472V-609L530 -401V-258Z"/><rect fill="#ffffff" x="710.0" y="-700.0" width="460.0" height="700.0"/>`
const svg = (size, glyphShare) => {
  const w = size * glyphShare
  const h = (w * 820) / 1220
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#0a0a0a"/><svg x="${(size - w) / 2}" y="${(size - h) / 2}" width="${w}" height="${h}" viewBox="10 -760 1220 820">${GLYPH}</svg></svg>`
}
const out = [
  ['public/icons/icon-192.png', 192, 0.6],
  ['public/icons/icon-512.png', 512, 0.6],
  ['public/icons/icon-maskable-512.png', 512, 0.4],
  ['public/apple-touch-icon.png', 180, 0.6],
]
const dir = join(tmpdir(), 'memoraa-icons')
mkdirSync(dir, { recursive: true })
for (const [file, size, share] of out) {
  const src = join(dir, `${size}-${share}.svg`)
  writeFileSync(src, svg(size, share))
  execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size), src, '-o', file])
  console.log('wrote', file)
}
rmSync(dir, { recursive: true, force: true })
