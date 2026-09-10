/** Visual-only rice packs. Configs never run. */

import type { RiceId, Skin } from './types'
import { ALL_DOTFILE_WALLS, END4_WALLS, EXTRA_LOCAL, wallpaperUrl, viegLocal } from './wallpapers'

export type { RiceId }

export type ChromeKind = 'vieg' | 'haku' | 'end4' | 'gnome' | 'kde' | 'socrates'

export type RicePack = {
  id: RiceId
  label: string
  skin: Skin
  chrome: ChromeKind
  className: string
  credit: string
  accent: string
  wallpaper: string
  walls: string[]
  border: string
  dotsSample: string
  terminal: string
}

const uniq = (xs: string[]) => [...new Set(xs)]
const SHARED_WALLS = uniq([...ALL_DOTFILE_WALLS])

export function wmForSkin(skin: Skin): string {
  if (skin === 'gnome') return 'GNOME Shell'
  if (skin === 'kde') return 'KWin'
  return 'Hyprland'
}

export const SKIN_LABEL: Record<Skin, string> = {
  hyprland: 'Hyprland',
  gnome: 'GNOME',
  kde: 'KDE Plasma',
}

export const SKIN_OPTIONS: { id: Skin; label: string }[] = [
  { id: 'hyprland', label: SKIN_LABEL.hyprland },
  { id: 'gnome', label: SKIN_LABEL.gnome },
  { id: 'kde', label: SKIN_LABEL.kde },
]

export const RICES: Record<RiceId, RicePack> = {
  viegphunt: {
    id: 'viegphunt',
    label: 'ViegPhunt',
    skin: 'hyprland',
    chrome: 'vieg',
    className: 'rice-viegphunt',
    credit: 'ViegPhunt Arch-Hyprland. Catppuccin Mocha waybar.',
    accent: '#f5c2e7',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls: uniq([...viegLocal, ...EXTRA_LOCAL, ...END4_WALLS]),
    border: '#cdd6f4',
    dotsSample: `/* ViegPhunt / Catppuccin Mocha */
@define-color background #1e1e2e;
@define-color pink #f5c2e7;
col.active_border = rgba(cdd6f4aa)
rounding = 2
`,
    terminal: 'ghostty',
  },
  hakuspace: {
    id: 'hakuspace',
    label: 'Hakuspace',
    skin: 'hyprland',
    chrome: 'haku',
    className: 'rice-hakuspace',
    credit: 'Hakuspace island bar and dock. Shared wall pile.',
    accent: '#E8DCC8',
    wallpaper: wallpaperUrl('kita.png'),
    walls: uniq([...ALL_DOTFILE_WALLS]),
    border: '#E8DCC8',
    dotsSample: `/* Hakuspace */\n@define-color accent_color #E8DCC8\n`,
    terminal: 'kitty',
  },
  end4: {
    id: 'end4',
    label: 'end4-pC',
    skin: 'hyprland',
    chrome: 'end4',
    className: 'rice-end4',
    credit: 'end4-pC Material 3 bar. Default wall plus the pile.',
    accent: '#cbc4cb',
    wallpaper: END4_WALLS[0],
    walls: uniq([...END4_WALLS, ...viegLocal, ...EXTRA_LOCAL]),
    border: '#cbc4cb',
    dotsSample: `/* end4-pC M3 */\nm3primary=#cbc4cb\nm3background=#141313\n`,
    terminal: 'kitty',
  },
  'gnome-amethyst': {
    id: 'gnome-amethyst',
    label: 'Amethyst',
    skin: 'gnome',
    chrome: 'gnome',
    className: 'rice-gnome-amethyst',
    credit: 'Aevstiel/amethyst. Catppuccin Mocha gnome-shell plus Dash to Dock.',
    accent: '#cba6f7',
    wallpaper: wallpaperUrl('black-and-white-anime-bartender-girl.png'),
    walls: SHARED_WALLS,
    border: '#cba6f7',
    dotsSample: `/* Aevstiel/amethyst Catppuccin Mocha */
#panel { height: 35px; background-color: rgba(30, 30, 46, 0.85); }
accent = #cba6f7
`,
    terminal: 'gnome-console',
  },
  'gnome-sweet': {
    id: 'gnome-sweet',
    label: 'Sweet',
    skin: 'gnome',
    chrome: 'gnome',
    className: 'rice-gnome-sweet',
    credit: 'EliverLara/Sweet gnome-shell. Candy teal on #222e39.',
    accent: '#00e8b7',
    wallpaper: wallpaperUrl('sea-horizon-sky.jpg'),
    walls: SHARED_WALLS,
    border: '#00e8b7',
    dotsSample: `/* EliverLara/Sweet */
#panel { background-color: rgba(34, 46, 57, 0.95); }
accent = #00e8b7
`,
    terminal: 'gnome-terminal',
  },
  'kde-socrates': {
    id: 'kde-socrates',
    label: 'Socrates',
    skin: 'kde',
    chrome: 'socrates',
    className: 'rice-kde-socrates',
    credit: 'prudhvibungatavula/socrates-KDE. Waybar on Plasma Wayland.',
    accent: '#61afef',
    wallpaper: wallpaperUrl('snow-covered-mountains-northern-india.jpg'),
    walls: SHARED_WALLS,
    border: '#56b6c2',
    dotsSample: `/* socrates-KDE waybar */
window#waybar { background: #282c34; border: 3px solid #61afef; }
height = 48
`,
    terminal: 'konsole',
  },
  'kde-catppuccin': {
    id: 'kde-catppuccin',
    label: 'Catppuccin Plasma',
    skin: 'kde',
    chrome: 'kde',
    className: 'rice-kde-catppuccin',
    credit: 'catppuccin/kde Mocha Mauve. Breeze panel, kickoff, tasks.',
    accent: '#cba6f7',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls: SHARED_WALLS,
    border: '#cba6f7',
    dotsSample: `/* catppuccin/kde CatppuccinMochaMauve */
[Colors:Header] BackgroundNormal=24,24,37
[Colors:Selection] BackgroundNormal=203,166,247
[WM] activeBackground=30,30,46
`,
    terminal: 'konsole',
  },
}

export const RICE_LIST: RicePack[] = [
  RICES.viegphunt,
  RICES.hakuspace,
  RICES.end4,
  RICES['gnome-amethyst'],
  RICES['gnome-sweet'],
  RICES['kde-socrates'],
  RICES['kde-catppuccin'],
]

export function riceById(id: RiceId): RicePack {
  return RICES[id]
}

export function isRiceId(value: string): value is RiceId {
  return value in RICES
}

export type BootEntry =
  | { kind: 'heading'; label: string }
  | { kind: 'os'; rice: RiceId; label: string; hint: string }
  | { kind: 'firmware'; label: string; hint: string }

const BOOT_HINT: Record<RiceId, string> = {
  viegphunt: 'Catppuccin waybar',
  hakuspace: 'island bar',
  end4: 'Material 3',
  'gnome-amethyst': 'Mocha',
  'gnome-sweet': 'candy',
  'kde-socrates': 'waybar',
  'kde-catppuccin': 'Mocha Mauve',
}

export const BOOT_ENTRIES: BootEntry[] = (() => {
  const entries: BootEntry[] = []
  let lastSkin: Skin | undefined
  for (const rice of RICE_LIST) {
    if (rice.skin !== lastSkin) {
      entries.push({ kind: 'heading', label: SKIN_LABEL[rice.skin] })
      lastSkin = rice.skin
    }
    entries.push({
      kind: 'os',
      rice: rice.id,
      label: `Arch Linux (${rice.label})`,
      hint: BOOT_HINT[rice.id],
    })
  }
  entries.push({ kind: 'firmware', label: 'UEFI Firmware Settings', hint: 'setup' })
  return entries
})()

export function bootEntrySelectable(entry: BootEntry): boolean {
  return entry.kind !== 'heading'
}

export function firstBootIndex(): number {
  const i = BOOT_ENTRIES.findIndex(bootEntrySelectable)
  return i < 0 ? 0 : i
}

export function lastBootIndex(): number {
  for (let i = BOOT_ENTRIES.length - 1; i >= 0; i--) {
    const entry = BOOT_ENTRIES[i]
    if (entry && bootEntrySelectable(entry)) return i
  }
  return 0
}

export function stepBootIndex(from: number, dir: 1 | -1): number {
  let i = from + dir
  while (i >= 0 && i < BOOT_ENTRIES.length) {
    const entry = BOOT_ENTRIES[i]
    if (entry && bootEntrySelectable(entry)) return i
    i += dir
  }
  return from
}
