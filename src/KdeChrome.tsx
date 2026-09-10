import type { AppId, WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

export function KdeChrome({
  workspace,
  goWorkspace,
  clock,
  displayName,
  openApps,
  wifiOn,
  volMuted,
  btOn,
  onLauncher,
  onClock,
  onToggleWifi,
  onToggleVol,
  onToggleBt,
  onToggleApp,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  displayName: string
  openApps: AppId[]
  wifiOn: boolean
  volMuted: boolean
  btOn: boolean
  onLauncher: () => void
  onClock: () => void
  onToggleWifi: () => void
  onToggleVol: () => void
  onToggleBt: () => void
  onToggleApp: (app: AppId) => void
}) {
  return (
    <div className="kde-panel" aria-label="Plasma panel">
      <button type="button" className="kde-kickoff" title="Application Launcher" onClick={onLauncher}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 4.2l7.2 15.4H4.8L12 4.2z" />
        </svg>
      </button>
      <div className="kde-tasks">
        <button
          type="button"
          className={`kde-task${openApps.includes('terminal') ? ' on' : ''}`}
          onClick={() => onToggleApp('terminal')}
        >
          Konsole
        </button>
        <button
          type="button"
          className={`kde-task${openApps.includes('browser') ? ' on' : ''}`}
          onClick={() => onToggleApp('browser')}
        >
          Firefox
        </button>
        <button
          type="button"
          className={`kde-task${openApps.includes('files') ? ' on' : ''}`}
          onClick={() => onToggleApp('files')}
        >
          Dolphin
        </button>
      </div>
      <div className="kde-ws">
        {WORKSPACE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`kde-ws-btn${workspace === id ? ' active' : ''}`}
            onClick={() => goWorkspace(id)}
          >
            {id}
          </button>
        ))}
      </div>
      <div className="kde-tray">
        <button type="button" className="kde-ico" title="Bluetooth" onClick={onToggleBt}>
          {btOn ? 'bluetooth' : 'bluetooth_disabled'}
        </button>
        <button type="button" className="kde-ico" title="Network" onClick={onToggleWifi}>
          {wifiOn ? 'wifi' : 'wifi_off'}
        </button>
        <button type="button" className="kde-ico" title="Volume" onClick={onToggleVol}>
          {volMuted ? 'volume_off' : 'volume_up'}
        </button>
        <span className="kde-who">{displayName}</span>
        <button type="button" className="kde-clock" onClick={onClock} title="Clock / keybinds">
          {clock}
        </button>
      </div>
    </div>
  )
}
