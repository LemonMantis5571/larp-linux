# LARP Linux

Fake an Arch Linux desktop in your browser and export it as a PNG.

Pick a Hyprland, GNOME, or KDE skin, load a rice pack ported from real
dotfiles, and shoot a screenshot for the timeline. Nothing is installed and no
config is ever executed. You are not installing Arch. You are LARPing.

- [Quick start](#quick-start)
- [What this is and is not](#what-this-is-and-is-not)
- [Rice packs](#rice-packs)
- [Keybinds](#keybinds)
- [Exporting a screenshot](#exporting-a-screenshot)
- [Recording a LARP](#recording-a-larp)
- [Project layout](#project-layout)
- [How faithful are the ports?](#how-faithful-are-the-ports)
- [Attributions](#attributions)
- [Licensing status](#licensing-status)

## Quick start

```bash
npm install
npm run dev
```

Then open the printed URL, hit **LARP ViegPhunt** (or any pack) on the landing
page, and you are on a desktop.

| Script | Does |
|--------|------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | oxlint |

## What this is and is not

**It is** a client-only React app that draws convincing still frames of Linux
desktops: waybar-ish bars, floating windows, a fake shell that answers
`neofetch`, a fake MPRIS player with a cava visualiser, and a PNG exporter.

**It is not** a desktop environment, an installer, or a dotfile manager. The
"Dotfiles" box on the setup screen only scrapes colours and a wallpaper path
out of pasted text with regexes — see [`src/dots.ts`](src/dots.ts). Pasted
config is never parsed as code and never executed. There is no backend and no
shell access.

## Rice packs

Each pack is a visual port of somebody's real, published dotfiles. Full
attribution and licences are in [Attributions](#attributions).

| Pack | Ported from | Bar / chrome |
|------|-------------|--------------|
| `default` | — | Generic Hyprland / GNOME / KDE LARP |
| `viegphunt` | [ViegPhunt/Dotfiles](https://github.com/ViegPhunt/Dotfiles) | Catppuccin Mocha waybar: power + workspaces, then tray, bluetooth, network, battery, volume, clock |
| `mocha-alt` | same as above | Same waybar with a blue accent instead of pink |
| `hakuspace` | [hakuimaku/hakuspace](https://github.com/hakuimaku/hakuspace) | Island waybar: utilities, workspaces, cava + mpris, clock, monitor drawer, adjusters, tray, tools, plus the dockbar |
| `end4` | [pctrade/end4-pC](https://github.com/pctrade/end4-pC) | Material 3 top bar with media chip and a lyrics overlay |

## Keybinds

Press **Ctrl+/** in the app for this list at any time.

| Keys | Action |
|------|--------|
| **Ctrl+1…4** / click WS | Switch workspaces 1–4 (each keeps its open apps) |
| **Ctrl+Space** / **Ctrl+;** | Rofi-like launcher (filter, Enter, Esc) |
| **Ctrl+/** / **?** | Keybind overlay |
| **Ctrl+Shift+W** | Wallpaper picker |
| **Alt+← / →** | Cycle wallpaper within the pack |
| **M** / **L** | Fake MPRIS play/pause, lyrics overlay |
| **H** | Toggle the export bar |
| **E** | Export PNG with the last preset — works while the bar is hidden |
| **R** | Record mode: hides the export bar *and* its peek button; Esc or R exits |
| Click terminal, then type | Fake shell: `clear`, `neofetch`/`fastfetch`, `ls`, `pwd`, `echo`, `help` |
| **Demo** button | ~16s scripted loop: launcher, terminal, neofetch, play + lyrics, WS2, wallpaper |

On Windows, `Win+Space` / `Win+D` / `Win+1` are swallowed by the OS and never
reach the page. Use **Ctrl+Space** for the launcher.

## Exporting a screenshot

Three presets, all rendered at 2× and centre-cropped: **story** (1080×1920),
**square** (1080×1080), and **wide** (1920×1080).

The export bar and its peek button are never captured. They live outside the
captured node, they unmount before the snapshot is taken, and they are also
excluded by a `data-larp-chrome` filter. So hide the bar with **H** for a clean
frame and still export with **E**.

## Recording a LARP

1. Pick a pack and enter the desktop.
2. Press **R** for record mode so all app chrome disappears.
3. Optionally click **Demo** first to rehearse the loop, then record manually
   with OBS or your screen recorder.

The Vieg waybar raises toasts for volume and bluetooth. Haku's cava and mpris
modules and the end4 media chip are all driven by the same fake player
(`src/music.ts`). The dock still opens windows.

## Project layout

```
src/
  App.tsx           phases (landing → setup → stage), keybinds, export, demo
  ViegWaybar.tsx    ViegPhunt waybar
  HakuChrome.tsx    hakuspace island bar + dockbar
  End4Chrome.tsx    end4 Material 3 bar
  CavaBars.tsx      fake cava visualiser
  LyricsPanel.tsx   lyrics overlay
  music.ts          fake MPRIS playlist + cava level maths
  rices.ts          rice pack definitions
  dots.ts           regex-only colour/wallpaper scraping
  fakeShell.ts      the pretend shell
  wallpapers.ts     wallpaper lists and URL handling
  vendor/           CSS ported from upstream dotfiles (see its README)
docs/               PRODUCT.md, MVP.md
```

Deeper design notes: [docs/PRODUCT.md](docs/PRODUCT.md) and
[docs/MVP.md](docs/MVP.md).

## How faithful are the ports?

Close on the numbers, not identical on the pixels.

The Vieg and Haku bars are hand-ported from upstream GTK CSS onto DOM
elements. Module order, format strings, padding, margins, radii, font sizes,
and colour tokens are copied from the real configs, and
[`src/vendor/README.md`](src/vendor/README.md) records every value that was
checked against upstream. But Waybar renders through GTK with its own box
model and font hinting, so glyphs will never land on exactly the same pixels.

Anything upstream does with a shell script — `hakumenu.sh`, `record.sh`,
brightness control, or hakuspace's wallpaper-derived accent that regenerates
`colors.css` — is a hardcoded value here.

`end4` is the loosest of the three and deliberately so. Upstream is a
Quickshell config, meaning `shell.qml` and its `services/` are QML with real
MPRIS and lyrics backends. What this app has is CSS shaped to resemble that
media chip and lyrics card. It is a resemblance, not a port.

## Attributions

This project is a tribute act. Every rice pack exists because someone else
published their dotfiles. Please go star their repos.

### Dotfiles

| Upstream | Author | Licence | What this repo took |
|----------|--------|---------|---------------------|
| [ViegPhunt/Dotfiles](https://github.com/ViegPhunt/Dotfiles) | [@ViegPhunt](https://github.com/ViegPhunt) | MIT | `.config/waybar/config`, `style.css`, `colors.css`, and window numbers from `hypr/conf/appearance.conf` |
| [hakuimaku/hakuspace](https://github.com/hakuimaku/hakuspace) | [@hakuimaku](https://github.com/hakuimaku) | MIT | `waybar/island/` and `dockbar/` styles, the `module/*` configs, and `cava/config_waybar` |
| [pctrade/end4-pC](https://github.com/pctrade/end4-pC) | [@pctrade](https://github.com/pctrade) | GPL-3.0 | Visual look of the Quickshell `Media.qml` and `Lyrics.qml` panels |
| [end-4/dots-hyprland](https://github.com/end-4/dots-hyprland) | [@end-4](https://github.com/end-4) | GPL-3.0 | The original the `end4` pack descends from, via pctrade's fork |

Ported CSS lives in [`src/vendor/`](src/vendor) and is loaded as plain
stylesheets. It is never run by Waybar or Quickshell.

### Fonts

| Font | Source | Licence |
|------|--------|---------|
| JetBrainsMono Nerd Font, Symbols Nerd Font | [ryanoasis/nerd-fonts](https://github.com/ryanoasis/nerd-fonts), bundled in `public/fonts/` | Nerd Fonts tooling is MIT; each patched font keeps its original licence |
| JetBrains Mono (the base typeface) | [JetBrains](https://www.jetbrains.com/lp/mono/), via `@fontsource/jetbrains-mono` CDN | SIL OFL 1.1 |
| Material Symbols Rounded | [Google Fonts](https://fonts.google.com/icons) CDN | Apache 2.0 |

### Wallpapers

| Asset | Source | Licence |
|-------|--------|---------|
| Vieg wallpaper collection | [ViegPhunt/Wallpaper-Collection](https://github.com/ViegPhunt/Wallpaper-Collection), hotlinked from raw GitHub | **No licence declared** |
| `public/walls/end4/default_wallpaper.png` | Bundled from pctrade/end4-pC | GPL-3.0 |
| `public/walls/lisa-blackpink-4k.jpg` | Third-party promo art originally from uhdpaper.com, bundled only because that host blocks hotlinking | **No licence, copyright retained by its owner** |

hakuspace ships no wallpapers in-repo (it reads `~/Pictures`), so that pack
borrows the Vieg collection and the end4 default.

### Libraries

[React](https://react.dev) and [Vite](https://vite.dev) (both MIT),
[html-to-image](https://github.com/bubkoo/html-to-image) (MIT) for the PNG
export, plus TypeScript and [oxlint](https://oxc.rs).

## Licensing status

Worth knowing before you publish or distribute this:

- **There is no `LICENSE` file in this repo yet.** By default that means all
  rights reserved and nobody else may reuse it.
- The `end4` pack derives from **GPL-3.0** work and bundles a wallpaper from a
  GPL-3.0 repo. If you distribute this app, that copyleft has to be dealt with
  rather than ignored.
- Two wallpaper sources carry **no licence at all** (see the table above). The
  bundled BLACKPINK image in particular is third-party copyrighted art and is
  the first thing to remove if this ever ships publicly.
- The MIT-licensed dotfiles (Vieg, hakuspace) require their copyright notices
  to travel with any redistributed copy of the ported CSS.
