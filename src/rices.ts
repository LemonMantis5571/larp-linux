/** Visual-only rice packs. Never execute real configs. */

import { wallpaperUrl, type WallpaperFile } from './wallpapers'

export type RiceId = 'default' | 'viegphunt' | 'mocha-alt' | 'hakuspace' | 'end4'

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

const END4_DEFAULT_LOCAL = '/end4-default_wallpaper.png'
const END4_DEFAULT_GH =
  'https://raw.githubusercontent.com/pctrade/end4-pC/main/assets/images/default_wallpaper.png'
const UNSplash_ANIME =
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80'
const UNSplash_ABSTRACT =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80'
const UNSplash_WARM1 =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80'
const UNSplash_WARM2 =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80'
const UNSplash_WARM3 =
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80'

export const RICES: Record<RiceId, RicePack> = {
  default: {
    id: 'default',
    label: 'Default Hypr',
    credit: '',
    accent: '#89b4fa',
    wallpaper: UNSplash_ABSTRACT,
    walls: [UNSplash_ABSTRACT],
    border: '#89b4fa',
    dotsSample: '',
  },
  viegphunt: {
    id: 'viegphunt',
    label: 'ViegPhunt (Arch-Hyprland)',
    credit: 'LARP of github.com/ViegPhunt/Dotfiles — visual only, not installed',
    accent: '#f5c2e7',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls: [...viegWallUrls, '/walls/lisa-blackpink-4k.jpg'],
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
  hakuspace: {
    id: 'hakuspace',
    label: 'Hakuspace',
    credit: 'LARP of github.com/hakuimaku/hakuspace — visual only, not installed',
    accent: '#E8DCC8',
    wallpaper: END4_DEFAULT_LOCAL,
    walls: [
      END4_DEFAULT_LOCAL,
      END4_DEFAULT_GH,
      UNSplash_ANIME,
      UNSplash_ABSTRACT,
      wallpaperUrl('misty-seascape.jpg'),
    ],
    border: '#E8DCC8',
    dotsSample: `/* Hakuspace LARP — cream accent islands */
@define-color accent_color #E8DCC8;
/* waybar islands: rgba(0,0,0,0.8); rounding bottoms 30px */
rounding = 16
`,
  },
  end4: {
    id: 'end4',
    label: 'end4-pC (Material 3)',
    credit: 'LARP of github.com/pctrade/end4-pC (illogical-impulse) — visual only, not installed',
    accent: '#cbc4cb',
    wallpaper: END4_DEFAULT_LOCAL,
    walls: [END4_DEFAULT_LOCAL, END4_DEFAULT_GH, UNSplash_WARM1, UNSplash_WARM2, UNSplash_WARM3],
    border: '#cbc4cb',
    dotsSample: `/* end4-pC Material 3 LARP */
m3primary=#cbc4cb
m3background=#141313
m3surfaceContainer=#201f20
m3onBackground=#e6e1e1
rounding = 24
`,
  },
}

export function riceById(id: RiceId): RicePack {
  return RICES[id] ?? RICES.default
}

/** Packs that force Hyprland skin when selected. */
export const HYPR_RICE_IDS: RiceId[] = ['viegphunt', 'mocha-alt', 'hakuspace', 'end4']
