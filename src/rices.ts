/** Visual-only rice packs. Never execute real configs. */

import { ALL_DOTFILE_WALLS, END4_WALLS, EXTRA_LOCAL, wallpaperUrl, viegLocal } from './wallpapers'

export type RiceId = 'default' | 'viegphunt' | 'mocha-alt' | 'hakuspace' | 'end4'

export type RicePack = {
  id: RiceId
  label: string
  credit: string
  accent: string
  wallpaper: string
  walls: string[]
  border: string
  dotsSample: string
}

const uniq = (xs: string[]) => [...new Set(xs)]

export const RICES: Record<RiceId, RicePack> = {
  default: {
    id: 'default',
    label: 'Default Hypr',
    credit: '',
    accent: '#89b4fa',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls: uniq([...ALL_DOTFILE_WALLS]),
    border: '#89b4fa',
    dotsSample: '',
  },
  viegphunt: {
    id: 'viegphunt',
    label: 'ViegPhunt (Arch-Hyprland)',
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
  },
  'mocha-alt': {
    id: 'mocha-alt',
    label: 'Mocha Alt (LARP pack)',
    credit: 'Same real wall collection, blue accent',
    accent: '#89b4fa',
    wallpaper: wallpaperUrl('sea-horizon-sky.jpg'),
    walls: uniq([...viegLocal, ...ALL_DOTFILE_WALLS]),
    border: '#89b4fa',
    dotsSample: `/* Mocha Alt */\n@define-color blue #89b4fa\n`,
  },
  hakuspace: {
    id: 'hakuspace',
    label: 'Hakuspace',
    credit:
      'Hakuspace has no in-repo walls (~/Pictures only). Using Vieg collection + end4 default.',
    accent: '#E8DCC8',
    wallpaper: wallpaperUrl('kita.png'),
    walls: uniq([...ALL_DOTFILE_WALLS]),
    border: '#E8DCC8',
    dotsSample: `/* Hakuspace LARP */\n@define-color accent_color #E8DCC8\n`,
  },
  end4: {
    id: 'end4',
    label: 'end4-pC (Material 3)',
    credit: 'end4 default wallpaper + shared real wall collection',
    accent: '#cbc4cb',
    wallpaper: END4_WALLS[0],
    walls: uniq([...END4_WALLS, ...viegLocal, ...EXTRA_LOCAL]),
    border: '#cbc4cb',
    dotsSample: `/* end4-pC M3 */\nm3primary=#cbc4cb\nm3background=#141313\n`,
  },
}

export function riceById(id: RiceId): RicePack {
  return RICES[id] ?? RICES.default
}

export const HYPR_RICE_IDS: RiceId[] = ['viegphunt', 'mocha-alt', 'hakuspace', 'end4']
