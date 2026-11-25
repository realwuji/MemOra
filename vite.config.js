import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { execFile } from 'node:child_process'

// Keeps src/constants/pack-manifest.js (every subject's outline and counts,
// generated from the content) in step with the content while the dev server
// runs. `npm run dev` and `npm run build` regenerate it when they start; this
// covers an edit made in between, so a new chapter or extra cards show up in
// the picker and the counts without a restart. The generator only rewrites the
// file when it changed, so this cannot loop on its own output.
function packManifest() {
  return {
    name: 'pack-manifest',
    apply: 'serve',
    configureServer(server) {
      let timer
      server.watcher.on('change', (file) => {
        const f = file.split(path.sep).join('/')
        const content = f.includes('/src/constants/') || f.includes('/src/data/') || f.endsWith('/src/lib/notesDeck.js')
        if (!content || f.endsWith('/pack-manifest.js')) return
        clearTimeout(timer)
        timer = setTimeout(() => {
          execFile(
            process.execPath,
            ['--import', './scripts/resolve-ext.mjs', 'scripts/generate-pack-manifest.mjs'],
            { cwd: process.cwd() },
            (err, _stdout, stderr) => {
              if (err) server.config.logger.warn(`pack manifest not updated: ${stderr || err.message}`)
            },
          )
        }, 500)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Firebase Hosting serves the site from the domain root
  // (https://memoraa.web.app/), so there is no path prefix to add. Runtime
  // string paths to public/ files still go through import.meta.env.BASE_URL
  // rather than being hard-coded, so moving the site again stays a one-line
  // change here (see AtmosphereBackground.jsx).
  base: '/',
  plugins: [react(), tailwindcss(), packManifest()],
  build: {
    // No source maps in the production bundle. They are a build artefact
    // for debugging, and shipping them publishes the readable original
    // source (including every comment) alongside the minified output and
    // adds megabytes to the deploy. Vite's default is already false; it is
    // set explicitly so it cannot be turned on by accident.
    sourcemap: false,
  },
  resolve: {
    // Enables imports like `import Button from '@/components/ui/Button'`
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
})
