/** Visual-only rice packs. Never execute real configs. */

import type { RiceId, Skin } from './types'
import { ALL_DOTFILE_WALLS, END4_WALLS, EXTRA_LOCAL, wallpaperUrl, viegLocal } from './wallpapers'

export type { RiceId }

export type ChromeKind = 'plain' | 'vieg' | 'haku' | 'end4' | 'hypr' | 'gnome' | 'kde'
export type HyprVariant = 'hyde' | 'tokyo' | 'nord'

export type RicePack = {
  id: RiceId
  label: string
  skin: Skin
  chrome: ChromeKind
  hyprVariant?: HyprVariant
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
const walls = uniq([...viegLocal, ...END4_WALLS, ...EXTRA_LOCAL, ...ALL_DOTFILE_WALLS])

export const RICES: Record<RiceId, RicePack> = {
  default: {
    id: 'default',
    label: 'Default Hypr',
    skin: 'hyprland',
    chrome: 'plain',
    className: '',
    credit: '',
    accent: '#89b4fa',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls,
    border: '#89b4fa',
    dotsSample: '',
    terminal: 'kitty',
  },
  viegphunt: {
    id: 'viegphunt',
    label: 'ViegPhunt (Arch-Hyprland)',
    skin: 'hyprland',
    chrome: 'vieg',
    className: 'rice-viegphunt',
    credit: 'Walls: ViegPhunt/Wallpaper-Collection (all 8). Visual LARP only.',
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
  'mocha-alt': {
    id: 'mocha-alt',
    label: 'Mocha Alt (LARP pack)',
    skin: 'hyprland',
    chrome: 'vieg',
    className: 'rice-viegphunt rice-mocha-alt',
    credit: 'Same real wall collection, blue accent',
    accent: '#89b4fa',
    wallpaper: wallpaperUrl('sea-horizon-sky.jpg'),
    walls: uniq([...viegLocal, ...ALL_DOTFILE_WALLS]),
    border: '#89b4fa',
    dotsSample: `/* Mocha Alt */\n@define-color blue #89b4fa\n`,
    terminal: 'ghostty',
  },
  hakuspace: {
    id: 'hakuspace',
    label: 'Hakuspace',
    skin: 'hyprland',
    chrome: 'haku',
    className: 'rice-hakuspace',
    credit:
      'Hakuspace has no in-repo walls (~/Pictures only). Using Vieg collection + end4 default.',
    accent: '#E8DCC8',
    wallpaper: wallpaperUrl('kita.png'),
    walls: uniq([...ALL_DOTFILE_WALLS]),
    border: '#E8DCC8',
    dotsSample: `/* Hakuspace LARP */\n@define-color accent_color #E8DCC8\n`,
    terminal: 'kitty',
  },
  end4: {
    id: 'end4',
    label: 'end4-pC (Material 3)',
    skin: 'hyprland',
    chrome: 'end4',
    className: 'rice-end4',
    credit: 'end4 default wallpaper + shared real wall collection',
    accent: '#cbc4cb',
    wallpaper: END4_WALLS[0],
    walls: uniq([...END4_WALLS, ...viegLocal, ...EXTRA_LOCAL]),
    border: '#cbc4cb',
    dotsSample: `/* end4-pC M3 */\nm3primary=#cbc4cb\nm3background=#141313\n`,
    terminal: 'kitty',
  },
  hyde: {
    id: 'hyde',
    label: 'HyDE',
    skin: 'hyprland',
    chrome: 'hypr',
    hyprVariant: 'hyde',
    className: 'rice-hyde',
    credit: 'Visual LARP of HyDE-Project/HyDE (formerly prasanthrangan/hyprdots). Colors only.',
    accent: '#00bbd4',
    wallpaper: wallpaperUrl('bridge-sea-middle-mountains.jpg'),
    walls,
    border: '#00bbd4',
    dotsSample: `/* HyDE LARP */\n$accent = #00bbd4\ncol.active_border = rgba(00bbd4ee)\n`,
    terminal: 'kitty',
  },
  'tokyo-hypr': {
    id: 'tokyo-hypr',
    label: 'Tokyo Night Hypr',
    skin: 'hyprland',
    chrome: 'hypr',
    hyprVariant: 'tokyo',
    className: 'rice-tokyo-hypr',
    credit: 'Tokyo Night palette (enkia/tokyo-night). Visual LARP, not a full dots port.',
    accent: '#7aa2f7',
    wallpaper: wallpaperUrl('black-and-white-anime-bartender-girl.png'),
    walls,
    border: '#7aa2f7',
    dotsSample: `/* Tokyo Night Hypr LARP */\n$accent = #7aa2f7\n$bg = #1a1b26\n`,
    terminal: 'kitty',
  },
  'nord-hypr': {
    id: 'nord-hypr',
    label: 'Nord Hypr',
    skin: 'hyprland',
    chrome: 'hypr',
    hyprVariant: 'nord',
    className: 'rice-nord-hypr',
    credit: 'Nord palette (nordtheme/nord). Visual LARP, not a full dots port.',
    accent: '#88c0d0',
    wallpaper: wallpaperUrl('snow-covered-mountains-northern-india.jpg'),
    walls,
    border: '#88c0d0',
    dotsSample: `/* Nord Hypr LARP */\n$accent = #88c0d0\n$bg = #2e3440\n`,
    terminal: 'kitty',
  },
  'gnome-adwaita': {
    id: 'gnome-adwaita',
    label: 'GNOME Adwaita',
    skin: 'gnome',
    chrome: 'gnome',
    className: 'rice-gnome rice-gnome-adwaita',
    credit: 'Stock Adwaita Dark look. GNOME Shell chrome only, visual LARP.',
    accent: '#3584e4',
    wallpaper: wallpaperUrl('sea-horizon-sky.jpg'),
    walls,
    border: '#3584e4',
    dotsSample: `/* Adwaita Dark */\naccent_color=#3584e4\n`,
    terminal: 'kgx',
  },
  'gnome-catppuccin': {
    id: 'gnome-catppuccin',
    label: 'GNOME Catppuccin',
    skin: 'gnome',
    chrome: 'gnome',
    className: 'rice-gnome rice-gnome-catppuccin',
    credit: 'Catppuccin Mocha on GNOME (catppuccin/gtk). Colors only.',
    accent: '#cba6f7',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls,
    border: '#cba6f7',
    dotsSample: `/* Catppuccin Mocha GTK */\naccent_color=#cba6f7\n`,
    terminal: 'kgx',
  },
  'gnome-tokyonight': {
    id: 'gnome-tokyonight',
    label: 'GNOME Tokyo Night',
    skin: 'gnome',
    chrome: 'gnome',
    className: 'rice-gnome rice-gnome-tokyonight',
    credit: 'Tokyo Night GTK look (Fausto-Korpsvart/Tokyo-Night-GTK-Theme). Colors only.',
    accent: '#7aa2f7',
    wallpaper: wallpaperUrl('fishing.jpg'),
    walls,
    border: '#7aa2f7',
    dotsSample: `/* Tokyo Night GTK */\naccent_color=#7aa2f7\n`,
    terminal: 'kgx',
  },
  'gnome-nord': {
    id: 'gnome-nord',
    label: 'GNOME Nord',
    skin: 'gnome',
    chrome: 'gnome',
    className: 'rice-gnome rice-gnome-nord',
    credit: 'Nord on GNOME Shell. Palette from nordtheme/nord.',
    accent: '#88c0d0',
    wallpaper: wallpaperUrl('snow-covered-mountains-northern-india.jpg'),
    walls,
    border: '#88c0d0',
    dotsSample: `/* Nord GNOME */\naccent_color=#88c0d0\n`,
    terminal: 'kgx',
  },
  'gnome-graphite': {
    id: 'gnome-graphite',
    label: 'GNOME Graphite',
    skin: 'gnome',
    chrome: 'gnome',
    className: 'rice-gnome rice-gnome-graphite',
    credit: 'Graphite GTK look (vinceliuice/Graphite-gtk-theme). Colors only.',
    accent: '#6c8eef',
    wallpaper: wallpaperUrl('bridge-sea-middle-mountains.jpg'),
    walls,
    border: '#6c8eef',
    dotsSample: `/* Graphite GTK */\naccent_color=#6c8eef\n`,
    terminal: 'kgx',
  },
  'kde-breeze': {
    id: 'kde-breeze',
    label: 'Plasma Breeze',
    skin: 'kde',
    chrome: 'kde',
    className: 'rice-kde rice-kde-breeze',
    credit: 'Stock Breeze Dark panel. Plasma chrome only, visual LARP.',
    accent: '#3daee9',
    wallpaper: wallpaperUrl('sea-horizon-sky.jpg'),
    walls,
    border: '#3daee9',
    dotsSample: `/* Breeze Dark */\nAccentColor=#3daee9\n`,
    terminal: 'konsole',
  },
  'kde-sweet': {
    id: 'kde-sweet',
    label: 'Plasma Sweet',
    skin: 'kde',
    chrome: 'kde',
    className: 'rice-kde rice-kde-sweet',
    credit: 'Sweet look (EliverLara/Sweet). Colors only.',
    accent: '#c74dca',
    wallpaper: wallpaperUrl('kita.png'),
    walls,
    border: '#c74dca',
    dotsSample: `/* Sweet Plasma */\nAccentColor=#c74dca\n`,
    terminal: 'konsole',
  },
  'kde-nordic': {
    id: 'kde-nordic',
    label: 'Plasma Nordic',
    skin: 'kde',
    chrome: 'kde',
    className: 'rice-kde rice-kde-nordic',
    credit: 'Nordic / Nord Plasma look. Palette from nordtheme/nord.',
    accent: '#88c0d0',
    wallpaper: wallpaperUrl('snow-covered-mountains-northern-india.jpg'),
    walls,
    border: '#88c0d0',
    dotsSample: `/* Nordic Plasma */\nAccentColor=#88c0d0\n`,
    terminal: 'konsole',
  },
  'kde-catppuccin': {
    id: 'kde-catppuccin',
    label: 'Plasma Catppuccin',
    skin: 'kde',
    chrome: 'kde',
    className: 'rice-kde rice-kde-catppuccin',
    credit: 'Catppuccin Mocha for Plasma (catppuccin/kde). Colors only.',
    accent: '#cba6f7',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls,
    border: '#cba6f7',
    dotsSample: `/* Catppuccin Plasma */\nAccentColor=#cba6f7\n`,
    terminal: 'konsole',
  },
  'kde-layan': {
    id: 'kde-layan',
    label: 'Plasma Layan',
    skin: 'kde',
    chrome: 'kde',
    className: 'rice-kde rice-kde-layan',
    credit: 'Layan look (vinceliuice/Layan-kde). Colors only.',
    accent: '#5654d1',
    wallpaper: wallpaperUrl('deep-forest-with-wooden-stairs.png'),
    walls,
    border: '#5654d1',
    dotsSample: `/* Layan Plasma */\nAccentColor=#5654d1\n`,
    terminal: 'konsole',
  },
}

export function riceById(id: RiceId): RicePack {
  return RICES[id] ?? RICES.default
}

export function isRiceId(value: string): value is RiceId {
  return Object.prototype.hasOwnProperty.call(RICES, value)
}

export function ricesForSkin(skin: Skin): RicePack[] {
  return (Object.values(RICES) as RicePack[]).filter((r) => r.skin === skin)
}

export function firstRiceForSkin(skin: Skin): RicePack {
  return ricesForSkin(skin)[0] ?? RICES.default
}

export const SKIN_ORDER: Skin[] = ['hyprland', 'gnome', 'kde']

export const SKIN_LABEL: Record<Skin, string> = {
  hyprland: 'Hyprland',
  gnome: 'GNOME',
  kde: 'KDE Plasma',
}

export type BootEntry =
  | { kind: 'os'; rice: RiceId; label: string; hint: string }
  | { kind: 'firmware'; label: string; hint: string }

export const BOOT_ENTRIES: BootEntry[] = [
  { kind: 'os', rice: 'default', label: 'Arch Linux', hint: 'Hyprland' },
  { kind: 'os', rice: 'viegphunt', label: 'Arch Linux (ViegPhunt)', hint: 'Catppuccin waybar' },
  { kind: 'os', rice: 'mocha-alt', label: 'Arch Linux (Mocha Alt)', hint: 'Hyprland' },
  { kind: 'os', rice: 'hakuspace', label: 'Arch Linux (Hakuspace)', hint: 'island bar' },
  { kind: 'os', rice: 'end4', label: 'Arch Linux (end4-pC)', hint: 'Material 3' },
  { kind: 'os', rice: 'hyde', label: 'Arch Linux (HyDE)', hint: 'hyprdots' },
  { kind: 'os', rice: 'tokyo-hypr', label: 'Arch Linux (Tokyo Night)', hint: 'Hyprland' },
  { kind: 'os', rice: 'nord-hypr', label: 'Arch Linux (Nord)', hint: 'Hyprland' },
  { kind: 'os', rice: 'gnome-adwaita', label: 'GNOME', hint: 'Adwaita Dark' },
  { kind: 'os', rice: 'gnome-catppuccin', label: 'GNOME (Catppuccin)', hint: 'Mocha' },
  { kind: 'os', rice: 'gnome-tokyonight', label: 'GNOME (Tokyo Night)', hint: 'GTK' },
  { kind: 'os', rice: 'gnome-nord', label: 'GNOME (Nord)', hint: 'frost' },
  { kind: 'os', rice: 'gnome-graphite', label: 'GNOME (Graphite)', hint: 'GTK' },
  { kind: 'os', rice: 'kde-breeze', label: 'KDE Plasma', hint: 'Breeze Dark' },
  { kind: 'os', rice: 'kde-sweet', label: 'KDE Plasma (Sweet)', hint: 'candy' },
  { kind: 'os', rice: 'kde-nordic', label: 'KDE Plasma (Nordic)', hint: 'frost' },
  { kind: 'os', rice: 'kde-catppuccin', label: 'KDE Plasma (Catppuccin)', hint: 'Mocha' },
  { kind: 'os', rice: 'kde-layan', label: 'KDE Plasma (Layan)', hint: 'purple' },
  { kind: 'firmware', label: 'UEFI Firmware Settings', hint: 'setup' },
]
