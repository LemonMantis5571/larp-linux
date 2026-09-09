/** Best-effort extract of colors from Arch-ish dotfile text. Never executes configs. */
export function parseDots(text: string): { accent?: string; wallpaper?: string; note: string } {
  if (!text.trim()) return { note: '' }
  const hex = text.match(/#([0-9a-fA-F]{6})\b/g) || []
  const prefer =
    hex.find((h) => /pink\s+#/i.test(text) && /#f5c2e7/i.test(h)) ||
    hex.find((h) => /^#(f5c2e7|cba6f7|89b4fa)$/i.test(h)) ||
    hex.find((h) => !/^#(000000|ffffff|FFFFFF|0{6}|1e1e2e|cdd6f4)$/i.test(h))
  const wall =
    text.match(/wallpaper\s*=\s*([^\s]+)/i)?.[1] ||
    text.match(/https?:\/\/[^\s)]+\.(?:png|jpe?g|webp)/i)?.[0]
  const hits = [prefer && 'accent', wall && 'wallpaper'].filter(Boolean)
  return {
    accent: prefer || undefined,
    wallpaper: wall?.startsWith('http') ? wall : undefined,
    note: hits.length
      ? `Best-effort rice: mapped ${hits.join(', ')}. Configs are not executed.`
      : 'Best-effort rice: no colors found. Paste hyprland/waybar colors if you have them.',
  }
}
