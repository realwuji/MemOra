import { promptInstall, usePwa } from '@/lib/pwa'
import { useApp } from '@/context/AppProvider'
import Icon from '@/components/ui/Icon'
import { Link } from 'react-router-dom'

/*
  "Install app" in the account menu. A button where the browser can install from one, a link to the written
  steps in Settings where it cannot (iPhone, iPad, Safari), and nothing at all once installed or where
  installing is not possible, so the menu never offers something that does nothing.
*/
export default function InstallMenuItem({ onDone }) {
  const { canInstall, installed, installHelp } = usePwa()
  const { showToast } = useApp()
  if (installed) return null
  if (canInstall) {
    return (
      <button
        type="button"
        role="menuitem"
        className="mn-link"
        onClick={async () => {
          onDone?.()
          if ((await promptInstall()) === 'accepted') showToast('Memoraa is installing')
        }}
      >
        <Icon name="download" className="mt-0.5 h-4 w-4 text-muted" />
        <span className="mn-text">
          <span className="mn-label">Install app</span>
        </span>
      </button>
    )
  }
  if (installHelp) {
    return (
      <Link to="/profile#app" role="menuitem" className="mn-link" onClick={onDone}>
        <Icon name="download" className="mt-0.5 h-4 w-4 text-muted" />
        <span className="mn-text">
          <span className="mn-label">Install app</span>
        </span>
      </Link>
    )
  }
  return null
}
