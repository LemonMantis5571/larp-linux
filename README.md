# LARP Linux

Web app to **LARP** (pretend) Arch Linux desktops for social screenshots.
Hyprland / GNOME / KDE Plasma skins. Visual only. You are not installing Arch.

## Run

```bash
npm install
npm run dev
```

## Features
- Fake Hyprland / GNOME / KDE desktops
- Identity + wallpaper + accent
- Best-effort dotfile color mapping (configs are never executed)
- Export PNG (story / square / wide)

See [docs/PRODUCT.md](docs/PRODUCT.md) and [docs/MVP.md](docs/MVP.md).

## Rice packs
- **default** — generic Hyprland / GNOME / KDE LARP
- **viegphunt** — pixel-oriented Catppuccin Mocha Hyprland LARP of [ViegPhunt/Dotfiles](https://github.com/ViegPhunt/Dotfiles) (visual only; JetBrainsMono Nerd Font for Waybar glyphs; wallpaper picker via **Walls** / Ctrl+Shift+W)
- **mocha-alt** — honest extra LARP pack (blue accent + same wall collection)
- **hakuspace** — cream island bar + dock LARP
- **end4** — Material 3 floating bar + sidebar LARP

Configs are never executed. Wallpapers from ViegPhunt Wallpaper-Collection (raw GitHub URLs).

## Recording a LARP

Use the desktop stage for screen capture. Visual only — configs are never executed.

### Keybinds
| Keys | Action |
|------|--------|
| **Ctrl+1…4** / click WS | Switch workspaces 1–4 (each keeps open apps) |
| **Ctrl+Space** / **Ctrl+;** | Rofi-like launcher (filter + Enter / Esc) |
| **Ctrl+/** / **?** | Keybind overlay |
| **Ctrl+Shift+W** | Wallpaper picker |
| **Alt+← / →** | Cycle wallpaper in pack |
| **H** | Toggle export bar (disabled in record mode) |
| **R** | Record mode — hides export bar **and** peek; Esc / R exits |
| Click terminal + type | Fake shell: `clear`, `neofetch`/`fastfetch`, `ls`, `pwd`, `echo`, `help` |
| Export bar **Demo** | ~16s scripted loop (launcher → terminal → neofetch → WS2 → wall toast) |

### Tips
1. Pick a rice (viegphunt / hakuspace / end4 / mocha-alt / default), enter desktop.
2. Press **R** (or **Record**) so the UI chrome is gone.
3. Optional: click **Demo** first to rehearse the loop, then record manually.
4. Vieg waybar vol/bt toggles toast; haku dock opens apps; end4 dots switch workspaces.


### Windows tip
`Win+Space` / `Win+D` / `Win+1` never reach the page — use **Ctrl+Space** or click **󰘔 / ** on the Vieg waybar.
