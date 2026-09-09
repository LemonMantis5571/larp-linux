/** Visual-only rice packs. Never execute real configs. */

export type RiceId = 'default' | 'viegphunt'

export type RicePack = {
  id: RiceId
  label: string
  credit: string
  accent: string
  wallpaper: string
  border: string
  dotsSample: string
}

export const RICES: Record<RiceId, RicePack> = {
  default: {
    id: 'default',
    label: 'Default Hypr',
    credit: '',
    accent: '#89b4fa',
    wallpaper:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    border: '#89b4fa',
    dotsSample: '',
  },
  viegphunt: {
    id: 'viegphunt',
    label: 'ViegPhunt (Arch-Hyprland)',
    credit: 'LARP of github.com/ViegPhunt/Dotfiles — visual only, not installed',
    accent: '#f5c2e7',
    wallpaper:
      'https://raw.githubusercontent.com/ViegPhunt/Wallpaper-Collection/main/Wallpapers/misty-seascape.jpg',
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
}

export function riceById(id: RiceId): RicePack {
  return RICES[id] ?? RICES.default
}
