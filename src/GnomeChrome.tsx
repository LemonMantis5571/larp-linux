import type { AppId, WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

export function GnomeChrome({
  workspace,
  goWorkspace,
  clock,
  displayName,
  focusedApp,
  openApps,
  wifiOn,
  volMuted,
  onLauncher,
  onClock,
  onToggleWifi,
  onToggleVol,
  onToggleApp,
  onUser,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  displayName: string
  focusedApp: AppId | null
  openApps: AppId[]
  wifiOn: boolean
  volMuted: boolean
  onLauncher: () => void
  onClock: () => void
  onToggleWifi: () => void
  onToggleVol: () => void
  onToggleApp: (app: AppId) => void
  onUser: () => void
}) {
  const appName =
    focusedApp === 'terminal' ? 'Console' : focusedApp === 'browser' ? 'Firefox' : focusedApp === 'files' ? 'Files' : ''

  return (
    <>
      <div className="gnome-topbar" aria-label="GNOME top bar">
        <div className="gnome-left">
          <button type="button" className="gnome-activities" onClick={onLauncher}>
            Activities
          </button>
          {appName ? <span className="gnome-appmenu">{appName}</span> : null}
        </div>
        <button type="button" className="gnome-clock" onClick={onClock} title="Clock / keybinds">
          {clock}
        </button>
        <div className="gnome-status">
          <div className="gnome-ws" aria-label="Workspaces">
            {WORKSPACE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`gnome-ws-dot${workspace === id ? ' active' : ''}`}
                onClick={() => goWorkspace(id)}
                aria-label={`Workspace ${id}`}
              />
            ))}
          </div>
          <button type="button" className="gnome-ico" title="Wi-Fi" onClick={onToggleWifi}>
            {wifiOn ? 'wifi' : 'wifi_off'}
          </button>
          <button type="button" className="gnome-ico" title="Volume" onClick={onToggleVol}>
            {volMuted ? 'volume_off' : 'volume_up'}
          </button>
          <button type="button" className="gnome-user" title={displayName} onClick={onUser}>
            {(displayName || 'L').charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
      <nav className="gnome-dash" aria-label="Dash">
        <button
          type="button"
          className={`gnome-dash-btn${openApps.includes('browser') ? ' on' : ''}`}
          onClick={() => onToggleApp('browser')}
          title="Firefox"
        >
          🌐
        </button>
        <button
          type="button"
          className={`gnome-dash-btn${openApps.includes('files') ? ' on' : ''}`}
          onClick={() => onToggleApp('files')}
          title="Files"
        >
          📁
        </button>
        <button
          type="button"
          className={`gnome-dash-btn${openApps.includes('terminal') ? ' on' : ''}`}
          onClick={() => onToggleApp('terminal')}
          title="Console"
        >
          🖥️
        </button>
        <span className="gnome-dash-sep" aria-hidden />
        <button type="button" className="gnome-dash-btn show-apps" onClick={onLauncher} title="Show Apps">
          ⋮⋮
        </button>
      </nav>
    </>
  )
}
