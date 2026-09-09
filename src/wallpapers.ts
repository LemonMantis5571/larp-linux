/** Wallpaper catalogs from rice/dotfile sources (visual LARP only). */

export const WALLPAPER_BASE =
  'https://raw.githubusercontent.com/ViegPhunt/Wallpaper-Collection/main/Wallpapers/'

/** Full ViegPhunt Wallpaper-Collection (every file in that repo). */
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

/** Hakuspace does not ship walls; official README showcase stills. */
export const HAKU_SHOWCASE_WALLS = [
  '/walls/haku/1e0dc63a-22ee-482a-9902-9d458bb67e35.png',
  '/walls/haku/c3ca125c-12f5-49d8-afd3-1aa68b64c8fe.png',
  '/walls/haku/8c599b1a-6947-4ce3-a511-37645a0eda5b.png',
  '/walls/haku/dd0abd39-a7e7-41dd-aaff-4f8422894622.png',
]

/** end4-pC default + README screenshots. */
export const END4_WALLS = [
  '/walls/end4/default_wallpaper.png',
  '/end4-default_wallpaper.png',
  '/walls/end4/1.png',
  '/walls/end4/2.png',
  '/walls/end4/3.png',
  '/walls/end4/4.png',
  '/walls/end4/5.png',
  '/walls/end4/6.png',
]

export const VIEG_SHOWCASE_WALLS = [
  '/walls/vieg/shot-a004c50a-4001-4596-a48e-97ecc9997843.png',
  '/walls/vieg/shot-5d59431c-de0c-487d-bc1a-ea4b2828787a.png',
  '/walls/vieg/shot-b2b0674f-4709-40d3-bfbe-9c5c5660bf3b.png',
  '/walls/vieg/shot-c55950ed-8e7b-4e10-bde3-dd445fbc388b.png',
]

export const EXTRA_LOCAL = ['/walls/lisa-blackpink-4k.jpg']

export const ALL_DOTFILE_WALLS: string[] = [
  ...viegLocal,
  ...EXTRA_LOCAL,
  ...HAKU_SHOWCASE_WALLS,
  ...END4_WALLS,
  ...VIEG_SHOWCASE_WALLS,
]

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
