import { readFileSync } from 'node:fs'
import { prepare } from './src/lib/bankEngine.js'
const bank = JSON.parse(readFileSync('./src/data/diagram-bank.json', 'utf8'))
const areasSrc = readFileSync('./src/data/diagram-areas.js', 'utf8')
const areaIds = new Set([...areasSrc.matchAll(/^  (\d+): \[/gm)].map((m) => +m[1]))
const hidden = new Set([12, 15, 71, 201])
const rows = []
for (const s of bank) {
  if (hidden.has(s.id)) continue
  let prep
  try { prep = prepare(s, undefined, false) } catch (e) { rows.push({ id: s.id, err: e.message }); continue }
  const it = prep.items
  const strokes = it.filter((x) => x.k === 's')
  const axis = strokes.some((x) => x.axis)
  const named = strokes.filter((x) => x.base && !x.axis)
  const guides = strokes.filter((x) => x.d)
  const dots = it.filter((x) => x.k === 'd')
  const fills = it.filter((x) => x.k === 'f')
  rows.push({ id: s.id, title: s.title.slice(0, 40), axis, named: named.length, guides: guides.length, dots: dots.length, fills: fills.length, areas: areaIds.has(s.id) })
}
const noAxis = rows.filter((r) => !r.axis)
const noPoint = rows.filter((r) => r.axis && r.named && !r.guides && !r.dots)
const fillNoArea = rows.filter((r) => r.fills && !r.areas)
console.log('total', rows.length, 'noAxis', noAxis.length, 'axis+curves but no point', noPoint.length, 'fills without area defs', fillNoArea.length)
console.log('NOAXIS', noAxis.map((r) => r.id + ':' + r.title).join(' | '))
console.log('NOPOINT', noPoint.map((r) => r.id + ':' + r.title).join(' | '))
console.log('FILLNOAREA', fillNoArea.map((r) => r.id + '(' + r.fills + '):' + r.title).join(' | '))
console.log('ERR', rows.filter((r) => r.err))
