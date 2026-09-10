import { useEffect, useState } from 'react'
import {
  BOOT_ENTRIES,
  firstBootIndex,
  lastBootIndex,
  stepBootIndex,
  type BootEntry,
} from './rices'
import type { RiceId } from './types'
import './limine.css'

export function LimineLanding({
  onBoot,
  onSetup,
  onEdit,
}: {
  onBoot: (id: RiceId) => void
  onSetup: () => void
  onEdit: (id: RiceId) => void
}) {
  const [index, setIndex] = useState(firstBootIndex)
  const selected = BOOT_ENTRIES[index] ?? BOOT_ENTRIES[firstBootIndex()]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIndex((i) => stepBootIndex(i, 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIndex((i) => stepBootIndex(i, -1))
        return
      }
      if (e.key === 'Home') {
        e.preventDefault()
        setIndex(firstBootIndex())
        return
      }
      if (e.key === 'End') {
        e.preventDefault()
        setIndex(lastBootIndex())
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (selected) activate(selected, 'boot')
        return
      }
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        if (selected) activate(selected, 'edit')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  function activate(entry: BootEntry, mode: 'boot' | 'edit') {
    if (entry.kind === 'heading') return
    if (entry.kind === 'firmware') {
      onSetup()
      return
    }
    if (mode === 'edit') onEdit(entry.rice)
    else onBoot(entry.rice)
  }

  return (
    <div className="limine">
      <div className="limine-grain" aria-hidden />
      <div className="limine-vignette" aria-hidden />
      <svg className="limine-mark" viewBox="0 0 100 100" aria-hidden>
        <path d="M50 6L94 96H78.5L50 34 21.5 96H6L50 6zm-9 62h18L50 46 41 68z" />
      </svg>

      <div className="limine-term">
        <header className="limine-brand">
          <p className="limine-product">LARP Linux</p>
          <p className="limine-bootloader">Limine 9.x</p>
        </header>

        <ul className="limine-list" role="listbox" aria-label="Boot entries">
          {BOOT_ENTRIES.map((entry, i) => {
            if (entry.kind === 'heading') {
              return (
                <li key={`heading-${entry.label}`} className="limine-heading" role="presentation">
                  {entry.label}
                </li>
              )
            }
            const active = i === index
            const key = entry.kind === 'firmware' ? 'firmware' : entry.rice
            return (
              <li key={key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`limine-entry${active ? ' selected' : ''}${entry.kind === 'firmware' ? ' firmware' : ''}`}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => activate(entry, 'boot')}
                >
                  <span className="limine-label">{entry.label}</span>
                  <span className="limine-hint">{entry.hint}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <footer className="limine-help">
          <p>
            Use the <kbd>↑</kbd> and <kbd>↓</kbd> keys to select which entry is highlighted.
          </p>
          <p>
            Press <kbd>enter</kbd> to boot, <kbd>e</kbd> to edit before boot.
          </p>
          <p className="limine-timeout">timeout: disabled · you are not installing Arch</p>
          <button type="button" className="limine-firmware" onClick={onSetup}>
            UEFI Firmware Settings
          </button>
        </footer>
      </div>
    </div>
  )
}
