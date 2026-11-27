import { useState } from 'react'
import { applyUpdate, usePwa } from '@/lib/pwa'
import Icon from '@/components/ui/Icon'

/*
  The two things about the app itself that a student should never have to hunt for, shown bottom-left on
  every page: that they are offline (what still works), and that a new version is ready (applied only when
  they choose, so nothing is replaced mid-question). Both are plain square chips like the rest of the
  server look; nothing here moves unless it appears.
*/
export default function PwaStatus() {
  const { offline, updateReady } = usePwa()
  const [later, setLater] = useState(false)
  if (!offline && (!updateReady || later)) return null
  return (
    <div className="pwa-dock" aria-live="polite">
      {offline && (
        <div className="pwa-chip" role="status">
          <Icon name="wifiOff" className="h-4 w-4 shrink-0" />
          <span>Offline. Pages and questions you have opened still work, and your progress is saved on this device.</span>
        </div>
      )}
      {updateReady && !later && (
        <div className="pwa-chip" role="status">
          <i className="srv-led" style={{ '--led': 'var(--done, #2f9e6b)' }} aria-hidden="true" />
          <span>A new version is ready.</span>
          <button type="button" className="pwa-btn" onClick={applyUpdate}>
            Reload
          </button>
          <button type="button" className="pwa-btn alt" onClick={() => setLater(true)}>
            Later
          </button>
        </div>
      )}
    </div>
  )
}
