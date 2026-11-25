import { useEffect, useState } from 'react'
import { loadPack, peekPack } from '@/constants/packs'

/*
  A subject's full pack (flashcards, questions, notes ...), loaded on demand.

    const { pack, loading, error, retry } = usePack(light)   // a light pack, an id, or null

  `pack` is null until the content has arrived (and for null or an unknown
  subject, in which case nothing is fetched). A subject that was loaded before
  is there on the first render, so reopening a screen does not flash a loading
  state. After a failed download, `retry()` tries again. See constants/packs.js.
*/
export default function usePack(idOrPack) {
  const id = typeof idOrPack === 'string' ? idOrPack : idOrPack?.id || null
  const [state, setState] = useState(() => ({ id, pack: id ? peekPack(id) : null, error: null }))
  const [tries, setTries] = useState(0)

  // The subject changed (or first mount): take what is cached, then fetch.
  const current = state.id === id ? state : { id, pack: id ? peekPack(id) : null, error: null }

  useEffect(() => {
    if (!id) return undefined
    if (peekPack(id)) {
      setState({ id, pack: peekPack(id), error: null })
      return undefined
    }
    let live = true
    loadPack(id)
      .then((pack) => live && setState({ id, pack, error: null }))
      .catch((error) => live && setState({ id, pack: null, error }))
    return () => {
      live = false
    }
  }, [id, tries])

  const retry = () => {
    setState({ id, pack: null, error: null })
    setTries((n) => n + 1)
  }

  return { pack: current.pack, loading: Boolean(id) && !current.pack && !current.error, error: current.error, retry }
}
