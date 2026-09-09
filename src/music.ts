/** Fake MPRIS + lyrics for LARP only. No player, no network lyrics fetch. */

export type LarpTrack = {
  title: string
  artist: string
  album: string
  lyrics: string[]
  art: string
}

export const LARP_TRACKS: LarpTrack[] = [
  {
    title: 'Night Drive',
    artist: 'Glass Radio',
    album: 'After Hours',
    art: 'linear-gradient(135deg, #cba6f7, #1e1e2e 70%)',
    lyrics: [
      'streetlights smear the glass',
      'I keep the volume low',
      'city hums in leftover rain',
      'you said wait at the bridge',
      'I am still circling the block',
      'same song, third time tonight',
      'engine ticks, I do not go home',
    ],
  },
  {
    title: 'Kita',
    artist: 'Stage Left',
    album: 'Live Tape',
    art: 'linear-gradient(160deg, #f38ba8, #fab387 40%, #1e1e2e)',
    lyrics: [
      'count in, miss the one',
      'amp buzz fills the room',
      'pink hair in the cheap lights',
      'we play it like we mean it',
      'chorus hits, someone cheers',
      'I forget the next verse',
      'smile anyway, keep the beat',
    ],
  },
  {
    title: 'Sea Horizon',
    artist: 'Mist FM',
    album: 'Offshore',
    art: 'linear-gradient(200deg, #89b4fa, #94e2d5 45%, #11111b)',
    lyrics: [
      'grey water, no boats',
      'fog eats the far line',
      'I tune static for weather',
      'a voice says stay in',
      'I walk the pier anyway',
      'salt on the jacket cuff',
      'horizon never gets closer',
    ],
  },
]

export const CAVA_GLYPHS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] as const

/** hakuspace .config/cava/config_waybar sets bars = 12. */
export const CAVA_BARS = 12

export function clipTitle(title: string, max = 25): string {
  return title.length > max ? `${title.slice(0, max - 1)}…` : title
}

export function lyricSlots(track: LarpTrack, current: number, window = 7): string[] {
  const mid = Math.floor(window / 2)
  return Array.from({ length: window }, (_, i) => {
    const idx = current - mid + i
    if (idx < 0 || idx >= track.lyrics.length) return ''
    return track.lyrics[idx]
  })
}

export function nextCavaLevels(prev: number[], playing: boolean): number[] {
  return prev.map((n, i) => {
    const neighbor = prev[(i + 1) % prev.length] ?? n
    const wobble = playing ? Math.random() * 0.55 : Math.random() * 0.08
    const target = playing ? 0.25 + wobble + neighbor * 0.2 : 0.08
    return Math.max(0.05, Math.min(1, n * 0.45 + target * 0.55))
  })
}

export function cavaGlyphs(levels: number[]): string {
  return levels
    .map((n) => CAVA_GLYPHS[Math.min(CAVA_GLYPHS.length - 1, Math.floor(n * CAVA_GLYPHS.length))])
    .join('')
}
