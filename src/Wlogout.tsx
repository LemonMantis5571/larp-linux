export type WlogoutAction = 'lock' | 'logout' | 'sleep' | 'reboot' | 'shutdown'

const ITEMS: { id: WlogoutAction; label: string; hint: string }[] = [
  { id: 'lock', label: 'Lock', hint: 'boot menu' },
  { id: 'logout', label: 'Logout', hint: 'setup' },
  { id: 'sleep', label: 'Sleep', hint: 'click to wake' },
  { id: 'reboot', label: 'Reboot', hint: 'same rice' },
  { id: 'shutdown', label: 'Shutdown', hint: 'power off' },
]

export function Wlogout({
  onPick,
  onClose,
}: {
  onPick: (id: WlogoutAction) => void
  onClose: () => void
}) {
  return (
    <div
      className="wlogout-overlay"
      role="dialog"
      aria-label="Power menu"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="wlogout-row">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="wlogout-btn"
            onClick={() => onPick(item.id)}
          >
            <span className="wlogout-label">{item.label}</span>
            <span className="wlogout-hint">{item.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
