import type { AppId, Skin } from './types'

export type AppIconKind = 'firefox' | 'kitty' | 'files' | 'dolphin'

const FIREFOX = '/icons/apps/firefox.svg'
const KITTY = '/icons/apps/kitty.svg'
const FILES = '/icons/apps/files-nautilus.svg'
const DOLPHIN = '/icons/apps/files-dolphin.svg'

export function appIconSrc(kind: AppIconKind): string {
  if (kind === 'firefox') return FIREFOX
  if (kind === 'kitty') return KITTY
  if (kind === 'dolphin') return DOLPHIN
  return FILES
}

export function appIconKind({ app, skin }: { app: AppId; skin: Skin }): AppIconKind {
  if (app === 'browser') return 'firefox'
  if (app === 'terminal') return 'kitty'
  if (skin === 'kde') return 'dolphin'
  return 'files'
}

export function appLabel({ app, skin }: { app: AppId; skin: Skin }): string {
  if (app === 'browser') return 'Firefox'
  if (app === 'terminal') {
    if (skin === 'gnome') return 'Console'
    if (skin === 'kde') return 'Konsole'
    return 'Kitty'
  }
  if (skin === 'gnome') return 'Files'
  if (skin === 'kde') return 'Dolphin'
  return 'Thunar'
}
