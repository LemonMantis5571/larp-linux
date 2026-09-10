import { AppIcon } from './AppIcon'
import { appLabel } from './appIcons'
import type { AppId, WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

const DASH_APPS: AppId[] = ['browser', 'files', 'terminal']

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
  onOpenApp,
  onUser,
  onPower,
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
  onOpenApp: (app: AppId) => void
  onUser: () => void
  onPower: () => void
}) {
  const appName =
    focusedApp === 'terminal'
      ? 'Console'
      : focusedApp === 'browser'
        ? 'Firefox'
        : focusedApp === 'files'
          ? 'Files'
          : ''

  return (
    <>
      <div className="gnome-panel">
        <div className="gnome-panel-left">
          <button type="button" className="gnome-btn gnome-activities" title="Overview" onClick={onLauncher}>
            Activities
          </button>
          <div className="gnome-ws-dots" aria-label="Workspaces">
            {WORKSPACE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`gnome-ws-dot${workspace === id ? ' active' : ''}`}
                aria-label={`Workspace ${id}`}
                onClick={() => goWorkspace(id)}
              />
            ))}
          </div>
          {appName ? <span className="gnome-app-menu">{appName}</span> : null}
        </div>
        <button type="button" className="gnome-btn gnome-clock" title="Calendar" onClick={onClock}>
          {clock}
        </button>
        <div className="gnome-panel-right">
          <button type="button" className="gnome-btn" title="Wi-Fi" onClick={onToggleWifi}>
            <i className={wifiOn ? 'nf-wifi' : 'nf-wifi-off'} />
          </button>
          <button type="button" className="gnome-btn" title="Volume" onClick={onToggleVol}>
            <i className={volMuted ? 'nf-mute' : 'nf-vol'} />
          </button>
          <button type="button" className="gnome-btn" title="Power" onClick={onPower}>
            <i className="nf-power" />
          </button>
          <button type="button" className="gnome-btn gnome-user" title="Settings" onClick={onUser}>
            {displayName}
          </button>
        </div>
      </div>
      <nav className="gnome-dash" aria-label="Dash">
        <div className="gnome-dash-bg">
          {DASH_APPS.map((app) => {
            const running = openApps.includes(app)
            const focused = focusedApp === app
            return (
              <button
                key={app}
                type="button"
                className={`gnome-dash-item${running ? ' running' : ''}${focused ? ' focused' : ''}`}
                aria-label={appLabel({ app, skin: 'gnome' })}
                onClick={() => onOpenApp(app)}
              >
                <span className="gnome-dash-icon">
                  <AppIcon app={app} size={40} skin="gnome" />
                </span>
                {running ? <span className="gnome-running-dot" aria-hidden /> : null}
              </button>
            )
          })}
          <span className="gnome-dash-sep" aria-hidden />
          <button type="button" className="gnome-dash-item gnome-show-apps" title="Show Apps" onClick={onLauncher}>
            <span className="gnome-dash-icon">
              <i className="nf-grid" />
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
