import type { HyprVariant } from './rices'
import type { WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

export function HyprBar({
  variant,
  workspace,
  goWorkspace,
  clock,
  wifiOn,
  volMuted,
  volLevel,
  onLauncher,
  onClock,
  onToggleWifi,
  onToggleVol,
  onPower,
}: {
  variant: HyprVariant
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  wifiOn: boolean
  volMuted: boolean
  volLevel: number
  onLauncher: () => void
  onClock: () => void
  onToggleWifi: () => void
  onToggleVol: () => void
  onPower: () => void
}) {
  return (
    <div className={`hyprbar hyprbar-${variant}`} aria-label={`${variant} waybar`}>
      <div className="hyprbar-left">
        <button type="button" className="hyprbar-logo" title="Launcher" onClick={onLauncher}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2.4l8.4 18.2H3.6L12 2.4z" />
          </svg>
        </button>
        <div className="hyprbar-ws">
          {WORKSPACE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`hyprbar-ws-btn${workspace === id ? ' active' : ''}`}
              onClick={() => goWorkspace(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
      <div className="hyprbar-right">
        <button type="button" className="hyprbar-mod" onClick={onToggleWifi}>
          {wifiOn ? 'LARP-NET' : 'offline'}
        </button>
        <button type="button" className="hyprbar-mod" onClick={onToggleVol}>
          {volMuted ? 'muted' : `${volLevel}%`}
        </button>
        <button type="button" className="hyprbar-clock" onClick={onClock}>
          {clock}
        </button>
        <button type="button" className="hyprbar-power" title="wlogout" onClick={onPower}>
          ⏻
        </button>
      </div>
    </div>
  )
}
