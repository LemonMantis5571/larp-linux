export type KeybindEntry = {
  keys: string
  action: string
}

/** Shown in Super+H / ? overlay — visual LARP only. */
export const KEYBINDS: KeybindEntry[] = [
  { keys: 'Super+1…4', action: 'Switch workspace' },
  { keys: 'Click WS', action: 'Switch workspace (bar / dots)' },
  { keys: 'Super+Space', action: 'Open launcher (rofi-like)' },
  { keys: 'Super+D', action: 'Open launcher' },
  { keys: 'Super+W', action: 'Wallpaper picker' },
  { keys: 'Alt+← / →', action: 'Cycle wallpaper in pack' },
  { keys: 'Super+H / ?', action: 'Keybind overlay' },
  { keys: 'H', action: 'Toggle export bar (not in record mode)' },
  { keys: 'R', action: 'Toggle record mode (hide bar + peek)' },
  { keys: 'Esc', action: 'Close overlay / exit record mode' },
  { keys: 'Enter', action: 'Launch selected launcher item' },
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
