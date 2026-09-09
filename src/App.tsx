import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { parseDots } from './dots'
import { RICES, riceById, type RiceId } from './rices'
import type { AppState, ExportPreset, Identity, Skin } from './types'
import { WALLPAPERS, cycleWallpaper } from './wallpapers'
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

function clockNow(viegStyle: boolean) {
  if (!viegStyle) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const d = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${days[d.getDay()]} ${dd}/${mm}/${yyyy} ~ ${hh}:${mi}`
}

function promptTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function cycleInPack(current: string, walls: string[], dir: 1 | -1): string {
  if (!walls.length) return cycleWallpaper(current, dir)
  const idx = walls.indexOf(current)
  const base = idx < 0 ? 0 : idx
  return walls[(base + dir + walls.length) % walls.length]
}

const ARCH_ASCII = `                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \/`

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
    showWallPicker: false,
  })
  const [clock, setClock] = useState(() => clockNow(false))
  const [ptime, setPtime] = useState(promptTime)

  const isVieg = state.rice === 'viegphunt' && state.skin === 'hyprland'
  const isMochaAlt = state.rice === 'mocha-alt' && state.skin === 'hyprland'
  const isRiceDesktop = isVieg || isMochaAlt
  const pack = riceById(state.rice)
  const wallList = pack.walls.length ? pack.walls : WALLPAPERS.map((w) => w.url)

  useEffect(() => {
    const t = setInterval(() => {
      setClock(clockNow(isRiceDesktop))
      setPtime(promptTime())
    }, 1000)
    setClock(clockNow(isRiceDesktop))
    return () => clearInterval(t)
  }, [isRiceDesktop])

  useEffect(() => {
    setState((s) => ({
      ...s,
      identity: { ...s.identity, wm: skinWm[s.skin] },
    }))
  }, [state.skin])

  useEffect(() => {
    if (state.phase !== 'stage') return
    const onKey = (e: KeyboardEvent) => {
      // Super+W (meta+w) toggles wallpaper picker when stage is active
      if (e.key.toLowerCase() === 'w' && e.metaKey) {
        e.preventDefault()
        setState((s) => ({ ...s, showWallPicker: !s.showWallPicker }))
        return
      }
      if (state.showWallPicker && e.key === 'Escape') {
        setState((s) => ({ ...s, showWallPicker: false }))
        return
      }
      if (isRiceDesktop && e.altKey && e.key === 'ArrowRight') {
        setState((s) => ({ ...s, wallpaper: cycleInPack(s.wallpaper, wallList, 1) }))
      }
      if (isRiceDesktop && e.altKey && e.key === 'ArrowLeft') {
        setState((s) => ({ ...s, wallpaper: cycleInPack(s.wallpaper, wallList, -1) }))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, state.showWallPicker, isRiceDesktop, wallList])

  const neofetchLines = useMemo(() => {
    const i = state.identity
    return [
      { k: 'OS', v: 'Arch Linux x86_64' },
      { k: 'Host', v: 'LARP Linux (not real)' },
      { k: 'Kernel', v: '6.10.arch-larp' },
      { k: 'WM', v: i.wm },
      { k: 'CPU', v: i.cpu },
      { k: 'GPU', v: i.gpu },
      { k: 'Memory', v: '64 GiB (fake)' },
      { k: 'Terminal', v: 'ghostty' },
      ...(isVieg ? [{ k: 'Rice', v: 'ViegPhunt (LARP)' }] : []),
      ...(isMochaAlt ? [{ k: 'Rice', v: 'Mocha Alt (LARP pack)' }] : []),
    ]
  }, [state.identity, isVieg, isMochaAlt])

  function applyRice(id: RiceId) {
    const next = riceById(id)
    setState((s) => ({
      ...s,
      rice: id,
      skin: id === 'viegphunt' || id === 'mocha-alt' ? 'hyprland' : s.skin,
      accent: next.accent,
      border: next.border,
      wallpaper: next.wallpaper,
      dotsText: next.dotsSample,
      dotsNote: next.credit || s.dotsNote,
      showWallPicker: false,
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

  function setWall(url: string) {
    setState((s) => ({ ...s, wallpaper: url, showWallPicker: false }))
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
                  const next = riceById('viegphunt')
                  setState((s) => ({
                    ...s,
                    phase: 'setup',
                    rice: 'viegphunt',
                    skin: 'hyprland',
                    accent: next.accent,
                    border: next.border,
                    wallpaper: next.wallpaper,
                    dotsText: next.dotsSample,
                    dotsNote: next.credit,
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
              <option value="mocha-alt">Mocha Alt (LARP pack)</option>
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

  const riceClass = isVieg ? ' rice-viegphunt' : isMochaAlt ? ' rice-viegphunt rice-mocha-alt' : ''

  return (
    <div className="shell">
      <div
        ref={stageRef}
        className={`stage skin-${state.skin}${riceClass}`}
        tabIndex={0}
        style={
          {
            '--accent': state.accent,
            '--border': state.border,
            backgroundImage: `url(${state.wallpaper})`,
          } as CSSProperties
        }
      >
        {isRiceDesktop ? (
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
              <span className="wb net">  LARP-NET</span>
              <span className="wb bat"> 98%</span>
              <span className="wb vol">  42%</span>
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

        {/* Official ViegPhunt shots have NO desktop icons */}
        {!isRiceDesktop && (
          <div className="icons">
            <button type="button" onClick={() => toggleApp('terminal')}>
              <span>🖥️</span>
              kitty
            </button>
            <button type="button" onClick={() => toggleApp('browser')}>
              <span>🌐</span>firefox
            </button>
            <button type="button" onClick={() => toggleApp('files')}>
              <span>📁</span>thunar
            </button>
          </div>
        )}

        <div className="windows">
          {state.openApps.includes('terminal') && (
            <FakeWindow
              title={`${state.identity.username}@${state.identity.hostname}: ~`}
              onClose={() => toggleApp('terminal')}
              x={80}
              y={90}
              ghostty={isRiceDesktop}
            >
              {isRiceDesktop ? (
                <div className="ghostty-body">
                  <div className="neo-row">
                    <pre className="arch-ascii">{ARCH_ASCII}</pre>
                    <div className="neoinfo">
                      <div className="neo-title">
                        <span className="neo-user">{state.identity.username}</span>
                        <span className="neo-at">@</span>
                        <span className="neo-host">{state.identity.hostname}</span>
                      </div>
                      <div className="neo-rule">-----------------</div>
                      {neofetchLines.map((row) => (
                        <div key={row.k} className="neo-line">
                          <span className="neo-k">{row.k}</span>
                          <span className="neo-colon">: </span>
                          <span className="neo-v">{row.v}</span>
                        </div>
                      ))}
                      <div className="neo-swatches" aria-hidden>
                        <i style={{ background: '#45475a' }} />
                        <i style={{ background: '#f38ba8' }} />
                        <i style={{ background: '#a6e3a1' }} />
                        <i style={{ background: '#f9e2af' }} />
                        <i style={{ background: '#89b4fa' }} />
                        <i style={{ background: '#cba6f7' }} />
                        <i style={{ background: '#94e2d5' }} />
                        <i style={{ background: '#cdd6f4' }} />
                      </div>
                      <p className="neo-disclaimer">you are not installing arch. you are larping.</p>
                    </div>
                  </div>
                  <div className="omp">
                    <span className="omp-lead">╭─</span>
                    <span className="omp-pill omp-user"> {state.identity.username} </span>
                    <span className="omp-pill omp-dir">   ~ </span>
                    <span className="omp-pill omp-time"> ♥ {ptime} </span>
                  </div>
                  <div className="omp-line2">
                    <span className="omp-corner">╰─</span>
                    <span className="omp-bolt">⚡</span>
                    <span className="omp-cursor"> </span>
                  </div>
                </div>
              ) : (
                <pre className="term">
                  {[
                    `${state.identity.username}@${state.identity.hostname}`,
                    '-----------------',
                    ...neofetchLines.map((r) => `${r.k}: ${r.v}`),
                    '',
                    'you are not installing arch.',
                    'you are larping.',
                  ].join('\n')}
                </pre>
              )}
            </FakeWindow>
          )}
          {state.openApps.includes('browser') && (
            <FakeWindow title="Firefox — New Tab" onClose={() => toggleApp('browser')} x={320} y={120} ghostty={isRiceDesktop}>
              <div className="browser">
                <div className="browser-bar">https://wiki.archlinux.org/</div>
                <div className="browser-body">Empty LARP browser. Looks busy. Does nothing.</div>
              </div>
            </FakeWindow>
          )}
          {state.openApps.includes('files') && (
            <FakeWindow title="Home" onClose={() => toggleApp('files')} x={520} y={160} ghostty={isRiceDesktop}>
              <div className="files">
                <div>📁 .config</div>
                <div>📁 .local</div>
                <div>📁 Pictures</div>
                <div>📄 rice.md</div>
              </div>
            </FakeWindow>
          )}
        </div>

        {state.showWallPicker && (
          <div
            className="wall-picker"
            role="dialog"
            aria-label="Wallpaper picker"
            onClick={(e) => {
              if (e.target === e.currentTarget) setState((s) => ({ ...s, showWallPicker: false }))
            }}
          >
            <div className="wall-picker-panel">
              <div className="wall-picker-head">
                <span>  Walls</span>
                <span className="wall-hint">Super+W · Esc</span>
              </div>
              <div className="wall-grid">
                {wallList.map((url) => {
                  const name = url.split('/').pop() || url
                  return (
                    <button
                      key={url}
                      type="button"
                      className={`wall-thumb${state.wallpaper === url ? ' active' : ''}`}
                      onClick={() => setWall(url)}
                      title={name}
                    >
                      <img src={url} alt={name} loading="lazy" />
                      <span>{name.replace(/\.(png|jpe?g|webp)$/i, '')}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {!exporting && (
        <div className="export-bar">
          <button onClick={() => setState((s) => ({ ...s, phase: 'setup' }))}>Setup</button>
          {isRiceDesktop && (
            <>
              <button
                type="button"
                title="Super+W"
                onClick={() => setState((s) => ({ ...s, showWallPicker: !s.showWallPicker }))}
              >
                Walls
              </button>
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, wallpaper: cycleInPack(s.wallpaper, wallList, -1) }))}
              >
                Prev wall
              </button>
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, wallpaper: cycleInPack(s.wallpaper, wallList, 1) }))}
              >
                Next wall
              </button>
            </>
          )}
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
  ghostty,
}: {
  title: string
  children: import('react').ReactNode
  onClose: () => void
  x: number
  y: number
  ghostty?: boolean
}) {
  const [pos, setPos] = useState({ x, y })
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  return (
    <div className={`window${ghostty ? ' ghostty' : ''}`} style={{ left: pos.x, top: pos.y }}>
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
