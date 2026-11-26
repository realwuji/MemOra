import { readFileSync, writeFileSync } from 'node:fs'
const bank = JSON.parse(readFileSync('./src/data/diagram-bank.json', 'utf8'))
const { COPY } = await import('./src/data/diagram-copy.js')
const areasSrc = readFileSync('./src/data/diagram-areas.js', 'utf8')
const areaIds = new Set([...areasSrc.matchAll(/^  (\d+): \[/gm)].map((m) => +m[1]))
const out = []
for (const s of bank) {
  const fills = s.items.map((x, i) => ({ x, i })).filter(({ x }) => x.k === 'f')
  if (!fills.length || areaIds.has(s.id) || [12, 15, 71, 201].includes(s.id)) continue
  const texts = s.items.filter((x) => x.k === 't').map((t) => ({ text: t.para.map((p) => p.r.map((r) => r.t).join('')).join(' '), at: [Math.round(t.x + t.w / 2), Math.round(t.y + t.h / 2)] }))
  out.push({
    id: s.id,
    title: COPY[s.id]?.title || s.title,
    caption: COPY[s.id]?.caption || '',
    fills: fills.map(({ x, i }) => ({ index: i, colour: x.c || 'none', opacity: x.o ?? null, polygon: x.p.map(([a, b]) => [Math.round(a), Math.round(b)]) })),
    texts,
  })
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1))
console.log(out.length)
