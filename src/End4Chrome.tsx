import type { WorkspaceId } from './types'
import type { LarpTrack } from './music'
import { WORKSPACE_IDS } from './workspaces'

export function End4Chrome({
  workspace,
  goWorkspace,
  cycleNextWorkspace,
  clock,
  ptime,
  wifiOn,
  volMuted,
  musicPlaying,
  track,
  weatherTemp,
  displayName,
  onLauncher,
  onClock,
  onToggleWifi,
  onToggleVol,
  onOpenLyrics,
  onToggleMusic,
  onSkip,
  onWeather,
  onUser,
}: {
  workspace: WorkspaceId
  goWorkspace: (id: WorkspaceId) => void
  cycleNextWorkspace: () => void
  clock: string
  ptime: string
  wifiOn: boolean
  volMuted: boolean
  musicPlaying: boolean
  track: LarpTrack
  weatherTemp: number
  displayName: string
  onLauncher: () => void
  onClock: () => void
  onToggleWifi: () => void
  onToggleVol: () => void
  onOpenLyrics: () => void
  onToggleMusic: () => void
  onSkip: () => void
  onWeather: () => void
  onUser: () => void
}) {
  return (
    <>
      <div className="end4-bar" aria-label="end4 floating bar">
        <div className="end4-left">
          <button type="button" className="end4-desk" title="Launcher" onClick={onLauncher}>
            Desktop
          </button>
          <button type="button" className="end4-ws-label" title="Next workspace" onClick={cycleNextWorkspace}>
            Workspace {workspace}
          </button>
        </div>
        <div className="end4-center">
          <div className="end4-ws">
            {WORKSPACE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`end4-dot${workspace === id ? ' active' : ''}`}
                onClick={() => goWorkspace(id)}
                aria-label={`Workspace ${id}`}
              />
            ))}
          </div>
        </div>
        <div className="end4-right">
          <button type="button" className="end4-media" title="Media / lyrics" onClick={onOpenLyrics}>
            <span className="end4-media-art" style={{ background: track.art }} />
            <span className="end4-media-text">
              <span className="end4-media-artist">{track.artist}</span>
              <span className="end4-media-title">{track.title}</span>
            </span>
            <span
              className={`end4-media-play${musicPlaying ? ' on' : ''}`}
              role="presentation"
              onClick={(e) => {
                e.stopPropagation()
                onToggleMusic()
              }}
            >
              {musicPlaying ? 'pause' : 'play_arrow'}
            </span>
            <span
              className="end4-media-next"
              role="presentation"
              onClick={(e) => {
                e.stopPropagation()
                onSkip()
              }}
            >
              skip_next
            </span>
          </button>
          <button type="button" className="end4-clock" title="Clock / keybinds" onClick={onClock}>
            {clock}
          </button>
          <button type="button" className="end4-ico" title="Wi-Fi" onClick={onToggleWifi}>
            {wifiOn ? 'wifi' : 'wifi_off'}
          </button>
          <button type="button" className="end4-ico" title="Volume" onClick={onToggleVol}>
            {volMuted ? 'volume_off' : 'volume_up'}
          </button>
        </div>
      </div>
      <aside className="end4-sidebar" aria-label="end4 widgets">
        <button type="button" className="end4-card end4-clock-card" onClick={onClock} title="Keybinds">
          <div className="end4-big-time">{ptime}</div>
          <div className="end4-card-sub">{clock}</div>
        </button>
        <button type="button" className="end4-card end4-weather-card" onClick={onWeather} title="Weather">
          <div className="end4-weather-temp">{weatherTemp}°C</div>
          <div className="end4-card-sub">partly cloudy · LARP City</div>
          <div className="end4-weather-meta">48% · 3 m/s</div>
        </button>
        <button type="button" className="end4-card end4-user-card" title="User" onClick={onUser}>
          <div className="end4-avatar">{(displayName || 'L').charAt(0).toUpperCase()}</div>
          <div>
            <div className="end4-hi">Hi, {displayName}</div>
            <div className="end4-card-sub">Good evening</div>
          </div>
        </button>
      </aside>
    </>
  )
}
