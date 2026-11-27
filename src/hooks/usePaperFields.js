import { useCallback, useState } from 'react'

/*
  The text a student has typed onto a question paper (components/ui/PaperFields.jsx), kept for the
  browser SESSION only (sessionStorage), keyed by the question: it survives a reload and is gone when the
  tab closes, like the working pad. Returns { values, set(i, text), clear(), count }, where values maps a
  field's index to its text.
*/
const KEY = (storeKey) => `memora:fields:${storeKey}`

const load = (storeKey) => {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY(storeKey)) || '{}')
    return v && typeof v === 'object' ? v : {}
  } catch {
    return {}
  }
}

export default function usePaperFields(storeKey) {
  const [values, setValues] = useState(() => load(storeKey))
  const save = (next) => {
    try {
      if (Object.keys(next).length) sessionStorage.setItem(KEY(storeKey), JSON.stringify(next))
      else sessionStorage.removeItem(KEY(storeKey))
    } catch {
      /* storage blocked: typing still works, it is just not remembered */
    }
  }
  const set = useCallback(
    (i, text) =>
      setValues((v) => {
        const next = { ...v }
        if (text) next[i] = text
        else delete next[i]
        save(next)
        return next
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storeKey],
  )
  const clear = useCallback(() => {
    setValues({})
    save({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeKey])
  return { values, set, clear, count: Object.keys(values).length }
}

