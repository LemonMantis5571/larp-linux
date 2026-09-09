import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { parseDots } from './dots'
import { RICES, riceById, type RiceId } from './rices'
import type { AppState, ExportPreset, Identity, Skin } from './types'
import './App.css'

const DEFAULT_WALL = RICES.default.wallpaper

const defaultIdentity: Identity = {
  displayName: 'larper',
  username: 'arch',
  hostname: 'btw',
  cpu: 'AMD Ryzen 9 7950X',
  gpu: 'NVIDIA RTX 4090',
  wm: 'Hyprland',
}

const skinWm: Record<Skin, string> = {
  hyprland: 'Hyprland',
  gnome: 'GNOME Shell',
  kde: 'KWin (Plasma)',
}

function clockNow(vieg: boolean) {
  if (!vieg) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const d = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${days[d.getDay()]} ${dd}/${mm}/${yyyy} ~ ${hh}:${mi}`
}

export default function App() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [state, setState] = useState<AppState>({
    phase: 'landing',
    skin: 'hyprland',
    rice: 'default',
    identity: defaultIdentity,
    wallpaper: DEFAULT_WALL,
    accent: '#89b4fa',
    border: '#89b4fa',
    dotsText: '',
    dotsNote: '',
    openApps: ['terminal'],
  })
  const [clock, setClock] = useState(() => clockNow(false))

  const isVieg = state.rice === 'viegphunt' && state.skin === 'hyprland'

  useEffect(() => {
    const t = setInterval(() => setClock(clockNow(isVieg)), 1000)
    setClock(clockNow(isVieg))
    return () => clearInterval(t)
  }, [isVieg])

  useEffect(() => {
    setState((s) => ({
      ...s,
      identity: { ...s.identity, wm: skinWm[s.skin] },
    }))
  }, [state.skin])

  const neofetch = useMemo(() => {
    const i = state.identity
    return [
      `${i.username}@${i.hostname}`,
      '-----------------',
      `OS: Arch Linux x86_64`,
      `Host: LARP Linux (not real)`,
      `Kernel: 6.10.arch-larp`,
      `WM: ${i.wm}`,
      `CPU: ${i.cpu}`,
      `GPU: ${i.gpu}`,
      `Memory: 64 GiB (fake)`,
      isVieg ? 'Rice: ViegPhunt (LARP)' : '',
      '',
      'you are not installing arch.',
      'you are larping.',
    ]
      .filter(Boolean)
      .join('\n')
  }, [state.identity, isVieg])

  function applyRice(id: RiceId) {
    const pack = riceById(id)
    setState((s) => ({
      ...s,
      rice: id,
      skin: id === 'viegphunt' ? 'hyprland' : s.skin,
      accent: pack.accent,
      border: pack.border,
      wallpaper: pack.wallpaper,
      dotsText: pack.dotsSample,
      dotsNote: pack.credit || s.dotsNote,
    }))
  }

  function applyDots(text: string) {
    const parsed = parseDots(text)
    setState((s) => ({
      ...s,
      dotsText: text,
      dotsNote: parsed.note,
      accent: parsed.accent || s.accent,
      wallpaper: parsed.wallpaper || s.wallpaper,
    }))
  }

  async function exportPng(preset: ExportPreset) {
    const node = stageRef.current
    if (!node) return
    setExporting(true)
    try {
      const size =
        preset === 'story' ? { w: 1080, h: 1920 } : preset === 'square' ? { w: 1080, h: 1080 } : { w: 1920, h: 1080 }
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        width: node.clientWidth,
        height: node.clientHeight,
      })
      const img = new Image()
      await new Promise<void>((res, rej) => {
        img.onload = () => res()
        img.onerror = () => rej(new Error('img'))
        img.src = dataUrl
      })
      const canvas = document.createElement('canvas')
      canvas.width = size.w
      canvas.height = size.h
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, size.w, size.h)
      const scale = Math.max(size.w / img.width, size.h / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.drawImage(img, (size.w - dw) / 2, (size.h - dh) / 2, dw, dh)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `larp-linux-${preset}.png`
      a.click()
    } finally {
      setExporting(false)
    }
  }

  function toggleApp(app: 'terminal' | 'browser' | 'files') {
    setState((s) => ({
      ...s,
      openApps: s.openApps.includes(app) ? s.openApps.filter((x) => x !== app) : [...s.openApps, app],
    }))
  }

  if (state.phase === 'landing') {
    return (
      <div className="landing">
        <div className="landing-hero" style={{ backgroundImage: `url(${RICES.viegphunt.wallpaper})` }}>
          <div className="landing-card">
            <p className="eyebrow">LARP Linux</p>
            <h1>Fake Arch desktops for the timeline.</h1>
            <p>
              Pick Hyprland, GNOME, or KDE. One-click ViegPhunt rice (visual only). Export a PNG.
              You are not installing Arch. You are LARPing.
            </p>
            <div className="landing-actions">
              <button className="primary" onClick={() => setState((s) => ({ ...s, phase: 'setup' }))}>
                Start LARPing
              </button>
              <button
                className="primary ghost"
                onClick={() => {
                  const pack = riceById('viegphunt')
                  setState((s) => ({
                    ...s,
                    phase: 'setup',
                    rice: 'viegphunt',
                    skin: 'hyprland',
                    accent: pack.accent,
                    border: pack.border,
                    wallpaper: pack.wallpaper,
                    dotsText: pack.dotsSample,
                    dotsNote: pack.credit,
                  }))
                }}
              >
                LARP ViegPhunt
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (state.phase === 'setup') {
    const i = state.identity
    return (
      <div className="setup">
        <header>
          <h1>Setup your LARP</h1>
          <p>Visual only. No packages. No real DE. Dotfiles are never executed.</p>
        </header>
        <div className="setup-grid">
          <label>
            Desktop skin
            <select
              value={state.skin}
              onChange={(e) => setState((s) => ({ ...s, skin: e.target.value as Skin }))}
            >
              <option value="hyprland">Hyprland</option>
              <option value="gnome">GNOME</option>
              <option value="kde">KDE Plasma</option>
            </select>
          </label>
          <label>
            Rice pack
            <select value={state.rice} onChange={(e) => applyRice(e.target.value as RiceId)}>
              <option value="default">Default</option>
              <option value="viegphunt">ViegPhunt Arch-Hyprland</option>
            </select>
          </label>
          <label>
            Display name
            <input
              value={i.displayName}
              onChange={(e) => setState((s) => ({ ...s, identity: { ...s.identity, displayName: e.target.value } }))}
            />
          </label>
          <label>
            Username
            <input
              value={i.username}
              onChange={(e) => setState((s) => ({ ...s, identity: { ...s.identity, username: e.target.value } }))}
            />
          </label>
          <label>
            Hostname
            <input
              value={i.hostname}
              onChange={(e) => setState((s) => ({ ...s, identity: { ...s.identity, hostname: e.target.value } }))}
            />
          </label>
          <label>
            Fake CPU
            <input
              value={i.cpu}
              onChange={(e) => setState((s) => ({ ...s, identity: { ...s.identity, cpu: e.target.value } }))}
            />
          </label>
          <label>
            Fake GPU
            <input
              value={i.gpu}
              onChange={(e) => setState((s) => ({ ...s, identity: { ...s.identity, gpu: e.target.value } }))}
            />
          </label>
          <label>
            Wallpaper URL
            <input value={state.wallpaper} onChange={(e) => setState((s) => ({ ...s, wallpaper: e.target.value }))} />
          </label>
          <label>
            Or upload wallpaper
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const url = URL.createObjectURL(f)
                setState((s) => ({ ...s, wallpaper: url }))
              }}
            />
          </label>
          <label>
            Accent
            <input type="color" value={state.accent} onChange={(e) => setState((s) => ({ ...s, accent: e.target.value }))} />
          </label>
          <label className="wide">
            Dotfiles (best-effort)
            <textarea
              rows={8}
              placeholder="Paste hyprland.conf / waybar CSS colors…"
              value={state.dotsText}
              onChange={(e) => applyDots(e.target.value)}
            />
          </label>
          {state.dotsNote ? <p className="note wide">{state.dotsNote}</p> : null}
        </div>
        <div className="setup-actions">
          <button onClick={() => setState((s) => ({ ...s, phase: 'landing' }))}>Back</button>
          <button className="primary" onClick={() => setState((s) => ({ ...s, phase: 'stage' }))}>
            Enter desktop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="shell">
      <div
        ref={stageRef}
        className={`stage skin-${state.skin}${isVieg ? ' rice-viegphunt' : ''}`}
        style={
          {
            '--accent': state.accent,
            '--border': state.border,
            backgroundImage: `url(${state.wallpaper})`,
          } as CSSProperties
        }
      >
        {isVieg ? (
          <div className="panel waybar">
            <div className="panel-left">
              <span className="wb power" title="wlogout (fake)">
                ⭘
              </span>
              <div className="workspaces">
                <span className="ws active">1</span>
                <span className="ws">2</span>
                <span className="ws">3</span>
                <span className="ws">4</span>
              </div>
            </div>
            <div className="panel-right">
              <span className="wb bt">󰂯</span>
              <span className="wb net"> LARP-NET</span>
              <span className="wb bat"> 98%</span>
              <span className="wb vol"> 42%</span>
              <span className="wb clock">{clock}</span>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="panel-left">
              <strong>{state.skin === 'gnome' ? 'Activities' : state.skin === 'kde' ? 'Application Launcher' : 'LARP'}</strong>
              <button type="button" onClick={() => toggleApp('terminal')}>
                Terminal
              </button>
              <button type="button" onClick={() => toggleApp('browser')}>
                Browser
              </button>
              <button type="button" onClick={() => toggleApp('files')}>
                Files
              </button>
            </div>
            <div className="panel-right">
              <span>
                {state.identity.displayName} · {state.identity.username}@{state.identity.hostname}
              </span>
              <span>{clock}</span>
            </div>
          </div>
        )}

        <div className="icons">
          <button type="button" onClick={() => toggleApp('terminal')}>
            <span>🖥️</span>
            {isVieg ? 'ghostty' : 'kitty'}
          </button>
          <button type="button" onClick={() => toggleApp('browser')}>
            <span>🌐</span>firefox
          </button>
          <button type="button" onClick={() => toggleApp('files')}>
            <span>📁</span>thunar
          </button>
        </div>

        <div className="windows">
          {state.openApps.includes('terminal') && (
            <FakeWindow
              title={`${state.identity.username}@${state.identity.hostname}: ~`}
              onClose={() => toggleApp('terminal')}
              x={80}
              y={90}
            >
              <pre className="term">{neofetch}</pre>
            </FakeWindow>
          )}
          {state.openApps.includes('browser') && (
            <FakeWindow title="Firefox — New Tab" onClose={() => toggleApp('browser')} x={320} y={120}>
              <div className="browser">
                <div className="browser-bar">https://wiki.archlinux.org/</div>
                <div className="browser-body">Empty LARP browser. Looks busy. Does nothing.</div>
              </div>
            </FakeWindow>
          )}
          {state.openApps.includes('files') && (
            <FakeWindow title="Home" onClose={() => toggleApp('files')} x={520} y={160}>
              <div className="files">
                <div>📁 .config</div>
                <div>📁 .local</div>
                <div>📁 Pictures</div>
                <div>📄 rice.md</div>
              </div>
            </FakeWindow>
          )}
        </div>
      </div>

      {!exporting && (
        <div className="export-bar">
          <button onClick={() => setState((s) => ({ ...s, phase: 'setup' }))}>Setup</button>
          <button className="primary" onClick={() => exportPng('story')} disabled={exporting}>
            Export story
          </button>
          <button className="primary" onClick={() => exportPng('square')} disabled={exporting}>
            Export square
          </button>
          <button onClick={() => exportPng('wide')} disabled={exporting}>
            Export wide
          </button>
        </div>
      )}
    </div>
  )
}

function FakeWindow({
  title,
  children,
  onClose,
  x,
  y,
}: {
  title: string
  children: import('react').ReactNode
  onClose: () => void
  x: number
  y: number
}) {
  const [pos, setPos] = useState({ x, y })
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  return (
    <div className="window" style={{ left: pos.x, top: pos.y }}>
      <div
        className="titlebar"
        onMouseDown={(e) => {
          drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
          const move = (ev: MouseEvent) => {
            if (!drag.current) return
            setPos({ x: ev.clientX - drag.current.dx, y: ev.clientY - drag.current.dy })
          }
          const up = () => {
            drag.current = null
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseup', up)
          }
          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        }}
      >
        <span>{title}</span>
        <button type="button" aria-label="Close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="window-body">{children}</div>
    </div>
  )
}
