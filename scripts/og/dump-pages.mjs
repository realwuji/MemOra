// Prints the page metadata (title, h1, description, crumbs) from src/lib/seo.js
// as JSON, so the Python generator (generate.py) draws each share image from the
// same copy the site uses and can never drift from it.
import { PAGES } from '../../src/lib/seo.js'

const out = {}
for (const [path, meta] of Object.entries(PAGES)) {
  out[path] = {
    title: meta.title,
    h1: meta.h1 ?? null,
    description: meta.description,
    crumbs: meta.crumbs ?? [],
  }
}
process.stdout.write(JSON.stringify(out))
