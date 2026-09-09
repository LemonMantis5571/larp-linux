/** Visual-only rice packs. Never execute real configs. */

import {
  ALL_DOTFILE_WALLS,
  END4_WALLS,
  HAKU_SHOWCASE_WALLS,
  VIEG_SHOWCASE_WALLS,
  wallpaperUrl,
  viegLocal,
  EXTRA_LOCAL,
} from './wallpapers'

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
    credit:
      'Walls: full ViegPhunt/Wallpaper-Collection (8) + showcases. Visual LARP only.',
    accent: '#f5c2e7',
    wallpaper: wallpaperUrl('misty-seascape.jpg'),
    walls: uniq([...viegLocal, ...EXTRA_LOCAL, ...VIEG_SHOWCASE_WALLS, ...ALL_DOTFILE_WALLS]),
    border: '#cdd6f4',
    dotsSample: `/* ViegPhunt / Catppuccin Mocha — paste-only LARP sample */
@define-color background #1e1e2e;
@define-color foreground #cdd6f4;
@define-color pink       #f5c2e7;
col.active_border = rgba(cdd6f4aa)
rounding = 2
`,
  },
  'mocha-alt': {
    id: 'mocha-alt',
    label: 'Mocha Alt (LARP pack)',
    credit: 'Same Vieg wall collection, blue accent',
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
      'Hakuspace repo has no shipped walls (~/Pictures only). Bundled official README showcases + shared collection.',
    accent: '#E8DCC8',
    wallpaper: HAKU_SHOWCASE_WALLS[0],
    walls: uniq([...HAKU_SHOWCASE_WALLS, ...ALL_DOTFILE_WALLS]),
    border: '#E8DCC8',
    dotsSample: `/* Hakuspace LARP */\n@define-color accent_color #E8DCC8\n`,
  },
  end4: {
    id: 'end4',
    label: 'end4-pC (Material 3)',
    credit:
      'end4-pC ships default_wallpaper + README screenshots; plus shared Vieg/Haku walls.',
    accent: '#cbc4cb',
    wallpaper: END4_WALLS[0],
    walls: uniq([...END4_WALLS, ...ALL_DOTFILE_WALLS]),
    border: '#cbc4cb',
    dotsSample: `/* end4-pC M3 */\nm3primary=#cbc4cb\nm3background=#141313\n`,
  },
}

export function riceById(id: RiceId): RicePack {
  return RICES[id] ?? RICES.default
}

export const HYPR_RICE_IDS: RiceId[] = ['viegphunt', 'mocha-alt', 'hakuspace', 'end4']
