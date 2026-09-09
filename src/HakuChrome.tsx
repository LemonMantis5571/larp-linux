import { CavaBars } from './CavaBars'
import { clipTitle, type LarpTrack } from './music'
import type { AppId, WorkspaceId } from './types'
import { WORKSPACE_IDS } from './workspaces'

export function HakuChrome({
  workspace,
  goWorkspace,
  clock,
  volMuted,
  volLevel,
  brightness,
  musicPlaying,
  track,
  cavaLevels,
  monitorOpen,
  openApps,
  onLauncher,
  onSettings,
  onClock,
  onToggleMusic,
  onOpenLyrics,
  onToggleMonitor,
  onCycleBrightness,
  onToggleVol,
  onBattery,
  onPower,
  onToggleApp,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  clock: string
  volMuted: boolean
  volLevel: number
  brightness: number
  musicPlaying: boolean
  track: LarpTrack
  cavaLevels: number[]
  monitorOpen: boolean
  openApps: AppId[]
  onLauncher: () => void
  onSettings: () => void
  onClock: () => void
  onToggleMusic: () => void
  onOpenLyrics: () => void
  onToggleMonitor: () => void
  onCycleBrightness: () => void
  onToggleVol: () => void
  onBattery: () => void
  onPower: () => void
  onToggleApp: (app: AppId) => void
}) {
  return (
    <>
      <div className="haku-bar" aria-label="Hakuspace island bar">
        <div className="haku-left-stack">
          <div className="haku-box haku-utilities">
            <button type="button" className="haku-ico nf-search" title="Haku Menu" onClick={onLauncher} />
            <button type="button" className="haku-ico nf-gear" title="Setting folder" onClick={onSettings} />
          </div>
          <div className="haku-box haku-workspaces">
            <div className="haku-ws">
              {WORKSPACE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`haku-pill${workspace === id ? ' active' : ''}`}
                  onClick={() => goWorkspace(id)}
                  aria-label={`Workspace ${id}`}
                />
              ))}
            </div>
          </div>
          <div className="haku-box haku-musics">
            <span className="haku-cava-ico nf-note" title="Music Visualizer" />
            <button type="button" className="haku-cava" title="cava" onClick={onToggleMusic}>
              <CavaBars levels={cavaLevels} />
            </button>
            <button
              type="button"
              className="haku-mpris"
              title="mpris"
              onClick={onOpenLyrics}
            >
              <i className={musicPlaying ? 'nf-mpris-on' : 'nf-mpris-off'} />
              {' / '}
              {musicPlaying ? clipTitle(track.title) : <i>{clipTitle(track.title)}</i>}
            </button>
          </div>
        </div>
        <div className="haku-box haku-clocks">
          <button type="button" className="haku-clock" title="Clock / keybinds" onClick={onClock}>
            {clock}
          </button>
        </div>
        <div className="haku-right-stack">
          <div className="haku-box haku-monitor">
            <button
              type="button"
              className="haku-mod nf-monitor"
              title="Click to show monitor stats"
              onClick={onToggleMonitor}
            />
            {monitorOpen ? (
              <span className="haku-monitor-stats">
                <span className="haku-mod">CPU 12%</span>
                <span className="haku-mod">MEM 4.1G</span>
                <span className="haku-mod">47°</span>
              </span>
            ) : null}
          </div>
          <div className="haku-box haku-adjusters">
            <button type="button" className="haku-mod" title="Brightness" onClick={onCycleBrightness}>
              <i className="nf-bright" /> {brightness}%
            </button>
            <button type="button" className="haku-mod" title="Volume" onClick={onToggleVol}>
              <i className={volMuted ? 'nf-mute' : 'nf-vol'} /> {volMuted ? '' : `${volLevel}%`}
            </button>
            <button type="button" className="haku-mod" title="Battery" onClick={onBattery}>
              <i className="nf-bat" /> 79%
            </button>
          </div>
          <div className="haku-box haku-trays">
            <span className="haku-tray" title="Tray">
              <i className="nf-pkg" />
              <i className="nf-clip" />
            </span>
          </div>
          <div className="haku-box haku-tools">
            <span className="haku-mod nf-bolt" title="Power profile" />
            <span className="haku-mod nf-rec" title="Stop recording" />
            <button type="button" className="haku-mod nf-power" title="Power Menu" onClick={onPower} />
            <button type="button" className="haku-mod nf-bell" title="Notifications" onClick={onClock} />
          </div>
        </div>
      </div>
      <div className="haku-dock" aria-label="Hakuspace dock">
        <button type="button" className="haku-dock-btn" title="launcher" aria-label="launcher" onClick={onLauncher}>
          <i className="nf-grid" />
        </button>
        <span className="haku-dock-sep" aria-hidden />
        <button
          type="button"
          className={`haku-dock-btn${openApps.includes('terminal') ? ' on' : ''}`}
          onClick={() => onToggleApp('terminal')}
          title="terminal"
        >
          <i className="nf-term" />
        </button>
        <button
          type="button"
          className={`haku-dock-btn${openApps.includes('files') ? ' on' : ''}`}
          onClick={() => onToggleApp('files')}
          title="files"
        >
          <i className="nf-folder" />
        </button>
        <button
          type="button"
          className={`haku-dock-btn${openApps.includes('browser') ? ' on' : ''}`}
          onClick={() => onToggleApp('browser')}
          title="browser"
        >
          <i className="nf-web" />
        </button>
      </div>
    </>
  )
}
