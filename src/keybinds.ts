export type KeybindEntry = {
  keys: string
  action: string
}

/**
 * Prefer Ctrl over Super on Windows — Win+Space / Win+D / Win+1 are OS-owned
 * and never reach the page.
 */
export const KEYBINDS: KeybindEntry[] = [
  { keys: 'Ctrl+1…4', action: 'Switch workspace' },
  { keys: 'Click WS', action: 'Switch workspace (bar)' },
  { keys: 'Ctrl+Space', action: 'Open launcher' },
  { keys: 'Ctrl+;', action: 'Open launcher (alt)' },
  { keys: 'Ctrl+Shift+W', action: 'Wallpaper picker' },
  { keys: 'Alt+← / →', action: 'Cycle wallpaper in pack' },
  { keys: 'Ctrl+/  or  ?', action: 'Keybind overlay' },
  { keys: 'H', action: 'Toggle export bar (not in record mode)' },
  { keys: 'E', action: 'Export PNG, last preset. Works with the bar hidden' },
  { keys: 'R', action: 'Toggle record mode' },
  { keys: 'Esc', action: 'Close overlay / exit record mode' },
  { keys: 'M', action: 'Play / pause fake MPRIS' },
  { keys: 'L', action: 'Toggle lyrics overlay' },
  { keys: 'Click cava / play', action: 'Play or pause fake MPRIS' },
  { keys: 'Click mpris / media', action: 'Open lyrics overlay' },
  { keys: 'Type in terminal', action: 'Fake shell (clear, neofetch, ls…)' },
]

export function isTypingTarget(el: EventTarget | null): boolean {
  const tag = (el as HTMLElement | null)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if ((el as HTMLElement | null)?.isContentEditable) return true
  return false
}

export function isSuper(e: KeyboardEvent): boolean {
  return e.metaKey || e.getModifierState?.('OS') === true
}

/** Mod chord that works in browser on Windows (Ctrl), still accepts Super. */
export function isMod(e: KeyboardEvent): boolean {
  return e.ctrlKey || isSuper(e)
}
