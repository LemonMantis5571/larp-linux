import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { parseDots } from './dots'
import { isRiceId, RICES, riceById, RICE_LIST, SKIN_OPTIONS, wmForSkin, type ChromeKind, type RiceId } from './rices'
import type { AppId, AppState, ExportPreset, Identity, Skin, Toast, WorkspaceId } from './types'
import { WALLPAPERS, cycleWallpaper } from './wallpapers'
import { cssBgUrl, hotlinkLikelyBlocked, normalizeWallUrl, probeImage } from './wallUrl'
import { defaultPos, initialWorkspaces, switchWorkspace } from './workspaces'
import { isTypingTarget } from './keybinds'
import { runFakeCommand, type ShellContext } from './fakeShell'
import { Launcher, type LauncherAction } from './Launcher'
import { KeybindOverlay } from './KeybindOverlay'
import { ToastStack } from './ToastStack'
import { LyricsPanel } from './LyricsPanel'
import { CAVA_BARS, LARP_TRACKS, nextCavaLevels } from './music'
import { ViegWaybar } from './ViegWaybar'
import { HakuChrome } from './HakuChrome'
import { End4Chrome } from './End4Chrome'
import { LimineLanding } from './LimineLanding'
import { AppIcon } from './AppIcon'
import { appLabel } from './appIcons'
import { Wlogout, type WlogoutAction } from './Wlogout'
import { type PowerProfile } from './HakuChrome'
import { GnomeChrome } from './GnomeChrome'
import { KdeChrome } from './KdeChrome'
import { SocratesBar, type AsusProfile } from './SocratesBar'
import './App.css'
import './vendor/vieg-waybar.css'
import './vendor/haku-island.css'
import './vendor/icons.css'
import './vendor/end4-media.css'
import './vendor/amethyst-gnome.css'
import './vendor/sweet-gnome.css'
import './vendor/socrates-waybar.css'
import './vendor/catppuccin-plasma.css'
import './responsive.css'

const DEFAULT_WALL = RICES.viegphunt.wallpaper
const DESKTOP_APPS: AppId[] = ['terminal', 'browser', 'files']
const POWER_PROFILES: PowerProfile[] = ['performance', 'balanced', 'power-saver']
const ASUS_PROFILES: AsusProfile[] = ['Integrated', 'Hybrid', 'Dedicated']

const defaultIdentity: Identity = {
  displayName: 'larper',
  username: 'arch',
  hostname: 'btw',
  cpu: 'AMD Ryzen 9 7950X',
  gpu: 'NVIDIA RTX 4090',
  wm: 'Hyprland',
}

function clockNow(style: ChromeKind, compact = false) {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  if (style === 'haku') {
    if (compact) return `${hh}:${mi}:${ss}`
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]
    return `${hh}:${mi}:${ss}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }
  if (style === 'end4') {
    if (compact) return `${hh}:${mi}`
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${days[d.getDay()]}, ${dd}/${mm} • ${hh}:${mi}`
  }
  if (style === 'gnome') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return `${days[d.getDay()]}  ${hh}:${mi}`
  }
  if (style === 'kde') return `${hh}:${mi}`
  if (style === 'socrates') {
    const h12 = d.getHours() % 12 || 12
    const ampm = d.getHours() < 12 ? 'AM' : 'PM'
    return `${String(h12).padStart(2, '0')}:${mi} ${ampm}`
  }
  if (compact) return `${hh}:${mi}`
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
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
 .\`                                 \`/`

let toastSeq = 1

function formatRec(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function App() {
  const stageRef = useRef<HTMLDivElement>(null)
  const positionsRef = useRef<Partial<Record<AppId, { x: number; y: number }>>>({})
  const demoTimers = useRef<number[]>([])
  const lastPresetRef = useRef<ExportPreset>('story')
  const [exporting, setExporting] = useState(false)
  const [state, setState] = useState<AppState>({
    phase: 'landing',
    skin: 'hyprland',
    rice: 'viegphunt',
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
  const [clock, setClock] = useState(() => clockNow('vieg'))
  const [ptime, setPtime] = useState(promptTime)
  const [showLauncher, setShowLauncher] = useState(false)
  const [showKeybinds, setShowKeybinds] = useState(false)
  const [showWlogout, setShowWlogout] = useState(false)
  const [sleeping, setSleeping] = useState(false)
  const [powerProfile, setPowerProfile] = useState<PowerProfile>('balanced')
  const [recStartedAt, setRecStartedAt] = useState<number | null>(null)
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
  const [micMuted, setMicMuted] = useState(false)
  const [vpnOn, setVpnOn] = useState(true)
  const [asusProfile, setAsusProfile] = useState<AsusProfile>('Hybrid')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [lyricLine, setLyricLine] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const [cavaLevels, setCavaLevels] = useState(() => Array.from({ length: CAVA_BARS }, () => 0.18))
  const [hakuMonitorOpen, setHakuMonitorOpen] = useState(false)
  const [compactChrome, setCompactChrome] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const [weatherTemp, setWeatherTemp] = useState(22)
  const [demoRunning, setDemoRunning] = useState(false)
  const [wsFlash, setWsFlash] = useState(false)
  const track = LARP_TRACKS[trackIndex] ?? LARP_TRACKS[0]

  const pack = riceById(state.rice)
  const isViegLike = pack.chrome === 'vieg'
  const isHaku = pack.chrome === 'haku'
  const isEnd4 = pack.chrome === 'end4'
  const isGnome = pack.chrome === 'gnome'
  const isKde = pack.chrome === 'kde'
  const isSocrates = pack.chrome === 'socrates'
  const showDesktopIcons = isViegLike || isGnome || isKde || isSocrates
  const hasWallPicker = pack.walls.length > 1
  const wallList = pack.walls.length ? pack.walls : WALLPAPERS.map((w) => w.url)
  const clockStyle: ChromeKind = pack.chrome
  const useGhostty = isViegLike
  const workspace = (state.workspace ?? 1) as WorkspaceId
  const riceClassName = pack.className ? ` ${pack.className}` : ''
  const windowLayout = isEnd4
    ? 'end4'
    : isGnome
      ? 'gnome'
      : isKde
        ? 'kde'
        : isSocrates
          ? 'socrates'
          : 'hypr'
  const recOn = recStartedAt !== null
  const recLabel = formatRec(recStartedAt === null ? 0 : Date.now() - recStartedAt)

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
    const mq = window.matchMedia('(max-width: 760px)')
    const sync = () => setCompactChrome(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setClock(clockNow(clockStyle, compactChrome))
      setPtime(promptTime())
    }, 1000)
    setClock(clockNow(clockStyle, compactChrome))
    return () => clearInterval(t)
  }, [clockStyle, compactChrome])

  useEffect(() => () => stopDemo(), [stopDemo])

  const shellCtx: ShellContext = useMemo(() => {
    return {
      username: state.identity.username,
      hostname: state.identity.hostname,
      cwd: `/home/${state.identity.username}`,
      riceLabel: pack.label,
      wm: state.identity.wm,
      cpu: state.identity.cpu,
      gpu: state.identity.gpu,
      terminalName: pack.terminal,
    }
  }, [state.identity, pack.label, pack.terminal])

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

  const toggleMic = useCallback(() => {
    setMicMuted((v) => {
      pushToast(v ? 'Mic on' : 'Mic muted')
      return !v
    })
  }, [pushToast])

  const toggleVpn = useCallback(() => {
    setVpnOn((v) => {
      pushToast(v ? 'VPN disconnected' : 'VPN connected')
      return !v
    })
  }, [pushToast])

  const cycleAsus = useCallback(() => {
    setAsusProfile((cur) => {
      const idx = ASUS_PROFILES.indexOf(cur)
      const next = ASUS_PROFILES[(idx + 1) % ASUS_PROFILES.length]
      pushToast(`asusctl · ${next}`)
      return next
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
    setShowWlogout(false)
    setShowKeybinds(true)
  }, [])

  const openPowerMenu = useCallback(() => {
    setShowLauncher(false)
    setShowKeybinds(false)
    setShowWlogout(true)
  }, [])

  const copyHost = useCallback(() => {
    const text = `${state.identity.username}@${state.identity.hostname}`
    void navigator.clipboard.writeText(text).then(
      () => pushToast(`copied ${text}`),
      () => pushToast(text),
    )
  }, [state.identity.username, state.identity.hostname, pushToast])

  const cyclePowerProfile = useCallback(() => {
    setPowerProfile((cur) => {
      const idx = POWER_PROFILES.indexOf(cur)
      const next = POWER_PROFILES[(idx + 1) % POWER_PROFILES.length]
      pushToast(`power-profiles-daemon · ${next}`)
      return next
    })
  }, [pushToast])

  const toggleHakuRec = useCallback(() => {
    setRecStartedAt((cur) => {
      if (cur !== null) {
        pushToast('wf-recorder stopped')
        return null
      }
      pushToast('wf-recorder · recording')
      return Date.now()
    })
  }, [pushToast])

  const handleWlogout = useCallback(
    (action: WlogoutAction) => {
      setShowWlogout(false)
      if (action === 'lock' || action === 'shutdown') {
        setSleeping(false)
        setState((s) => ({ ...s, phase: 'landing' }))
        pushToast(action === 'lock' ? 'lock' : 'shutdown')
        return
      }
      if (action === 'logout') {
        setState((s) => ({ ...s, phase: 'setup' }))
        pushToast('logout')
        return
      }
      if (action === 'sleep') {
        setSleeping(true)
        pushToast('sleep')
        return
      }
      positionsRef.current = {}
      setTermLines(['LARP shell ready. Type help. Configs are never executed.'])
      setTermInput('')
      setFocusedApp('terminal')
      setShowLauncher(false)
      setShowKeybinds(false)
      setShowLyrics(false)
      setState((s) => ({
        ...s,
        phase: 'stage',
        openApps: ['terminal'],
        workspace: 1,
        workspaces: initialWorkspaces(),
        recordMode: false,
        showWallPicker: false,
      }))
      pushToast('reboot')
    },
    [pushToast],
  )

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
      pushToast(`${next}°C · LARP City`)
      return next
    })
  }, [pushToast])

  const skipTrack = useCallback(
    (dir: 1 | -1) => {
      setTrackIndex((i) => {
        const next = (i + dir + LARP_TRACKS.length) % LARP_TRACKS.length
        pushToast(`${dir > 0 ? 'next' : 'prev'} · ${LARP_TRACKS[next].title}`)
        return next
      })
      setLyricLine(0)
    },
    [pushToast],
  )

  const toggleMusic = useCallback(() => {
    setMusicPlaying((v) => {
      pushToast(v ? `paused · ${track.title}` : `playing · ${track.title}`)
      return !v
    })
  }, [pushToast, track.title])

  useEffect(() => {
    const id = window.setInterval(() => {
      setCavaLevels((prev) => nextCavaLevels(prev, musicPlaying))
    }, musicPlaying ? 90 : 240)
    return () => window.clearInterval(id)
  }, [musicPlaying])

  useEffect(() => {
    if (!musicPlaying) return
    const id = window.setInterval(() => {
      setLyricLine((n) => (n + 1) % track.lyrics.length)
    }, 2800)
    return () => window.clearInterval(id)
  }, [musicPlaying, track.lyrics.length])

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
    at(5000, () => {
      setMusicPlaying(true)
      pushToast(`playing · ${LARP_TRACKS[0].title}`)
    })
    at(7200, () => setShowLyrics(true))
    at(11500, () => {
      setShowLyrics(false)
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
      const overlayOpen =
        showLauncher || showKeybinds || showLyrics || showWlogout || sleeping || !!state.showWallPicker
      const shellFocused =
        !overlayOpen &&
        focusedApp === 'terminal' &&
        state.openApps.includes('terminal') &&
        !typing
      const mod = e.metaKey || e.ctrlKey || e.altKey
      // Fake term is not an <input>, so letter hotkeys must yield while it has focus.
      const swallowBare = typing || (shellFocused && !mod)

      // Record mode toggle / exit
      if (!swallowBare && (e.key === 'r' || e.key === 'R') && !mod) {
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

      if (sleeping && e.key === 'Escape') {
        e.preventDefault()
        setSleeping(false)
        pushToast('resume')
        return
      }

      if (showWlogout && e.key === 'Escape') {
        e.preventDefault()
        setShowWlogout(false)
        return
      }

      if (showLyrics && e.key === 'Escape') {
        e.preventDefault()
        setShowLyrics(false)
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

      // Keybind overlay Ctrl+/ always. Bare ? only when not feeding the shell.
      if (!typing && e.ctrlKey && !e.altKey && (e.key === '/' || e.code === 'Slash')) {
        e.preventDefault()
        setShowLauncher(false)
        setShowKeybinds((v) => !v)
        return
      }
      if (!swallowBare && e.key === '?') {
        e.preventDefault()
        setShowLauncher(false)
        setShowKeybinds((v) => !v)
        return
      }

      // Export bar H (not record mode, not Super)
      if (!swallowBare && !state.recordMode && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault()
        setState((s) => ({ ...s, showExportBar: !s.showExportBar }))
        return
      }

      // Export E. Without this you cannot shoot with the bar hidden, which is
      // the whole point of hiding it.
      if (!swallowBare && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        void exportPng(lastPresetRef.current)
        return
      }

      if (!swallowBare && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault()
        toggleMusic()
        return
      }
      if (!swallowBare && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault()
        setShowLyrics((v) => !v)
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
      if (shellFocused) {
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
    showLyrics,
    showWlogout,
    sleeping,
    toggleMusic,
    focusedApp,
    termInput,
    goWorkspace,
    runShellLine,
    pushToast,
  ])

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
      { k: 'Terminal', v: pack.terminal },
      { k: 'Rice', v: `${pack.label} (LARP)` },
    ]
  }, [state.identity, pack.terminal, pack.label])

  function applyRice(id: RiceId) {
    const next = riceById(id)
    setState((s) => ({
      ...s,
      rice: id,
      skin: next.skin,
      accent: next.accent,
      border: next.border,
      wallpaper: next.wallpaper,
      dotsText: next.dotsSample,
      dotsNote: next.credit || s.dotsNote,
      identity: { ...s.identity, wm: wmForSkin(next.skin) },
      showWallPicker: false,
    }))
  }

  function bootRice(id: RiceId, phase: 'setup' | 'stage') {
    const next = riceById(id)
    setState((s) => ({
      ...s,
      phase,
      rice: id,
      skin: next.skin,
      accent: next.accent,
      border: next.border,
      wallpaper: next.wallpaper,
      dotsText: next.dotsSample,
      dotsNote: next.credit,
      identity: { ...s.identity, wm: wmForSkin(next.skin) },
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
    lastPresetRef.current = preset
    setExporting(true)
    try {
      const size =
        preset === 'story' ? { w: 1080, h: 1920 } : preset === 'square' ? { w: 1080, h: 1080 } : { w: 1920, h: 1080 }
      // let React paint with the chrome unmounted before we snapshot
      await new Promise<void>((res) => {
        requestAnimationFrame(() => requestAnimationFrame(() => res()))
      })
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        width: node.clientWidth,
        height: node.clientHeight,
        filter: (n) => !(n instanceof HTMLElement && n.dataset.larpChrome !== undefined),
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
      <LimineLanding
        onSetup={() => setState((s) => ({ ...s, phase: 'setup' }))}
        onBoot={(id) => bootRice(id, 'stage')}
        onEdit={(id) => bootRice(id, 'setup')}
      />
    )
  }

  if (state.phase === 'setup') {
    const i = state.identity
    return (
      <div
        className={`setup-shell${riceClassName}`}
        style={
          {
            '--accent': state.accent,
            backgroundImage: cssBgUrl(state.wallpaper),
          } as CSSProperties
        }
      >
      <div className="setup">
        <div className="setup-titlebar">
          <span className="setup-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="setup-title">
            {i.username}@{i.hostname}: ~/.config/larp
          </span>
          <span className="setup-tag">visual only</span>
        </div>
        <header>
          <h1>Setup your LARP</h1>
          <p>No packages. No real DE. Dotfiles are never executed.</p>
        </header>
        <div className="setup-grid">
          <label>
            Desktop
            <select
              value={state.skin}
              onChange={(e) => {
                const skin = e.target.value as Skin
                if (pack.skin === skin) return
                const next = RICE_LIST.find((rice) => rice.skin === skin)
                if (next) applyRice(next.id)
              }}
            >
              {SKIN_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Rice pack
            <select
              value={state.rice}
              onChange={(e) => {
                if (isRiceId(e.target.value)) applyRice(e.target.value)
              }}
            >
              {RICE_LIST.filter((rice) => rice.skin === state.skin).map((rice) => (
                <option key={rice.id} value={rice.id}>
                  {rice.label}
                </option>
              ))}
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
            <span className="accent-row">
              <input
                type="color"
                value={state.accent}
                onChange={(e) => setState((s) => ({ ...s, accent: e.target.value }))}
              />
              <code>{state.accent}</code>
            </span>
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
      </div>
    )
  }

  const showChrome = !exporting && !state.recordMode && state.showExportBar !== false
  const showPeek = !exporting && !state.recordMode && state.showExportBar === false
  const termPos = positionsRef.current.terminal ?? defaultPos('terminal', windowLayout)
  const browserPos = positionsRef.current.browser ?? defaultPos('browser', windowLayout)
  const filesPos = positionsRef.current.files ?? defaultPos('files', windowLayout)

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
          if (!showLauncher && !showKeybinds && !showWlogout && !sleeping) setFocusedApp(null)
        }}
      >
        {isViegLike ? (
          <ViegWaybar
            workspace={workspace}
            goWorkspace={goWorkspace}
            clock={clock}
            btOn={btOn}
            wifiOn={wifiOn}
            volMuted={volMuted}
            volLevel={volLevel}
            onPower={openPowerMenu}
            onToggleBt={toggleBt}
            onToggleWifi={toggleWifi}
            onBattery={toastBattery}
            onToggleVol={toggleVol}
            onClock={openClock}
            onTrayFiles={() => openApp('files')}
            onTrayClip={copyHost}
          />
        ) : isHaku ? (
          <HakuChrome
            workspace={workspace}
            goWorkspace={goWorkspace}
            clock={clock}
            volMuted={volMuted}
            volLevel={volLevel}
            brightness={brightness}
            musicPlaying={musicPlaying}
            track={track}
            cavaLevels={cavaLevels}
            monitorOpen={hakuMonitorOpen}
            openApps={state.openApps}
            powerProfile={powerProfile}
            recLabel={recLabel}
            recOn={recOn}
            onLauncher={() => setShowLauncher(true)}
            onSettings={() => setState((s) => ({ ...s, phase: 'setup' }))}
            onClock={openClock}
            onToggleMusic={toggleMusic}
            onOpenLyrics={() => setShowLyrics(true)}
            onToggleMonitor={() => setHakuMonitorOpen((v) => !v)}
            onCycleBrightness={cycleBrightness}
            onToggleVol={toggleVol}
            onBattery={toastBattery}
            onPower={openPowerMenu}
            onOpenApp={openApp}
            onTrayFiles={() => openApp('files')}
            onTrayClip={copyHost}
            onPowerProfile={cyclePowerProfile}
            onToggleRec={toggleHakuRec}
          />
        ) : isEnd4 ? (
          <End4Chrome
            workspace={workspace}
            goWorkspace={goWorkspace}
            cycleNextWorkspace={cycleNextWorkspace}
            clock={clock}
            ptime={ptime}
            wifiOn={wifiOn}
            volMuted={volMuted}
            musicPlaying={musicPlaying}
            track={track}
            weatherTemp={weatherTemp}
            displayName={state.identity.displayName}
            onLauncher={() => {
              setShowKeybinds(false)
              setShowLauncher(true)
            }}
            onClock={openClock}
            onToggleWifi={toggleWifi}
            onToggleVol={toggleVol}
            onOpenLyrics={() => setShowLyrics(true)}
            onToggleMusic={toggleMusic}
            onSkip={() => skipTrack(1)}
            onWeather={toastWeather}
            onUser={() => setState((s) => ({ ...s, phase: 'setup' }))}
          />
        ) : isGnome ? (
          <GnomeChrome
            workspace={workspace}
            goWorkspace={goWorkspace}
            clock={clock}
            displayName={state.identity.displayName}
            focusedApp={focusedApp}
            openApps={state.openApps}
            wifiOn={wifiOn}
            volMuted={volMuted}
            onLauncher={() => {
              setShowKeybinds(false)
              setShowLauncher(true)
            }}
            onClock={openClock}
            onToggleWifi={toggleWifi}
            onToggleVol={toggleVol}
            onOpenApp={openApp}
            onUser={() => setState((s) => ({ ...s, phase: 'setup' }))}
            onPower={openPowerMenu}
          />
        ) : isSocrates ? (
          <SocratesBar
            workspace={workspace}
            goWorkspace={goWorkspace}
            clock={clock}
            btOn={btOn}
            wifiOn={wifiOn}
            volMuted={volMuted}
            volLevel={volLevel}
            brightness={brightness}
            micMuted={micMuted}
            vpnOn={vpnOn}
            asusProfile={asusProfile}
            onPower={openPowerMenu}
            onToggleBt={toggleBt}
            onToggleWifi={toggleWifi}
            onToggleMic={toggleMic}
            onToggleVpn={toggleVpn}
            onToggleVol={toggleVol}
            onBattery={toastBattery}
            onClock={openClock}
            onCycleBrightness={cycleBrightness}
            onCycleAsus={cycleAsus}
          />
        ) : (
          <KdeChrome
            workspace={workspace}
            goWorkspace={goWorkspace}
            clock={clock}
            focusedApp={focusedApp}
            openApps={state.openApps}
            wifiOn={wifiOn}
            volMuted={volMuted}
            btOn={btOn}
            onLauncher={() => {
              setShowKeybinds(false)
              setShowLauncher(true)
            }}
            onClock={openClock}
            onToggleWifi={toggleWifi}
            onToggleVol={toggleVol}
            onToggleBt={toggleBt}
            onBattery={toastBattery}
            onOpenApp={openApp}
            onPower={openPowerMenu}
          />
        )}

        {showDesktopIcons && (
          <div className="icons">
            {DESKTOP_APPS.map((app) => (
              <button
                key={app}
                type="button"
                className={state.openApps.includes(app) ? 'on' : undefined}
                onClick={() => openApp(app)}
              >
                <AppIcon app={app} size={48} skin={state.skin} />
                {appLabel({ app, skin: state.skin })}
              </button>
            ))}
          </div>
        )}

        <div className={`windows${wsFlash ? ' windows-swap' : ''}`}>
          {state.openApps.includes('terminal') && (
            <FakeWindow
              title={`${pack.terminal} — ${state.identity.username}@${state.identity.hostname}:~`}
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
              title={state.skin === 'kde' ? 'Dolphin — Home' : state.skin === 'gnome' ? 'Files — Home' : 'Home'}
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
        {showWlogout && <Wlogout onPick={handleWlogout} onClose={() => setShowWlogout(false)} />}
        {sleeping && (
          <button
            type="button"
            className="sleep-veil"
            aria-label="Wake"
            onClick={() => {
              setSleeping(false)
              pushToast('resume')
            }}
          >
            sleep
          </button>
        )}
        {showLyrics && (
          <LyricsPanel
            track={track}
            current={lyricLine}
            playing={musicPlaying}
            cavaLevels={cavaLevels}
            onClose={() => setShowLyrics(false)}
            onTogglePlay={toggleMusic}
            onPrev={() => skipTrack(-1)}
            onNext={() => skipTrack(1)}
          />
        )}
        {showKeybinds && <KeybindOverlay onClose={() => setShowKeybinds(false)} />}

        <ToastStack toasts={toasts} />
      </div>

      {showChrome && (
        <div className={`export-bar${riceClassName}`} data-larp-chrome>
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
          className={`export-peek${riceClassName}`}
          data-larp-chrome
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
