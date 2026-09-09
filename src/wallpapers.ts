/** Wallpaper URLs from ViegPhunt Wallpaper-Collection (visual LARP only). */

export const WALLPAPER_BASE =
  'https://raw.githubusercontent.com/ViegPhunt/Wallpaper-Collection/main/Wallpapers/'

export const WALLPAPER_FILES = [
  'black-and-white-anime-bartender-girl.png',
  'bridge-sea-middle-mountains.jpg',
  'deep-forest-with-wooden-stairs.png',
  'fishing.jpg',
  'kita.png',
  'misty-seascape.jpg',
  'sea-horizon-sky.jpg',
  'snow-covered-mountains-northern-india.jpg',
] as const

export type WallpaperFile = (typeof WALLPAPER_FILES)[number]

export function wallpaperUrl(file: WallpaperFile | string): string {
  if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('blob:')) return file
  return `${WALLPAPER_BASE}${file}`
}

export const WALLPAPERS = WALLPAPER_FILES.map((file) => ({
  id: file,
  label: file.replace(/\.(png|jpe?g|webp)$/i, '').replace(/-/g, ' '),
  url: wallpaperUrl(file),
}))

export function cycleWallpaper(current: string, dir: 1 | -1): string {
  const urls = WALLPAPERS.map((w) => w.url)
  const idx = urls.indexOf(current)
  const base = idx < 0 ? 0 : idx
  const next = (base + dir + urls.length) % urls.length
  return urls[next]
}
