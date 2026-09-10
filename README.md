# LARP Linux

Arch desktop screenshots without installing Arch.

Boot a rice, click around like it is Hyprland, export a PNG. Nothing is
installed. No config ever runs. You are LARPing.

- [Quick start](#quick-start)
- [What this is](#what-this-is)
- [Rice packs](#rice-packs)
- [Keybinds](#keybinds)
- [Exporting a screenshot](#exporting-a-screenshot)
- [Recording a LARP](#recording-a-larp)
- [Project layout](#project-layout)
- [How close are the ports](#how-close-are-the-ports)
- [Attributions](#attributions)
- [Licensing](#licensing)

## Quick start

```bash
npm install
npm run dev
```

Open the printed URL. First screen is a Limine boot list. Arrows pick a rice,
Enter boots, `e` opens setup.

| Script | Does |
|--------|------|
| `npm run dev` | Vite with HMR |
| `npm run build` | `tsc -b` then production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | oxlint |

## What this is

A client-only React app that draws Arch desktops for the timeline. Waybar,
GNOME panel, Plasma panel, floating windows, a shell that answers `neofetch`,
fake MPRIS with cava, a PNG exporter.

It is not a DE, an installer, or a dots manager. The setup "Dotfiles" box
scrapes colours and a wallpaper path with regexes in
[`src/dots.ts`](src/dots.ts). Pasted config is never executed. No backend. No
shell.

## Rice packs

Seven packs. All of them are visual ports of published dots.

| Pack | From | Chrome |
|------|------|--------|
| `viegphunt` | [ViegPhunt/Dotfiles](https://github.com/ViegPhunt/Dotfiles) | Catppuccin Mocha waybar: power, workspaces, tray, bluetooth, network, battery, volume, clock |
| `hakuspace` | [hakuimaku/hakuspace](https://github.com/hakuimaku/hakuspace) | Island waybar plus dock. Cava, mpris, monitor drawer, adjusters, tools |
| `end4` | [pctrade/end4-pC](https://github.com/pctrade/end4-pC) | Material 3 top bar, media chip, lyrics overlay, sidebar widgets |
| `gnome-amethyst` | [Aevstiel/amethyst](https://github.com/Aevstiel/amethyst) | GNOME Shell Catppuccin Mocha panel, left Dash to Dock, DING icons |
| `gnome-sweet` | [EliverLara/Sweet](https://github.com/EliverLara/Sweet) | GNOME Shell candy teal panel, bottom dash |
| `kde-socrates` | [prudhvibungatavula/socrates-KDE](https://github.com/prudhvibungatavula/socrates-KDE) | Waybar on Plasma Wayland. Clock, power, net, workspaces around asusctl, battery |
| `kde-catppuccin` | [catppuccin/kde](https://github.com/catppuccin/kde) | Mocha Mauve Breeze panel. Kickoff, pager, tasks, tray |

Power opens wlogout. Lock and shutdown go back to the boot list. Logout goes to
setup. Sleep blacks the screen until you click. Reboot resets the session on
the same rice. Activities, kickoff, dash, and tasks open the matching window.

## Keybinds

Press **Ctrl+/** in the app for this list.

| Keys | Action |
|------|--------|
| **Ctrl+1…4** / click WS | Switch workspaces 1–4 |
| **Ctrl+Space** / **Ctrl+;** | Launcher |
| **Ctrl+/** / **?** | Keybind overlay |
| **Ctrl+Shift+W** | Wallpaper picker |
| **Alt+← / →** | Cycle wallpaper in the pack |
| **M** / **L** | Fake MPRIS play/pause, lyrics |
| **H** | Toggle the export bar |
| **E** | Export PNG with the last preset, even if the bar is hidden |
| **R** | Record mode. Hides the export bar and the peek button. Esc or R exits |
| Click terminal, then type | Fake shell: `clear`, `neofetch`/`fastfetch`, `ls`, `pwd`, `echo`, `help` |
| **Demo** button | Scripted loop: launcher, terminal, neofetch, play + lyrics, WS2, wallpaper |

Windows swallows `Win+Space` / `Win+D` / `Win+1`. Use **Ctrl+Space** for the
launcher.

## Exporting a screenshot

Three presets, rendered at 2× and centre-cropped. **story** 1080×1920,
**square** 1080×1080, **wide** 1920×1080.

The export bar and peek button are never in the shot. They live outside the
captured node, they unmount before snapshot, and `data-larp-chrome` filters
them too. Hide the bar with **H** and still export with **E**.

## Recording a LARP

1. Pick a pack and enter the desktop.
2. Press **R** so app chrome disappears.
3. Hit **Demo** if you want a rehearsal, then record with OBS or whatever.

Vieg toasts volume and bluetooth. Haku cava/mpris and the end4 media chip share
the same fake player in `src/music.ts`. The dock opens windows.

## Project layout

```
src/
  App.tsx           landing → setup → stage, keybinds, export, demo
  LimineLanding.tsx boot menu
  ViegWaybar.tsx    ViegPhunt waybar
  HakuChrome.tsx    hakuspace island bar + dock
  End4Chrome.tsx    end4 Material 3 bar
  GnomeChrome.tsx   GNOME panel + dash
  KdeChrome.tsx     Plasma kickoff + tasks
  SocratesBar.tsx   socrates-KDE waybar
  Wlogout.tsx       lock / logout / sleep / reboot / shutdown
  CavaBars.tsx      fake cava
  LyricsPanel.tsx   lyrics overlay
  music.ts          fake MPRIS + cava maths
  rices.ts          the seven packs
  dots.ts           regex colour / wallpaper scrape
  fakeShell.ts      pretend shell
  wallpapers.ts     wall lists and URLs
  vendor/           CSS ported from upstream dots
docs/               PRODUCT.md, MVP.md
```

More notes in [docs/PRODUCT.md](docs/PRODUCT.md) and [docs/MVP.md](docs/MVP.md).

## How close are the ports

Close on the numbers, not identical on the pixels.

Vieg and Haku bars are hand-ported from upstream GTK CSS onto DOM. Module
order, format strings, padding, margins, radii, font sizes, and colour tokens
match the real configs. [`src/vendor/README.md`](src/vendor/README.md) lists
what was checked. Waybar still renders through GTK, so glyphs will not land on
the same pixels.

Shell scripts from upstream (`hakumenu.sh`, `record.sh`, brightness, hakuspace
regenerating `colors.css` from the wallpaper) are hardcoded values here.

`end4` is the loosest on purpose. Upstream is Quickshell QML with real MPRIS.
This app has CSS that looks like that media chip and lyrics card.

Amethyst and Sweet take `#panel` / dash metrics from the real gnome-shell.css
and map them onto DOM. The 151KB Amethyst sheet stays upstream. Socrates is a
straight waybar port, same as Vieg. Catppuccin Plasma is Breeze chrome painted
with Mocha Mauve tokens from `CatppuccinMochaMauve.colors`, not a cloned
aurorae theme.

## Attributions

Tribute act. The packs exist because people published their dots.

### Dotfiles

| Upstream | Author | Licence | What we took |
|----------|--------|---------|--------------|
| [ViegPhunt/Dotfiles](https://github.com/ViegPhunt/Dotfiles) | [@ViegPhunt](https://github.com/ViegPhunt) | MIT | `.config/waybar/config`, `style.css`, `colors.css`, window numbers from `hypr/conf/appearance.conf` |
| [hakuimaku/hakuspace](https://github.com/hakuimaku/hakuspace) | [@hakuimaku](https://github.com/hakuimaku) | MIT | `waybar/island/` and `dockbar/` styles, `module/*` configs, `cava/config_waybar` |
| [pctrade/end4-pC](https://github.com/pctrade/end4-pC) | [@pctrade](https://github.com/pctrade) | GPL-3.0 | Look of Quickshell `Media.qml` and `Lyrics.qml` |
| [end-4/dots-hyprland](https://github.com/end-4/dots-hyprland) | [@end-4](https://github.com/end-4) | GPL-3.0 | The original end4 descends from, via pctrade's fork |
| [Aevstiel/amethyst](https://github.com/Aevstiel/amethyst) | [@Aevstiel](https://github.com/Aevstiel) | LGPL-2.1 on the generated gnome-shell.css | `#panel`, `#dash`, Dash to Dock numbers |
| [EliverLara/Sweet](https://github.com/EliverLara/Sweet) | [@EliverLara](https://github.com/EliverLara) | GPL-3.0 | `gnome-shell/gnome-shell.css` panel and dash dots |
| [prudhvibungatavula/socrates-KDE](https://github.com/prudhvibungatavula/socrates-KDE) | [@prudhvibungatavula](https://github.com/prudhvibungatavula) | None declared | `waybar/config`, `waybar/style.css` |
| [catppuccin/kde](https://github.com/catppuccin/kde) | [Catppuccin](https://github.com/catppuccin) | MIT | `generated/color-schemes/CatppuccinMochaMauve.colors` |

Ported CSS lives in [`src/vendor/`](src/vendor) as plain stylesheets. Waybar,
GNOME Shell, and Plasma never see it.

### Fonts

| Font | Source | Licence |
|------|--------|---------|
| JetBrainsMono Nerd Font, Symbols Nerd Font | [ryanoasis/nerd-fonts](https://github.com/ryanoasis/nerd-fonts), bundled in `public/fonts/` | Nerd Fonts tooling is MIT. Each patched font keeps its original licence |
| JetBrains Mono | [JetBrains](https://www.jetbrains.com/lp/mono/), via `@fontsource/jetbrains-mono` CDN | SIL OFL 1.1 |
| Material Symbols Rounded | [Google Fonts](https://fonts.google.com/icons) CDN | Apache 2.0 |

### Icons

| Asset | Source | Licence |
|-------|--------|---------|
| `firefox.svg`, `files-nautilus.svg`, `files-dolphin.svg` | [Papirus](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme) in `public/icons/apps/` | GPL-3.0 |
| `kitty.svg` | [kovidgoyal/kitty](https://github.com/kovidgoyal/kitty) `logo/kitty.svg` | GPL-3.0 |

### Wallpapers

| Asset | Source | Licence |
|-------|--------|---------|
| Vieg wallpaper collection | [ViegPhunt/Wallpaper-Collection](https://github.com/ViegPhunt/Wallpaper-Collection), hotlinked from raw GitHub | No licence declared |
| `public/walls/end4/default_wallpaper.png` | Bundled from pctrade/end4-pC | GPL-3.0 |
| `public/walls/lisa-blackpink-4k.jpg` | Third-party promo art, bundled because uhdpaper blocks hotlinks | No licence. Owner keeps copyright |

Hakuspace reads `~/Pictures`. We pointed it at the Vieg dump and the end4
default. That is the LARP.

### Libraries

[React](https://react.dev) and [Vite](https://vite.dev) (MIT),
[html-to-image](https://github.com/bubkoo/html-to-image) (MIT), TypeScript,
[oxlint](https://oxc.rs).

## Licensing

No `LICENSE` file, so all rights reserved by default.

The `end4` and `gnome-sweet` packs derive from GPL-3.0 work. `end4` also
bundles a GPL wallpaper. If you ship this, that copyleft is in the box.

Two wallpaper sources have no licence. The bundled BLACKPINK still is someone
else's art.

MIT dots (Vieg, hakuspace, catppuccin/kde) want their copyright notices to
travel with the ported CSS.
