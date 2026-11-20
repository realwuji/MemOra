import { useEffect, useState } from 'react'

/*
  True on a desktop-sized screen with a mouse-like pointer. The corner Spotify
  player is a PC feature: on a phone it covers the page and the embed is not
  worth the data, so nothing about it mounts there.
*/
const QUERY = '(min-width: 1024px) and (hover: hover)'

export default function useIsDesktop() {
  const [yes, setYes] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setYes(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return yes
}
