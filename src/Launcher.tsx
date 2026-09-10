import { useEffect, useMemo, useRef, useState } from 'react'

export type LauncherAction =
  | 'terminal'
  | 'browser'
  | 'files'
  | 'walls'
  | 'keybinds'
  | 'settings'

export type LauncherItem = {
  id: LauncherAction
  label: string
  hint: string
}

const ITEMS: LauncherItem[] = [
  { id: 'terminal', label: 'Terminal', hint: 'Open fake terminal' },
  { id: 'browser', label: 'Browser', hint: 'Open Firefox LARP' },
  { id: 'files', label: 'Files', hint: 'Open file manager' },
  { id: 'walls', label: 'Walls', hint: 'Wallpaper picker' },
  { id: 'keybinds', label: 'Keybinds', hint: 'Show keybind overlay' },
  { id: 'settings', label: 'Settings', hint: 'Back to phase setup' },
]

const IN_CHARACTER_ITEMS: LauncherItem[] = [
  { id: 'terminal', label: 'Terminal', hint: 'Open terminal' },
  { id: 'browser', label: 'Firefox', hint: 'Open Firefox' },
  { id: 'files', label: 'Files', hint: 'Open file manager' },
  { id: 'walls', label: 'Walls', hint: 'Wallpaper picker' },
  { id: 'keybinds', label: 'Keybinds', hint: 'Show keybinds' },
  { id: 'settings', label: 'Settings', hint: 'Settings' },
]

export function Launcher({
  riceClass,
  onLaunch,
  onClose,
  inCharacter = false,
}: {
  riceClass: string
  onLaunch: (id: LauncherAction) => void
  onClose: () => void
  inCharacter?: boolean
}) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const catalog = inCharacter ? IN_CHARACTER_ITEMS : ITEMS
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q) || i.id.includes(q),
    )
  }, [query, catalog])

  useEffect(() => {
    setIndex(0)
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIndex((i) => Math.max(i - 1, 0))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = filtered[index]
        if (item) onLaunch(item.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filtered, index, onClose, onLaunch])

  return (
    <div
      className={`launcher-overlay${riceClass}`}
      role="dialog"
      aria-label="Launcher"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="launcher-panel">
        <input
          ref={inputRef}
          className="launcher-input"
          placeholder="Search apps…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter launcher"
        />
        <ul className="launcher-list">
          {filtered.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={`launcher-item${i === index ? ' active' : ''}`}
                onMouseEnter={() => setIndex(i)}
                onClick={() => onLaunch(item.id)}
              >
                <span className="launcher-label">{item.label}</span>
                <span className="launcher-hint">{item.hint}</span>
              </button>
            </li>
          ))}
          {!filtered.length && <li className="launcher-empty">No matches</li>}
        </ul>
      </div>
    </div>
  )
}
