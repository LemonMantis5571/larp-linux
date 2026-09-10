import { AppIcon } from './AppIcon'
import { appLabel } from './appIcons'
import type { AppId, WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

const TASK_APPS: AppId[] = ['browser', 'files', 'terminal']

export function KdeChrome({
  workspace,
  goWorkspace,
  clock,
  focusedApp,
  openApps,
  wifiOn,
  volMuted,
  btOn,
  onLauncher,
  onClock,
  onToggleWifi,
  onToggleVol,
  onToggleBt,
  onBattery,
  onOpenApp,
  onPower,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  focusedApp: AppId | null
  openApps: AppId[]
  wifiOn: boolean
  volMuted: boolean
  btOn: boolean
  onLauncher: () => void
  onClock: () => void
  onToggleWifi: () => void
  onToggleVol: () => void
  onToggleBt: () => void
  onBattery: () => void
  onOpenApp: (app: AppId) => void
  onPower: () => void
}) {
  return (
    <div className="kde-panel">
      <button type="button" className="kde-kickoff" title="Application Launcher" onClick={onLauncher}>
        <i className="nf-grid" />
      </button>
      <div className="kde-pager" aria-label="Virtual desktops">
        {WORKSPACE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`kde-pager-cell${workspace === id ? ' active' : ''}`}
            onClick={() => goWorkspace(id)}
          >
            {id}
          </button>
        ))}
      </div>
      <div className="kde-tasks">
        {TASK_APPS.map((app) => {
          const running = openApps.includes(app)
          const focused = focusedApp === app
          return (
            <button
              key={app}
              type="button"
              className={`kde-task${running ? ' running' : ''}${focused ? ' focused' : ''}`}
              aria-label={appLabel({ app, skin: 'kde' })}
              onClick={() => onOpenApp(app)}
            >
              <AppIcon app={app} size={28} skin="kde" />
            </button>
          )
        })}
      </div>
      <div className="kde-tray">
        <button type="button" className="kde-tray-btn" title="Bluetooth" onClick={onToggleBt}>
          <i className={btOn ? 'nf-bt' : 'nf-bt-off'} />
        </button>
        <button type="button" className="kde-tray-btn" title="Wi-Fi" onClick={onToggleWifi}>
          <i className={wifiOn ? 'nf-wifi' : 'nf-wifi-off'} />
        </button>
        <button type="button" className="kde-tray-btn" title="Volume" onClick={onToggleVol}>
          <i className={volMuted ? 'nf-mute' : 'nf-vol'} />
        </button>
        <button type="button" className="kde-tray-btn" title="Battery" onClick={onBattery}>
          <i className="nf-plug" />
        </button>
        <button type="button" className="kde-clock" title="Calendar" onClick={onClock}>
          {clock}
        </button>
        <button type="button" className="kde-tray-btn" title="Leave" onClick={onPower}>
          <i className="nf-power" />
        </button>
      </div>
    </div>
  )
}
