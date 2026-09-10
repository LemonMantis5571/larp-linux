import { keybindsFor } from './keybinds'

export function KeybindOverlay({
  onClose,
  inCharacter = false,
}: {
  onClose: () => void
  inCharacter?: boolean
}) {
  const rows = keybindsFor(inCharacter)
  return (
    <div
      className="keybind-overlay"
      role="dialog"
      aria-label="Keybinds"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="keybind-panel">
        <div className="keybind-head">
          <span>⌨  Keybinds</span>
          <span className="wall-hint">Super+H · ? · Esc</span>
        </div>
        <ul className="keybind-list">
          {rows.map((k) => (
            <li key={k.keys}>
              <kbd>{k.keys}</kbd>
              <span>{k.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
