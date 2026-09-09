import type { WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

export function ViegWaybar({
  workspace,
  goWorkspace,
  clock,
  btOn,
  wifiOn,
  volMuted,
  volLevel,
  onPower,
  onToggleBt,
  onToggleWifi,
  onBattery,
  onToggleVol,
  onClock,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  btOn: boolean
  wifiOn: boolean
  volMuted: boolean
  volLevel: number
  onPower: () => void
  onToggleBt: () => void
  onToggleWifi: () => void
  onBattery: () => void
  onToggleVol: () => void
  onClock: () => void
}) {
  return (
    <div className="panel waybar">
      <div className="panel-left">
        <button type="button" className="wb power" title="wlogout (LARP)" onClick={onPower}>
          <i className="nf-power-dot" />
        </button>
        <div className="workspaces">
          {WORKSPACE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`ws${workspace === id ? ' active' : ''}`}
              onClick={() => goWorkspace(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <div className="panel-right">
        <span className="wb tray" title="Tray">
          <i className="nf-pkg" />
          <i className="nf-clip" />
        </span>
        <button type="button" className="wb bt" title="blueman-manager (LARP)" onClick={onToggleBt}>
          <i className={btOn ? 'nf-bt' : 'nf-bt-off'} />
        </button>
        <button type="button" className="wb net" title="Wi-Fi (LARP)" onClick={onToggleWifi}>
          <i className={wifiOn ? 'nf-wifi' : 'nf-warn'} /> {wifiOn ? 'LARP-NET' : 'Disconnected'}
        </button>
        <button type="button" className="wb bat" title="Battery (LARP)" onClick={onBattery}>
          <i className="nf-plug" /> 98%
        </button>
        <button type="button" className="wb vol" title="pavucontrol (LARP)" onClick={onToggleVol}>
          {/* upstream format-muted keeps the percentage, only the icon changes */}
          <i className={volMuted ? 'nf-mute' : 'nf-vol'} /> {volLevel}%
        </button>
        <button type="button" className="wb clock" title="swaync (LARP)" onClick={onClock}>
          {clock}
        </button>
      </div>
    </div>
  )
}
