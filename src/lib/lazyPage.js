import { lazy } from 'react'

/*
  React.lazy for a page, with one safety net. Every deploy renames the built
  files, so a tab left open from the previous deploy can ask for a page file
  that no longer exists. Rather than leave a blank screen, reload once to pick
  up the new build (the flag stops a reload loop if the network is simply down).
*/
const FLAG = 'memora.chunk-reload'

export default function lazyPage(load) {
  return lazy(() =>
    load()
      .then((m) => {
        try {
          sessionStorage.removeItem(FLAG)
        } catch {
          /* private mode */
        }
        return m
      })
      .catch((err) => {
        let again = false
        try {
          again = sessionStorage.getItem(FLAG) === '1'
          sessionStorage.setItem(FLAG, '1')
        } catch {
          again = true
        }
        if (!again) {
          window.location.reload()
          return new Promise(() => {})
        }
        throw err
      }),
  )
}
