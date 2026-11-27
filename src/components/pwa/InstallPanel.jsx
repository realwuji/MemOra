import { promptInstall, usePwa } from '@/lib/pwa'
import { useApp } from '@/context/AppProvider'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

/*
  Install and offline, for Settings. Says plainly what state the app is in and offers the one action that
  fits: the browser's own install dialog where there is one, written steps where there is not (iPhone, iPad,
  Safari), nothing to do once installed. Every branch also says what installing gives you.
*/
export default function InstallPanel() {
  const { canInstall, installed, installHelp, supported, offline } = usePwa()
  const { showToast } = useApp()

  const install = async () => {
    const r = await promptInstall()
    if (r === 'accepted') showToast('Memoraa is installing')
  }

  let status
  if (installed) status = { led: 'var(--done, #2f9e6b)', text: 'Installed. You are using Memoraa as an app.' }
  else if (canInstall) status = { led: 'var(--fg)', text: 'Ready to install on this device.' }
  else if (installHelp) status = { led: 'var(--fg)', text: installHelp }
  else status = { led: '#9a9a9a', text: 'This browser does not offer installing. Chrome, Edge, Safari and most phone browsers do.' }

  return (
    <div className="space-y-5">
      <div className="srv-card flex flex-wrap items-center justify-between gap-4 border border-line p-4">
        <div className="flex min-w-0 items-start gap-3">
          <i className="srv-led mt-1.5" style={{ '--led': status.led }} aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-fg">{installed ? 'Memoraa app' : 'Install Memoraa'}</p>
            <p className="readable mt-0.5 text-sm text-muted">{status.text}</p>
          </div>
        </div>
        {canInstall && (
          <Button onClick={install} size="sm">
            <Icon name="download" className="h-4 w-4" />
            Install app
          </Button>
        )}
      </div>

      <ul className="readable space-y-2 text-sm text-muted">
        <li>
          <strong className="text-fg">Opens like an app.</strong> Its own window, on your home screen or dock, with no browser bars.
        </li>
        <li>
          <strong className="text-fg">Works offline.</strong>{' '}
          {supported
            ? 'After one visit the whole app loads without a connection. Past-paper questions are saved as you open them.'
            : 'This browser cannot keep it for offline use.'}
        </li>
        <li>
          <strong className="text-fg">Stays current.</strong> New versions arrive in the background; you choose when to reload.
        </li>
        <li>
          <strong className="text-fg">Private.</strong> Your progress lives on this device only. Nothing is uploaded.
        </li>
      </ul>
      {offline && <p className="text-xs font-semibold text-muted">You are offline right now.</p>}
    </div>
  )
}
