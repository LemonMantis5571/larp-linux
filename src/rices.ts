/** Visual-only rice packs. Never execute real configs. */

import { wallpaperUrl, type WallpaperFile } from './wallpapers'

export type RiceId = 'default' | 'viegphunt' | 'mocha-alt'

export type RicePack = {
  id: RiceId
  label: string
  credit: string
  accent: string
  wallpaper: string
  /** Ordered wallpaper URLs for this pack (picker + cycle). */
  walls: string[]
  border: string
  dotsSample: string
}

const VIEG_WALLS: WallpaperFile[] = [
  'misty-seascape.jpg',
  'black-and-white-anime-bartender-girl.png',
  'bridge-sea-middle-mountains.jpg',
  'deep-forest-with-wooden-stairs.png',
  'fishing.jpg',
  'kita.png',
  'sea-horizon-sky.jpg',
  'snow-covered-mountains-northern-india.jpg',
]

const viegWallUrls = VIEG_WALLS.map((f) => wallpaperUrl(f))

export const RICES: Record<RiceId, RicePack> = {
  default: {
    id: 'default',
    label: 'Default Hypr',
    credit: '',
    accent: '#89b4fa',
    wallpaper:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    walls: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    ],
    border: '#89b4fa',
    dotsSample: '',
  },
  viegphunt: {
    id: 'viegphunt',
    label: 'ViegPhunt (Arch-Hyprland)',
    credit: 'LARP of github.com/ViegPhunt/Dotfiles — visual only, not installed',
    accent: '#f5c2e7',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls: viegWallUrls,
    border: '#cdd6f4',
    dotsSample: `/* ViegPhunt / Catppuccin Mocha — paste-only LARP sample */
@define-color background #1e1e2e;
@define-color foreground #cdd6f4;
@define-color pink       #f5c2e7;
@define-color blue       #89b4fa;
/* hypr appearance */
col.active_border = rgba(cdd6f4aa)
col.inactive_border = rgba(595959aa)
rounding = 2
border_size = 2
gaps_in = 2
gaps_out = 5
`,
  },
  'mocha-alt': {
    id: 'mocha-alt',
    label: 'Mocha Alt (LARP pack)',
    credit: 'LARP pack — Catppuccin Mocha accent alt + Vieg wall collection (not official)',
    accent: '#89b4fa',
    wallpaper: wallpaperUrl('sea-horizon-sky.jpg'),
    walls: [
      wallpaperUrl('sea-horizon-sky.jpg'),
      wallpaperUrl('fishing.jpg'),
      wallpaperUrl('kita.png'),
      wallpaperUrl('snow-covered-mountains-northern-india.jpg'),
      wallpaperUrl('bridge-sea-middle-mountains.jpg'),
      wallpaperUrl('deep-forest-with-wooden-stairs.png'),
      wallpaperUrl('misty-seascape.jpg'),
      wallpaperUrl('black-and-white-anime-bartender-girl.png'),
    ],
    border: '#89b4fa',
    dotsSample: `/* Mocha Alt LARP pack — blue accent */
@define-color background #1e1e2e;
@define-color blue       #89b4fa;
col.active_border = rgba(89b4faaa)
`,
  },
}

export function riceById(id: RiceId): RicePack {
  return RICES[id] ?? RICES.default
}
