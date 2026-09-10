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
  onTrayFiles,
  onTrayClip,
  networkName,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  btOn: boolean
  wifiOn: boolean
  volMuted: boolean
  volLevel: number
  networkName: string
  onPower: () => void
  onToggleBt: () => void
  onToggleWifi: () => void
  onBattery: () => void
  onToggleVol: () => void
  onClock: () => void
  onTrayFiles: () => void
  onTrayClip: () => void
}) {
  return (
    <div className="panel waybar">
      <div className="panel-left">
        <button type="button" className="wb power" title="wlogout" onClick={onPower}>
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
        <button type="button" className="wb tray" title="Files" onClick={onTrayFiles}>
          <i className="nf-pkg" />
        </button>
        <button type="button" className="wb tray" title="Clipboard" onClick={onTrayClip}>
          <i className="nf-clip" />
        </button>
        <button type="button" className="wb bt" title="blueman-manager" onClick={onToggleBt}>
          <i className={btOn ? 'nf-bt' : 'nf-bt-off'} />
        </button>
        <button type="button" className="wb net" title="Wi-Fi" onClick={onToggleWifi}>
          <i className={wifiOn ? 'nf-wifi' : 'nf-warn'} /> {wifiOn ? networkName : 'Disconnected'}
        </button>
        <button type="button" className="wb bat" title="Battery" onClick={onBattery}>
          <i className="nf-plug" /> 98%
        </button>
        <button type="button" className="wb vol" title="pavucontrol" onClick={onToggleVol}>
          {/* upstream format-muted keeps the percentage, only the icon changes */}
          <i className={volMuted ? 'nf-mute' : 'nf-vol'} /> {volLevel}%
        </button>
        <button type="button" className="wb clock" title="swaync" onClick={onClock}>
          {clock}
        </button>
      </div>
    </div>
  )
}
