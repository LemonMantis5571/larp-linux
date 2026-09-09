import { KEYBINDS } from './keybinds'

export function KeybindOverlay({ onClose }: { onClose: () => void }) {
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
          {KEYBINDS.map((k) => (
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
