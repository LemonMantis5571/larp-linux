export type Skin = 'hyprland' | 'gnome' | 'kde'
export type RiceId =
  | 'default'
  | 'viegphunt'
  | 'mocha-alt'
  | 'hakuspace'
  | 'end4'
  | 'hyde'
  | 'tokyo-hypr'
  | 'nord-hypr'
  | 'gnome-adwaita'
  | 'gnome-catppuccin'
  | 'gnome-tokyonight'
  | 'gnome-nord'
  | 'gnome-graphite'
  | 'kde-breeze'
  | 'kde-sweet'
  | 'kde-nordic'
  | 'kde-catppuccin'
  | 'kde-layan'
export type ExportPreset = 'story' | 'square' | 'wide'
export type Phase = 'landing' | 'setup' | 'stage'
export type AppId = 'terminal' | 'browser' | 'files'
export type WorkspaceId = 1 | 2 | 3 | 4

export type Identity = {
  displayName: string
  username: string
  hostname: string
  cpu: string
  gpu: string
  wm: string
}

export type WindowPos = { x: number; y: number }

export type WorkspaceSnap = {
  openApps: AppId[]
  positions: Partial<Record<AppId, WindowPos>>
}

export type Toast = {
  id: number
  message: string
}

export type AppState = {
  phase: Phase
  skin: Skin
  rice: RiceId
  identity: Identity
  wallpaper: string
  accent: string
  border: string
  dotsText: string
  dotsNote: string
  openApps: AppId[]
  /** Wallpaper picker overlay (packs with walls) */
  showWallPicker?: boolean
  /** Floating export/controls bar — hide for clean screenshots (H toggles) */
  showExportBar?: boolean
  /** Active Hypr-style workspace 1–4 */
  workspace?: WorkspaceId
  /** Per-workspace open apps + window positions */
  workspaces?: Record<WorkspaceId, WorkspaceSnap>
  /** Record mode: hide export bar + peek for video */
  recordMode?: boolean
}
