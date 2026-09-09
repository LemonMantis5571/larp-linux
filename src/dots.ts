/** Best-effort extract of colors from Arch-ish dotfile text. Never executes configs. */
export function parseDots(text: string): { accent?: string; wallpaper?: string; note: string } {
  if (!text.trim()) return { note: '' }
  const hex = text.match(/#([0-9a-fA-F]{6})\b/g) || []
  const accent = hex.find((h) => !/^#(000000|ffffff|FFFFFF|0{6})$/i.test(h))
  const wall =
    text.match(/wallpaper\s*=\s*([^\s]+)/i)?.[1] ||
    text.match(/col\.(?:active|active_border)[^\n]*?(#[0-9a-fA-F]{6})/i)?.[1]
  const hits = [accent && 'accent', wall && 'hint'].filter(Boolean)
  return {
    accent: accent || undefined,
    wallpaper: wall?.startsWith('http') ? wall : undefined,
    note: hits.length
      ? `Best-effort rice: mapped ${hits.join(', ')}. Configs are not executed.`
      : 'Best-effort rice: no colors found. Paste hyprland/waybar colors if you have them.',
  }
}
