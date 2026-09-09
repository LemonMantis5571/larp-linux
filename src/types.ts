export type Skin = 'hyprland' | 'gnome' | 'kde'
export type RiceId = 'default' | 'viegphunt' | 'mocha-alt'
export type ExportPreset = 'story' | 'square' | 'wide'
export type Phase = 'landing' | 'setup' | 'stage'

export type Identity = {
  displayName: string
  username: string
  hostname: string
  cpu: string
  gpu: string
  wm: string
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
  openApps: Array<'terminal' | 'browser' | 'files'>
  /** Wallpaper picker overlay (ViegPhunt / packs with walls) */
  showWallPicker?: boolean
}
