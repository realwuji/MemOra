/*
  The revision subjects, as the app sees them.

  Every subject is available at once as a LIGHT pack (pack-manifest.js): id,
  name, topics, the chapter outline (`groups`) and `counts` of what it holds.
  That is all the dashboard, the progress page and the launchers need, and it
  is about 15KB. A subject's CONTENT (flashcards, questions, notes, essay
  plans, diagrams, up to 2.3MB for Economics) is a separate chunk that is
  downloaded when the subject is studied:

    const light = getPackByName('Maths')        // sync, outline and counts
    const full = await loadPack('maths')        // the whole pack, cached
    const { pack, loading } = usePack('maths')  // the same, as a hook

  Before this, the app imported library.js, so every page that so much as
  listed chapters paid for every subject's content in its first download.
  Never import library.js from the app (scripts may).

  A light pack has no flashcards, mcq, examQuestions, notes, essayBank,
  applications or realCases. In development, reading one of those from it logs
  an error, so a missing load is found at once instead of showing as an
  empty screen.
*/
import { PACK_MANIFEST } from './pack-manifest'
import { PACK_LOADERS } from './pack-loaders'
import { makeLookup, topicLevelMap, countsOf } from './pack-lookup'

export { topicLevelMap, countsOf }

const HEAVY = new Set(['flashcards', 'mcq', 'examQuestions', 'notes', 'essayBank', 'applications', 'realCases'])

const guard = (pack) =>
  import.meta.env?.DEV
    ? new Proxy(pack, {
        get(target, key, receiver) {
          if (HEAVY.has(key)) {
            console.error(`[packs] "${key}" was read from the light ${target.id} pack, which has no content. Use loadPack() or usePack().`)
          }
          return Reflect.get(target, key, receiver)
        },
      })
    : pack

const LIGHT = PACK_MANIFEST.map(guard)

export const REVISION_LIGHT = LIGHT
export const REVISION_SUBJECTS = LIGHT.map((p) => ({ id: p.id, name: p.name }))

const lookup = makeLookup(LIGHT)
export const getPack = lookup.getPack
export const getPackByName = lookup.getPackByName

// ---- full packs --------------------------------------------------------------
/*
  A deploy renames every built file (the names carry a hash), so a tab left
  open from the previous deploy asks for a subject chunk that no longer exists.
  Pages already recover from that (lib/lazyPage.js reloads once); a subject's
  content must too, or "Try again" would request the same missing file for
  ever. It reloads once to pick up the new build, but only while online (offline,
  a reload would only show the browser's error page, so the error card and its
  retry are better) and never from a mere preload. The flag is its own, not
  lazyPage's: a page chunk loading fine must not re-arm this one, or a file the
  network blocks for good would reload the tab in a loop.
*/
const RELOAD_FLAG = 'memora.pack-reload'
const clearReloadFlag = () => {
  try {
    sessionStorage.removeItem(RELOAD_FLAG)
  } catch {
    /* private mode */
  }
}
// True if it started a reload (so the caller should wait for it, not report an error).
function reloadForNewBuild() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false
  try {
    if (sessionStorage.getItem(RELOAD_FLAG) === '1') return false
    sessionStorage.setItem(RELOAD_FLAG, '1')
  } catch {
    return false
  }
  window.location.reload()
  return true
}

const pending = new Map() // id -> promise of the full pack
const done = new Map() // id -> the full pack, once it has arrived

const idOf = (idOrPack) => (typeof idOrPack === 'string' ? idOrPack : idOrPack?.id)

// The full pack if it has already been loaded, else null. Lets a screen that
// is opened a second time render at once instead of flashing a loading state.
export const peekPack = (idOrPack) => done.get(idOf(idOrPack)) || null

// Fetches a subject's full pack (once; later calls share the result). Resolves
// to null for an unknown subject. A failed download is not remembered, so the
// next call tries again. `recover: false` (used by preloads) skips the reload
// described above.
export function loadPack(idOrPack, { recover = true } = {}) {
  const id = idOf(idOrPack)
  const load = PACK_LOADERS[id]
  if (!load) return Promise.resolve(null)
  if (!pending.has(id)) {
    pending.set(
      id,
      load()
        .then((m) => {
          done.set(id, m.default)
          clearReloadFlag()
          return m.default
        })
        .catch((err) => {
          pending.delete(id)
          throw err
        }),
    )
  }
  const promise = pending.get(id)
  if (!recover) return promise
  return promise.catch((err) => {
    if (reloadForNewBuild()) return new Promise(() => {})
    throw err
  })
}

export const loadAllPacks = () => Promise.all(LIGHT.map((p) => loadPack(p.id)))

// Starts the download without waiting for it, for when the content will
// probably be wanted next (the chapter picker is on screen, a card is hovered).
export function preloadPack(idOrPack) {
  loadPack(idOrPack, { recover: false }).catch(() => {})
}
