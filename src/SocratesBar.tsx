import type { WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

export type AsusProfile = 'Integrated' | 'Hybrid' | 'Dedicated'

export function SocratesBar({
  workspace,
  goWorkspace,
  clock,
  btOn,
  wifiOn,
  volMuted,
  volLevel,
  brightness,
  micMuted,
  vpnOn,
  asusProfile,
  onPower,
  onToggleBt,
  onToggleWifi,
  onToggleMic,
  onToggleVpn,
  onToggleVol,
  onBattery,
  onClock,
  onCycleBrightness,
  onCycleAsus,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  btOn: boolean
  wifiOn: boolean
  volMuted: boolean
  volLevel: number
  brightness: number
  micMuted: boolean
  vpnOn: boolean
  asusProfile: AsusProfile
  onPower: () => void
  onToggleBt: () => void
  onToggleWifi: () => void
  onToggleMic: () => void
  onToggleVpn: () => void
  onToggleVol: () => void
  onBattery: () => void
  onClock: () => void
  onCycleBrightness: () => void
  onCycleAsus: () => void
}) {
  return (
    <div className="socrates-bar">
      <div className="soc-left">
        <button type="button" className="soc-mod soc-clock" title="clock" onClick={onClock}>
          [ <i className="nf-soc-clock" /> {clock} ]
        </button>
        <button type="button" className="soc-mod soc-power" title="Power Menu" aria-label="Power Menu" onClick={onPower}>
          [ <i className="nf-soc-power" /> ]
        </button>
        <button type="button" className="soc-mod soc-net" title="nm-connection-editor" aria-label="Network" onClick={onToggleWifi}>
          [ <i className={wifiOn ? 'nf-soc-wifi' : 'nf-wifi-off'} /> ]
        </button>
        <button type="button" className={`soc-mod soc-bt${btOn ? '' : ' disabled'}`} title="bluetooth" onClick={onToggleBt}>
          <i className={btOn ? 'nf-bt' : 'nf-bt-off'} />
        </button>
        <button type="button" className="soc-mod soc-mic" title="Mic Toggle" onClick={onToggleMic}>
          <i className={micMuted ? 'nf-mic-off' : 'nf-mic'} />
        </button>
        <button type="button" className={`soc-mod soc-vpn${vpnOn ? '' : ' off'}`} title="ProtonVPN" onClick={onToggleVpn}>
          <i className="nf-vpn" />
        </button>
      </div>
      <div className="soc-center">
        {WORKSPACE_IDS.slice(0, 2).map((id) => (
          <button
            key={id}
            type="button"
            className={`soc-ws${workspace === id ? ' active' : ''}`}
            onClick={() => goWorkspace(id)}
          >
            {id}
          </button>
        ))}
        <button type="button" className="soc-mod soc-asus" title="Switch GPU mode" onClick={onCycleAsus}>
          {asusProfile}
        </button>
        {WORKSPACE_IDS.slice(2).map((id) => (
          <button
            key={id}
            type="button"
            className={`soc-ws${workspace === id ? ' active' : ''}`}
            onClick={() => goWorkspace(id)}
          >
            {id}
          </button>
        ))}
      </div>
      <div className="soc-right">
        <button type="button" className="soc-mod soc-bat" title="Battery" onClick={onBattery}>
          <i className="nf-bat" /> 98%
        </button>
        <button type="button" className={`soc-mod soc-vol${volMuted ? ' muted' : ''}`} title="wpctl mute" onClick={onToggleVol}>
          <i className={volMuted ? 'nf-mute' : 'nf-vol'} /> {volLevel}%
        </button>
        <button type="button" className="soc-mod soc-bright" title="Brightness" onClick={onCycleBrightness}>
          <i className="nf-bright" /> {brightness}%
        </button>
      </div>
    </div>
  )
}
