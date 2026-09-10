/** Visible strings that change when the user commits to the bit. */

export const JOKE_BANNERS = [
  'LARP shell ready. Type help — configs are never executed.',
  'LARP shell ready. Type help. Configs are never executed.',
]

export function termBanner(inCharacter: boolean): string[] {
  if (inCharacter) return []
  return ['LARP shell ready. Type help. Configs are never executed.']
}

export function applyInCharacterLines(lines: string[], inCharacter: boolean): string[] {
  const stripped = lines.filter((line) => !JOKE_BANNERS.includes(line))
  if (inCharacter) return stripped
  if (stripped.length !== lines.length) return lines
  return [...termBanner(false), ...stripped]
}

export function wifiSsid(inCharacter: boolean): string {
  return inCharacter ? 'Home' : 'LARP-NET'
}

export function weatherPlace(inCharacter: boolean): string {
  return inCharacter ? 'Seattle' : 'LARP City'
}
