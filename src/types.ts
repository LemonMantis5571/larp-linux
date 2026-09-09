export type Skin = 'hyprland' | 'gnome' | 'kde'
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
  identity: Identity
  wallpaper: string
  accent: string
  dotsText: string
  dotsNote: string
  openApps: Array<'terminal' | 'browser' | 'files'>
}
