/** Actual wallpaper files only (no rice README screenshots). */

export const WALLPAPER_BASE =
  'https://raw.githubusercontent.com/ViegPhunt/Wallpaper-Collection/main/Wallpapers/'

/** Full ViegPhunt Wallpaper-Collection. */
export const VIEG_COLLECTION_FILES = [
  'black-and-white-anime-bartender-girl.png',
  'bridge-sea-middle-mountains.jpg',
  'deep-forest-with-wooden-stairs.png',
  'fishing.jpg',
  'kita.png',
  'misty-seascape.jpg',
  'sea-horizon-sky.jpg',
  'snow-covered-mountains-northern-india.jpg',
] as const

export type WallpaperFile = (typeof VIEG_COLLECTION_FILES)[number]

export function wallpaperUrl(file: WallpaperFile | string): string {
  if (
    file.startsWith('http://') ||
    file.startsWith('https://') ||
    file.startsWith('blob:') ||
    file.startsWith('data:') ||
    file.startsWith('/')
  ) {
    return file
  }
  return `${WALLPAPER_BASE}${file}`
}

export const viegLocal = VIEG_COLLECTION_FILES.map((f) => wallpaperUrl(f))
export const viegRaw = viegLocal

/** end4-pC ships only this real wallpaper asset. */
export const END4_WALLS = ['/walls/end4/default_wallpaper.png', '/end4-default_wallpaper.png']

export const EXTRA_LOCAL = ['/walls/lisa-blackpink-4k.jpg']

/** All real walls (Hakuspace ships none in-repo). */
export const ALL_DOTFILE_WALLS: string[] = [...viegLocal, ...END4_WALLS, ...EXTRA_LOCAL]

export const WALLPAPER_FILES = VIEG_COLLECTION_FILES

export const WALLPAPERS = VIEG_COLLECTION_FILES.map((file) => ({
  id: file,
  label: file.replace(/\.(png|jpe?g|webp)$/i, '').replace(/-/g, ' '),
  url: wallpaperUrl(file),
}))

export function cycleWallpaper(current: string, dir: 1 | -1, list: string[] = ALL_DOTFILE_WALLS): string {
  const urls = list.length ? list : ALL_DOTFILE_WALLS
  const idx = urls.indexOf(current)
  const base = idx < 0 ? 0 : idx
  return urls[(base + dir + urls.length) % urls.length]
}
