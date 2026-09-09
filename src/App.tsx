import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { parseDots } from './dots'
import { HYPR_RICE_IDS, RICES, riceById, type RiceId } from './rices'
import type { AppId, AppState, ExportPreset, Identity, Skin, Toast, WorkspaceId } from './types'
import { WALLPAPERS, cycleWallpaper } from './wallpapers'
import { cssBgUrl, hotlinkLikelyBlocked, normalizeWallUrl, probeImage } from './wallUrl'
import { defaultPos, initialWorkspaces, switchWorkspace, WORKSPACE_IDS } from './workspaces'
import { isTypingTarget } from './keybinds'
import { runFakeCommand, type ShellContext } from './fakeShell'
import { Launcher, type LauncherAction } from './Launcher'
import { KeybindOverlay } from './KeybindOverlay'
import { ToastStack } from './ToastStack'
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

type ClockStyle = 'plain' | 'vieg' | 'haku' | 'end4'

function clockNow(style: ClockStyle) {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  if (style === 'haku') {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]
    return `${hh}:${mi}:${ss}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }
  if (style === 'end4') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${days[d.getDay()]}, ${dd}/${mm} • ${hh}:${mi}`
  }
  if (style === 'vieg') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${days[d.getDay()]} ${dd}/${mm}/${yyyy} ~ ${hh}:${mi}`
  }
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
 .\`                                 \`/`

let toastSeq = 1

export default function App() {
  const stageRef = useRef<HTMLDivElement>(null)
  const positionsRef = useRef<Partial<Record<AppId, { x: number; y: number }>>>({})
  const demoTimers = useRef<number[]>([])
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
    showExportBar: true,
    workspace: 1,
    workspaces: initialWorkspaces(),
    recordMode: false,
  })
  const [clock, setClock] = useState(() => clockNow('plain'))
  const [ptime, setPtime] = useState(promptTime)
  const [showLauncher, setShowLauncher] = useState(false)
  const [showKeybinds, setShowKeybinds] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [focusedApp, setFocusedApp] = useState<AppId | null>('terminal')
  const [termLines, setTermLines] = useState<string[]>([
    'LARP shell ready. Type help — configs are never executed.',
  ])
  const [termInput, setTermInput] = useState('')
  const [volMuted, setVolMuted] = useState(false)
  const [btOn, setBtOn] = useState(true)
  const [volLevel] = useState(42)
  const [wifiOn, setWifiOn] = useState(true)
  const [brightness, setBrightness] = useState(40)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [weatherTemp, setWeatherTemp] = useState(22)
  const [demoRunning, setDemoRunning] = useState(false)
  const [wsFlash, setWsFlash] = useState(false)

  const isVieg = state.rice === 'viegphunt' && state.skin === 'hyprland'
  const isMochaAlt = state.rice === 'mocha-alt' && state.skin === 'hyprland'
  const isViegLike = isVieg || isMochaAlt
  const isHaku = state.rice === 'hakuspace' && state.skin === 'hyprland'
  const isEnd4 = state.rice === 'end4' && state.skin === 'hyprland'
  const isRiceDesktop = isViegLike || isHaku || isEnd4
  const pack = riceById(state.rice)
  const hasWallPicker = pack.walls.length > 1
  const wallList = pack.walls.length ? pack.walls : WALLPAPERS.map((w) => w.url)
  const clockStyle: ClockStyle = isHaku ? 'haku' : isEnd4 ? 'end4' : isViegLike ? 'vieg' : 'plain'
  const useGhostty = isViegLike
  const workspace = (state.workspace ?? 1) as WorkspaceId
  const riceClassName = isVieg
    ? ' rice-viegphunt'
    : isMochaAlt
      ? ' rice-viegphunt rice-mocha-alt'
      : isHaku
        ? ' rice-hakuspace'
        : isEnd4
          ? ' rice-end4'
          : ''

  const pushToast = useCallback((message: string) => {
    const id = toastSeq++
    setToasts((t) => [...t, { id, message }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2200)
  }, [])

  const stopDemo = useCallback(() => {
    demoTimers.current.forEach((id) => window.clearTimeout(id))
    demoTimers.current = []
    setDemoRunning(false)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setClock(clockNow(clockStyle))
      setPtime(promptTime())
    }, 1000)
    setClock(clockNow(clockStyle))
    return () => clearInterval(t)
  }, [clockStyle])

  useEffect(() => {
    setState((s) => ({
      ...s,
      identity: { ...s.identity, wm: skinWm[s.skin] },
    }))
  }, [state.skin])

  useEffect(() => () => stopDemo(), [stopDemo])

  const shellCtx: ShellContext = useMemo(() => {
    const riceLabel =
      isVieg
        ? 'ViegPhunt (LARP)'
        : isMochaAlt
          ? 'Mocha Alt (LARP pack)'
          : isHaku
            ? 'Hakuspace (LARP)'
            : isEnd4
              ? 'end4-pC (LARP)'
              : 'Default'
    return {
      username: state.identity.username,
      hostname: state.identity.hostname,
      cwd: `/home/${state.identity.username}`,
      riceLabel,
      wm: state.identity.wm,
      cpu: state.identity.cpu,
      gpu: state.identity.gpu,
      terminalName: isHaku || isEnd4 ? 'kitty' : 'ghostty',
    }
  }, [state.identity, isVieg, isMochaAlt, isHaku, isEnd4])

  const runShellLine = useCallback(
    (raw: string) => {
      const out = runFakeCommand(raw, shellCtx)
      if (out[0] === '__CLEAR__') {
        setTermLines([])
        return
      }
      setTermLines((lines) => [
        ...lines,
        `${shellCtx.username}@${shellCtx.hostname}:${shellCtx.cwd}$ ${raw}`,
        ...out,
      ])
    },
    [shellCtx],
  )

  const goWorkspace = useCallback(
    (to: WorkspaceId) => {
      setState((s) => {
        const from = (s.workspace ?? 1) as WorkspaceId
        if (from === to) return s
        const workspaces = s.workspaces ?? initialWorkspaces()
        const switched = switchWorkspace(workspaces, from, to, s.openApps, positionsRef.current)
        positionsRef.current = { ...(switched.workspaces[to]?.positions ?? {}) }
        return {
          ...s,
          workspace: to,
          workspaces: switched.workspaces,
          openApps: switched.openApps,
        }
      })
      setWsFlash(true)
      window.setTimeout(() => setWsFlash(false), 280)
      pushToast(`Workspace ${to}`)
      setFocusedApp(null)
    },
    [pushToast],
  )

  const toggleWifi = useCallback(() => {
    setWifiOn((v) => {
      pushToast(v ? 'Wi-Fi off' : 'Wi-Fi on')
      return !v
    })
  }, [pushToast])

  const toggleVol = useCallback(() => {
    setVolMuted((v) => {
      pushToast(v ? `Volume ${volLevel}%` : 'Muted')
      return !v
    })
  }, [pushToast, volLevel])

  const toggleBt = useCallback(() => {
    setBtOn((v) => {
      pushToast(v ? 'Bluetooth off' : 'Bluetooth on')
      return !v
    })
  }, [pushToast])

  const cycleBrightness = useCallback(() => {
    setBrightness((b) => {
      const next = b === 40 ? 70 : b === 70 ? 100 : 40
      pushToast(`Brightness ${next}%`)
      return next
    })
  }, [pushToast])

  const toastBattery = useCallback(() => {
    pushToast('Battery 98% · AC (fake)')
  }, [pushToast])

  const openClock = useCallback(() => {
    setShowLauncher(false)
    setShowKeybinds(true)
  }, [])

  const cycleNextWorkspace = useCallback(() => {
    const cur = (state.workspace ?? 1) as WorkspaceId
    const next = ((cur % 4) + 1) as WorkspaceId
    goWorkspace(next)
  }, [state.workspace, goWorkspace])

  const toastWeather = useCallback(() => {
    setWeatherTemp((t) => {
      const temps = [18, 22, 26, 29, 15, 31]
      const idx = temps.indexOf(t)
      const next = temps[(idx < 0 ? 0 : idx + 1) % temps.length]
      pushToast(`${next}°C · still fake weather`)
      return next
    })
  }, [pushToast])

  const openApp = useCallback((app: AppId) => {
    setState((s) => ({
      ...s,
      openApps: s.openApps.includes(app) ? s.openApps : [...s.openApps, app],
    }))
    setFocusedApp(app)
  }, [])

  const toggleApp = useCallback((app: AppId) => {
    setState((s) => {
      const open = s.openApps.includes(app)
      return {
        ...s,
        openApps: open ? s.openApps.filter((x) => x !== app) : [...s.openApps, app],
      }
    })
    setFocusedApp((f) => (f === app ? null : app))
  }, [])

  const setWall = useCallback(
    async (url: string) => {
      const normalized = normalizeWallUrl(url)
      if (hotlinkLikelyBlocked(normalized)) {
        // uhdpaper checks Referer; browsers on localhost get HTML, not the JPEG.
        const localLisa = '/walls/lisa-blackpink-4k.jpg'
        if (/lisa-blackpink/i.test(normalized)) {
          setState((s) => ({ ...s, wallpaper: localLisa, showWallPicker: false }))
          pushToast('uhdpaper blocks hotlinks — using bundled Lisa wall')
          return
        }
        pushToast('This host blocks hotlinks — use Upload wallpaper')
        setState((s) => ({ ...s, showWallPicker: false }))
        return
      }
      const ok = await probeImage(normalized)
      if (!ok) {
        pushToast('Wallpaper URL failed to load — try Upload')
        setState((s) => ({ ...s, showWallPicker: false }))
        return
      }
      setState((s) => ({ ...s, wallpaper: normalized, showWallPicker: false }))
      const name = normalized.split('/').pop() || 'wallpaper'
      pushToast(`Wallpaper · ${name.replace(/\.(png|jpe?g|webp)$/i, '')}`)
    },
    [pushToast],
  )

  const handleLauncher = useCallback(
    (id: LauncherAction) => {
      setShowLauncher(false)
      if (id === 'terminal' || id === 'browser' || id === 'files') {
        openApp(id)
        return
      }
      if (id === 'walls') {
        if (hasWallPicker) setState((s) => ({ ...s, showWallPicker: true }))
        else pushToast('No wall pack for this rice')
        return
      }
      if (id === 'keybinds') {
        setShowKeybinds(true)
        return
      }
      if (id === 'settings') {
        setState((s) => ({ ...s, phase: 'setup' }))
      }
    },
    [hasWallPicker, openApp, pushToast],
  )

  const startDemo = useCallback(() => {
    stopDemo()
    setDemoRunning(true)
    setShowLauncher(false)
    setShowKeybinds(false)
    setState((s) => ({ ...s, showWallPicker: false, recordMode: true, showExportBar: false }))
    pushToast('Demo · recording loop')

    const at = (ms: number, fn: () => void) => {
      demoTimers.current.push(window.setTimeout(fn, ms))
    }

    at(600, () => setShowLauncher(true))
    at(2200, () => {
      setShowLauncher(false)
      openApp('terminal')
      setFocusedApp('terminal')
    })
    at(3000, () => setTermInput(''))
    const word = 'neofetch'
    word.split('').forEach((ch, i) => {
      at(3200 + i * 90, () => setTermInput((v) => v + ch))
    })
    at(3200 + word.length * 90 + 350, () => {
      setTermInput('')
      runShellLine('neofetch')
    })
    at(9000, () => goWorkspace(2))
    at(11500, () => {
      setState((s) => {
        const next = cycleInPack(s.wallpaper, wallList, 1)
        const name = next.split('/').pop() || 'wallpaper'
        pushToast(`Wallpaper · ${name.replace(/\.(png|jpe?g|webp)$/i, '').slice(0, 28)}`)
        return { ...s, wallpaper: next }
      })
    })
    at(16000, () => {
      setDemoRunning(false)
      pushToast('Demo complete')
    })
  }, [stopDemo, pushToast, openApp, runShellLine, goWorkspace, wallList])

  useEffect(() => {
    if (state.phase !== 'stage') return
    const onKey = (e: KeyboardEvent) => {
      const typing = isTypingTarget(e.target)
      const overlayOpen = showLauncher || showKeybinds || !!state.showWallPicker

      // Record mode toggle / exit
      if (!typing && (e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setState((s) => {
          const next = !s.recordMode
          return { ...s, recordMode: next, showExportBar: next ? false : s.showExportBar }
        })
        return
      }

      if (state.recordMode && e.key === 'Escape' && !overlayOpen) {
        e.preventDefault()
        setState((s) => ({ ...s, recordMode: false }))
        return
      }

      if (showKeybinds && e.key === 'Escape') {
        e.preventDefault()
        setShowKeybinds(false)
        return
      }

      if (state.showWallPicker && e.key === 'Escape') {
        setState((s) => ({ ...s, showWallPicker: false }))
        return
      }

      // Launcher — Ctrl+Space / Ctrl+; (Win+Space is stolen by Windows)
      if (
        !typing &&
        e.ctrlKey &&
        !e.altKey &&
        (e.code === 'Space' || e.key === ' ' || e.key === ';')
      ) {
        e.preventDefault()
        setShowKeybinds(false)
        setShowLauncher((v) => !v)
        return
      }

      // Keybind overlay Ctrl+/ or ?
      if (
        !typing &&
        ((e.ctrlKey && (e.key === '/' || e.code === 'Slash')) || e.key === '?')
      ) {
        e.preventDefault()
        setShowLauncher(false)
        setShowKeybinds((v) => !v)
        return
      }

      // Export bar H (not record mode, not Super)
      if (
        !typing &&
        !state.recordMode &&
        (e.key === 'h' || e.key === 'H') &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault()
        setState((s) => ({ ...s, showExportBar: !s.showExportBar }))
        return
      }

      // Workspaces Ctrl+1..4 (Win+1..4 is taskbar)
      if (!typing && e.ctrlKey && !e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault()
        goWorkspace(Number(e.key) as WorkspaceId)
        return
      }

      // Walls: Ctrl+Shift+W (Ctrl+W closes the browser tab)
      if (e.key.toLowerCase() === 'w' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        if (hasWallPicker) setState((s) => ({ ...s, showWallPicker: !s.showWallPicker }))
        return
      }

      if (hasWallPicker && e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        setState((s) => {
          const next = cycleInPack(s.wallpaper, wallList, 1)
          return { ...s, wallpaper: next }
        })
        pushToast('Wallpaper next')
        return
      }
      if (hasWallPicker && e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        setState((s) => {
          const next = cycleInPack(s.wallpaper, wallList, -1)
          return { ...s, wallpaper: next }
        })
        pushToast('Wallpaper prev')
        return
      }

      // Fake shell when terminal focused and no overlay
      if (
        !overlayOpen &&
        focusedApp === 'terminal' &&
        state.openApps.includes('terminal') &&
        !typing
      ) {
        if (e.key === 'Enter') {
          e.preventDefault()
          const line = termInput
          setTermInput('')
          runShellLine(line)
          return
        }
        if (e.key === 'Backspace') {
          e.preventDefault()
          setTermInput((v) => v.slice(0, -1))
          return
        }
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault()
          setTermInput((v) => v + e.key)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    state.phase,
    state.showWallPicker,
    state.recordMode,
    state.openApps,
    hasWallPicker,
    wallList,
    showLauncher,
    showKeybinds,
    focusedApp,
    termInput,
    goWorkspace,
    runShellLine,
    pushToast,
  ])

  const neofetchLines = useMemo(() => {
    const i = state.identity
    const riceLine =
      isVieg
        ? [{ k: 'Rice', v: 'ViegPhunt (LARP)' }]
        : isMochaAlt
          ? [{ k: 'Rice', v: 'Mocha Alt (LARP pack)' }]
          : isHaku
            ? [{ k: 'Rice', v: 'Hakuspace (LARP)' }]
            : isEnd4
              ? [{ k: 'Rice', v: 'end4-pC (LARP)' }]
              : []
    return [
      { k: 'OS', v: 'Arch Linux x86_64' },
      { k: 'Host', v: 'LARP Linux (not real)' },
      { k: 'Kernel', v: '6.10.arch-larp' },
      { k: 'WM', v: i.wm },
      { k: 'CPU', v: i.cpu },
      { k: 'GPU', v: i.gpu },
      { k: 'Memory', v: '64 GiB (fake)' },
      { k: 'Terminal', v: isHaku ? 'kitty' : isEnd4 ? 'kitty' : 'ghostty' },
      ...riceLine,
    ]
  }, [state.identity, isVieg, isMochaAlt, isHaku, isEnd4])

  function applyRice(id: RiceId) {
    const next = riceById(id)
    setState((s) => ({
      ...s,
      rice: id,
      skin: HYPR_RICE_IDS.includes(id) ? 'hyprland' : s.skin,
      accent: next.accent,
      border: next.border,
      wallpaper: next.wallpaper,
      dotsText: next.dotsSample,
      dotsNote: next.credit || s.dotsNote,
      showWallPicker: false,
    }))
  }

  function quickLarp(id: RiceId) {
    const next = riceById(id)
    setState((s) => ({
      ...s,
      phase: 'setup',
      rice: id,
      skin: 'hyprland',
      accent: next.accent,
      border: next.border,
      wallpaper: next.wallpaper,
      dotsText: next.dotsSample,
      dotsNote: next.credit,
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

  function rememberPos(app: AppId, pos: { x: number; y: number }) {
    positionsRef.current = { ...positionsRef.current, [app]: pos }
  }

  if (state.phase === 'landing') {
    return (
      <div className="landing">
        <div className="landing-hero" style={{ backgroundImage: cssBgUrl(RICES.viegphunt.wallpaper) }}>
          <div className="landing-card">
            <p className="eyebrow">LARP Linux</p>
            <h1>Fake Arch desktops for the timeline.</h1>
            <p>
              Pick Hyprland, GNOME, or KDE. One-click rice packs (visual only). Export a PNG.
              You are not installing Arch. You are LARPing.
            </p>
            <div className="landing-actions">
              <button className="primary" onClick={() => setState((s) => ({ ...s, phase: 'setup' }))}>
                Start LARPing
              </button>
              <button className="primary ghost" onClick={() => quickLarp('viegphunt')}>
                LARP ViegPhunt
              </button>
              <button className="primary ghost haku-btn" onClick={() => quickLarp('hakuspace')}>
                LARP Hakuspace
              </button>
              <button className="primary ghost end4-btn" onClick={() => quickLarp('end4')}>
                LARP end4-pC
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
              <option value="hakuspace">Hakuspace</option>
              <option value="end4">end4-pC (Material 3)</option>
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
            <input
              value={state.wallpaper}
              onChange={(e) => setState((s) => ({ ...s, wallpaper: e.target.value }))}
              onBlur={(e) => {
                const v = e.target.value.trim()
                if (!v) return
                void setWall(v)
              }}
            />
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

  const showChrome = !exporting && !state.recordMode && state.showExportBar !== false
  const showPeek = !exporting && !state.recordMode && state.showExportBar === false
  const termPos = positionsRef.current.terminal ?? defaultPos('terminal', isEnd4)
  const browserPos = positionsRef.current.browser ?? defaultPos('browser', isEnd4)
  const filesPos = positionsRef.current.files ?? defaultPos('files', isEnd4)

  return (
    <div className="shell">
      <div
        ref={stageRef}
        className={`stage skin-${state.skin}${riceClassName}${wsFlash ? ' ws-fade' : ''}`}
        tabIndex={0}
        style={
          {
            '--accent': state.accent,
            '--border': state.border,
            backgroundImage: cssBgUrl(state.wallpaper),
          } as CSSProperties
        }
        onMouseDown={() => {
          if (!showLauncher && !showKeybinds) setFocusedApp(null)
        }}
      >
        {isViegLike ? (
          <div className="panel waybar">
            <div className="panel-left">
              <button
                type="button"
                className="wb power"
                title="Launcher (Ctrl+Space)"
                onClick={() => {
                  setShowKeybinds(false)
                  setShowLauncher(true)
                }}
              >
                ⭘
              </button>
              <button
                type="button"
                className="wb launch"
                title="Launcher (Ctrl+Space)"
                onClick={() => {
                  setShowKeybinds(false)
                  setShowLauncher(true)
                }}
              >
                apps
              </button>
              <button
                type="button"
                className="wb term"
                title="Open terminal"
                onClick={() => {
                  openApp('terminal')
                  setFocusedApp('terminal')
                }}
              >
                term
              </button>
              <div className="workspaces">
                {WORKSPACE_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`ws${workspace === id ? ' active' : ''}`}
                    onClick={() => goWorkspace(id)}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-right">
              <button
                type="button"
                className="wb bt"
                title="Bluetooth (LARP)"
                onClick={toggleBt}
              >
                {btOn ? '󰂯' : '󰂲'}
              </button>
              <button
                type="button"
                className="wb net"
                title="Wi-Fi (LARP)"
                onClick={toggleWifi}
              >
                {wifiOn ? '  LARP-NET' : '  off'}
              </button>
              <button
                type="button"
                className="wb bat"
                title="Battery (LARP)"
                onClick={toastBattery}
              >
                 98%
              </button>
              <button
                type="button"
                className="wb vol"
                title="Volume (LARP)"
                onClick={toggleVol}
              >
                {volMuted ? '󰝟' : ''}  {volMuted ? 'mute' : `${volLevel}%`}
              </button>
              <button
                type="button"
                className="wb clock"
                title="Clock / keybinds"
                onClick={openClock}
              >
                {clock}
              </button>
            </div>
          </div>
        ) : isHaku ? (
          <>
            <div className="haku-bar" aria-label="Hakuspace top bar">
              <div className="haku-island haku-left">
                <button
                  type="button"
                  className="haku-ico"
                  title="search / launcher"
                  onClick={() => setShowLauncher(true)}
                >
                  
                </button>
                <button
                  type="button"
                  className="haku-ico"
                  title="settings"
                  onClick={() => setState((s) => ({ ...s, phase: 'setup' }))}
                >
                  
                </button>
                <div className="haku-ws">
                  {WORKSPACE_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={`haku-pill${workspace === id ? ' active' : ''}`}
                      onClick={() => goWorkspace(id)}
                      aria-label={`Workspace ${id}`}
                    />
                  ))}
                </div>
              </div>
              <div className="haku-island haku-center">
                <button
                  type="button"
                  className="haku-clock"
                  title="Clock / keybinds"
                  onClick={openClock}
                >
                  {clock}
                </button>
              </div>
              <div className="haku-island haku-right">
                <button type="button" className="haku-mod" title="Battery (LARP)" onClick={toastBattery}>
                   79%
                </button>
                <button type="button" className="haku-mod" title="Volume (LARP)" onClick={toggleVol}>
                  {volMuted ? '󰝟' : ''} {volMuted ? 'mute' : `${volLevel}%`}
                </button>
                <button type="button" className="haku-mod" title="Brightness (LARP)" onClick={cycleBrightness}>
                  󰃠 {brightness}%
                </button>
                <button type="button" className="haku-mod" title="Wi-Fi (LARP)" onClick={toggleWifi}>
                  {wifiOn ? '' : '󰖪'}
                </button>
                <button type="button" className="haku-mod" title="Bluetooth (LARP)" onClick={toggleBt}>
                  {btOn ? '󰂯' : '󰂲'}
                </button>
                <button
                  type="button"
                  className="haku-mod"
                  title="Power (LARP)"
                  onClick={() => {
                    pushToast('wlogout · still larping')
                    setShowKeybinds(false)
                    setShowLauncher(true)
                  }}
                >
                  ⏻
                </button>
              </div>
            </div>
            <div className="haku-dock" aria-label="Hakuspace dock">
              <button
                type="button"
                className="haku-dock-btn"
                title="launcher"
                aria-label="launcher"
                onClick={() => setShowLauncher(true)}
              >
                󰕰
              </button>
              <button
                type="button"
                className={`haku-dock-btn${state.openApps.includes('terminal') ? ' on' : ''}`}
                onClick={() => toggleApp('terminal')}
                title="terminal"
              >
                
              </button>
              <button
                type="button"
                className={`haku-dock-btn${state.openApps.includes('files') ? ' on' : ''}`}
                onClick={() => toggleApp('files')}
                title="files"
              >
                
              </button>
              <button
                type="button"
                className={`haku-dock-btn${state.openApps.includes('browser') ? ' on' : ''}`}
                onClick={() => toggleApp('browser')}
                title="browser"
              >
                󰖟
              </button>
            </div>
          </>
        ) : isEnd4 ? (
          <>
            <div className="end4-bar" aria-label="end4 floating bar">
              <div className="end4-left">
                <button
                  type="button"
                  className="end4-desk"
                  title="Launcher"
                  onClick={() => {
                    setShowKeybinds(false)
                    setShowLauncher(true)
                  }}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  className="end4-ws-label"
                  title="Next workspace"
                  onClick={cycleNextWorkspace}
                >
                  Workspace {workspace}
                </button>
              </div>
              <div className="end4-center">
                <div className="end4-ws">
                  {WORKSPACE_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={`end4-dot${workspace === id ? ' active' : ''}`}
                      onClick={() => goWorkspace(id)}
                      aria-label={`Workspace ${id}`}
                    />
                  ))}
                </div>
              </div>
              <div className="end4-right">
                <button type="button" className="end4-clock" title="Clock / keybinds" onClick={openClock}>
                  {clock}
                </button>
                <button type="button" className="end4-ico" title="Wi-Fi (LARP)" onClick={toggleWifi}>
                  {wifiOn ? '' : '󰖪'}
                </button>
                <button type="button" className="end4-ico" title="Volume (LARP)" onClick={toggleVol}>
                  {volMuted ? '󰝟' : ''}
                </button>
              </div>
            </div>
            <aside className="end4-sidebar" aria-label="end4 widgets">
              <button type="button" className="end4-card end4-clock-card" onClick={openClock} title="Keybinds">
                <div className="end4-big-time">{ptime}</div>
                <div className="end4-card-sub">{clock}</div>
              </button>
              <button type="button" className="end4-card end4-weather-card" onClick={toastWeather} title="Weather (LARP)">
                <div className="end4-weather-temp">{weatherTemp}°C</div>
                <div className="end4-card-sub">partly cloudy · LARP City</div>
                <div className="end4-weather-meta">💧 48% · 🌬 3 m/s</div>
              </button>
              <button
                type="button"
                className="end4-card end4-user-card"
                title="User (LARP)"
                onClick={() => pushToast(`Hi, ${state.identity.displayName}`)}
              >
                <div className="end4-avatar">{(state.identity.displayName || 'L').charAt(0).toUpperCase()}</div>
                <div>
                  <div className="end4-hi">Hi, {state.identity.displayName}</div>
                  <div className="end4-card-sub">Good evening · visual LARP</div>
                </div>
              </button>
              <div className="end4-card end4-music-card">
                <div className="end4-album" />
                <div className="end4-track">
                  <div className="end4-song">LARP Anthem</div>
                  <div className="end4-card-sub">Fake Artist</div>
                  <div className="end4-transport">
                    <button
                      type="button"
                      className="end4-transport-btn"
                      title="Previous"
                      onClick={() => pushToast('⏮ skip back · still larping')}
                    >
                      ⏮
                    </button>
                    <button
                      type="button"
                      className="end4-transport-btn"
                      title="Play/Pause"
                      onClick={() => {
                        setMusicPlaying((v) => {
                          pushToast(v ? '⏸ paused (fake)' : '▶ playing (fake)')
                          return !v
                        })
                      }}
                    >
                      {musicPlaying ? '⏸' : '⏯'}
                    </button>
                    <button
                      type="button"
                      className="end4-transport-btn"
                      title="Next"
                      onClick={() => pushToast('⏭ skip · next LARP track')}
                    >
                      ⏭
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </>
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
              <div className="workspaces plain-ws">
                {WORKSPACE_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`ws${workspace === id ? ' active' : ''}`}
                    onClick={() => goWorkspace(id)}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-right">
              <span>
                {state.identity.displayName} · {state.identity.username}@{state.identity.hostname}
              </span>
              <span>{clock}</span>
            </div>
          </div>
        )}

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

        <div className={`windows${wsFlash ? ' windows-swap' : ''}`}>
          {state.openApps.includes('terminal') && (
            <FakeWindow
              title={
                isHaku
                  ? `kitty — ${state.identity.username}@${state.identity.hostname}:~`
                  : `${state.identity.username}@${state.identity.hostname}: ~`
              }
              onClose={() => toggleApp('terminal')}
              x={termPos.x}
              y={termPos.y}
              ghostty={useGhostty}
              kitty={isHaku}
              soft={isEnd4}
              focused={focusedApp === 'terminal'}
              onFocus={() => setFocusedApp('terminal')}
              onMove={(p) => rememberPos('terminal', p)}
            >
              <div className={useGhostty ? 'ghostty-body' : undefined}>
                {useGhostty && termLines.length <= 1 && (
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
                )}
                <pre className={`term shell-out${isHaku ? ' kitty-term' : ''}`}>
                  {termLines.join('\n')}
                </pre>
                <div className={useGhostty ? 'omp shell-prompt' : 'shell-prompt'}>
                  {useGhostty ? (
                    <>
                      <div className="omp">
                        <span className="omp-lead">╭─</span>
                        <span className="omp-pill omp-user"> {state.identity.username} </span>
                        <span className="omp-pill omp-dir">   ~ </span>
                        <span className="omp-pill omp-time"> ♥ {ptime} </span>
                      </div>
                      <div className="omp-line2">
                        <span className="omp-corner">╰─</span>
                        <span className="omp-bolt">⚡</span>
                        <span className="shell-typed">{termInput}</span>
                        <span className={`omp-cursor${focusedApp === 'terminal' ? '' : ' dim'}`}> </span>
                      </div>
                    </>
                  ) : (
                    <span className={`term${isHaku ? ' kitty-term' : ''}`}>
                      [{ptime}] ❯ {termInput}
                      <span className={`omp-cursor${focusedApp === 'terminal' ? '' : ' dim'}`}> </span>
                    </span>
                  )}
                </div>
              </div>
            </FakeWindow>
          )}
          {state.openApps.includes('browser') && (
            <FakeWindow
              title="Firefox — New Tab"
              onClose={() => toggleApp('browser')}
              x={browserPos.x}
              y={browserPos.y}
              ghostty={useGhostty}
              kitty={isHaku}
              soft={isEnd4}
              focused={focusedApp === 'browser'}
              onFocus={() => setFocusedApp('browser')}
              onMove={(p) => rememberPos('browser', p)}
            >
              <div className="browser">
                <div className="browser-bar">https://wiki.archlinux.org/</div>
                <div className="browser-body">Empty LARP browser. Looks busy. Does nothing.</div>
              </div>
            </FakeWindow>
          )}
          {state.openApps.includes('files') && (
            <FakeWindow
              title="Home"
              onClose={() => toggleApp('files')}
              x={filesPos.x}
              y={filesPos.y}
              ghostty={useGhostty}
              kitty={isHaku}
              soft={isEnd4}
              focused={focusedApp === 'files'}
              onFocus={() => setFocusedApp('files')}
              onMove={(p) => rememberPos('files', p)}
            >
              <div className="files">
                <div>📁 .config</div>
                <div>📁 .local</div>
                <div>📁 Pictures</div>
                <div>📄 rice.md</div>
              </div>
            </FakeWindow>
          )}
        </div>

        {state.showWallPicker && hasWallPicker && (
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
                <span className="wall-hint">Ctrl+Shift+W · Esc</span>
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
                      <span>{name.replace(/\.(png|jpe?g|webp)$/i, '').slice(0, 40)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {showLauncher && (
          <Launcher riceClass={riceClassName} onLaunch={handleLauncher} onClose={() => setShowLauncher(false)} />
        )}
        {showKeybinds && <KeybindOverlay onClose={() => setShowKeybinds(false)} />}
        <ToastStack toasts={toasts} />
      </div>

      {showChrome && (
        <div className="export-bar">
          <button onClick={() => setState((s) => ({ ...s, phase: 'setup' }))}>Setup</button>
          <button
            type="button"
            title="Open terminal"
            onClick={() => {
              openApp('terminal')
              setFocusedApp('terminal')
            }}
          >
            Terminal
          </button>
          <button
            type="button"
            title="Ctrl+Space"
            onClick={() => {
              setShowKeybinds(false)
              setShowLauncher(true)
            }}
          >
            Apps
          </button>
          {hasWallPicker && (
            <>
              <button
                type="button"
                title="Ctrl+Shift+W"
                onClick={() => setState((s) => ({ ...s, showWallPicker: !s.showWallPicker }))}
              >
                Walls
              </button>
              <button
                type="button"
                onClick={() => {
                  setState((s) => ({ ...s, wallpaper: cycleInPack(s.wallpaper, wallList, -1) }))
                  pushToast('Wallpaper prev')
                }}
              >
                Prev wall
              </button>
              <button
                type="button"
                onClick={() => {
                  setState((s) => ({ ...s, wallpaper: cycleInPack(s.wallpaper, wallList, 1) }))
                  pushToast('Wallpaper next')
                }}
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
          <button
            type="button"
            className={demoRunning ? 'primary' : undefined}
            title="~16s scripted LARP demo"
            onClick={() => (demoRunning ? stopDemo() : startDemo())}
          >
            {demoRunning ? 'Stop demo' : 'Demo'}
          </button>
          <button
            type="button"
            title="Record mode (R)"
            onClick={() => setState((s) => ({ ...s, recordMode: true, showExportBar: false }))}
          >
            Record
          </button>
          <button
            type="button"
            title="Hotkey H"
            onClick={() => setState((s) => ({ ...s, showExportBar: false }))}
          >
            Hide bar
          </button>
        </div>
      )}

      {showPeek && (
        <button
          type="button"
          className="export-peek"
          title="Show bar (H)"
          onClick={() => setState((s) => ({ ...s, showExportBar: true }))}
        >
          ▴ Show bar
        </button>
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
  kitty,
  soft,
  focused,
  onFocus,
  onMove,
}: {
  title: string
  children: import('react').ReactNode
  onClose: () => void
  x: number
  y: number
  ghostty?: boolean
  kitty?: boolean
  soft?: boolean
  focused?: boolean
  onFocus?: () => void
  onMove?: (pos: { x: number; y: number }) => void
}) {
  const [pos, setPos] = useState({ x, y })
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const cls = [
    'window',
    ghostty ? 'ghostty' : '',
    kitty ? 'kitty' : '',
    soft ? 'soft-m3' : '',
    focused ? 'focused' : '',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    setPos({ x, y })
  }, [x, y])

  return (
    <div
      className={cls}
      style={{ left: pos.x, top: pos.y, zIndex: focused ? 6 : 4 }}
      onMouseDown={(e) => {
        e.stopPropagation()
        onFocus?.()
      }}
    >
      <div
        className="titlebar"
        onMouseDown={(e) => {
          onFocus?.()
          drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
          const move = (ev: MouseEvent) => {
            if (!drag.current) return
            const next = { x: ev.clientX - drag.current.dx, y: ev.clientY - drag.current.dy }
            setPos(next)
            onMove?.(next)
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
