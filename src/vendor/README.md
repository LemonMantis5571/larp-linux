# Vendored CSS ports

Visual ports of upstream CSS. Never executed as Waybar, GNOME Shell, or Plasma.
Selectors are mapped onto LARP class names. Tokens and spacing stay.

| File | Ported from | Upstream | Licence |
|------|-------------|----------|---------|
| `vieg-waybar.css` | `.config/waybar/style.css` + `colors.css` | [ViegPhunt/Dotfiles](https://github.com/ViegPhunt/Dotfiles) | MIT |
| `haku-island.css` | `src/home/.config/waybar/island/style.css` + `dockbar/style.css` | [hakuimaku/hakuspace](https://github.com/hakuimaku/hakuspace) | MIT |
| `end4-media.css` | Quickshell `Media.qml` / `Lyrics.qml`, look only | [pctrade/end4-pC](https://github.com/pctrade/end4-pC), after [end-4/dots-hyprland](https://github.com/end-4/dots-hyprland) | GPL-3.0 |
| `amethyst-gnome.css` | `.themes/Catppuccin/gnome-shell/gnome-shell.css` `#panel` / `#dash` / `#dashtodockContainer` | [Aevstiel/amethyst](https://github.com/Aevstiel/amethyst) | LGPL-2.1 on the generated sheet |
| `sweet-gnome.css` | `gnome-shell/gnome-shell.css` `#panel` and running dots | [EliverLara/Sweet](https://github.com/EliverLara/Sweet) | GPL-3.0 |
| `socrates-waybar.css` | `waybar/style.css` + `waybar/config` | [prudhvibungatavula/socrates-KDE](https://github.com/prudhvibungatavula/socrates-KDE) | None declared |
| `catppuccin-plasma.css` | `generated/color-schemes/CatppuccinMochaMauve.colors` | [catppuccin/kde](https://github.com/catppuccin/kde) | MIT |
| `icons.css` | Nerd Font glyphs as `::before` so JSX stays ASCII | [ryanoasis/nerd-fonts](https://github.com/ryanoasis/nerd-fonts) | MIT tooling |

The MIT sources require their copyright notices to travel with redistributed
copies of these files. `end4-media.css` and `sweet-gnome.css` derive from
GPL-3.0 work. See the [Licensing](../../README.md#licensing) section in the
root README.

## App icons

Firefox, Kitty, Files, and Dolphin marks are SVGs in
[`public/icons/apps/`](../../public/icons/apps), not this folder. Papirus
`firefox.svg`, `org.gnome.Nautilus.svg`, and `org.kde.dolphin.svg` are GPL-3.0.
Kitty's mark is `logo/kitty.svg` from [kovidgoyal/kitty](https://github.com/kovidgoyal/kitty)
(GPL-3.0). Those are theme / project icons, not Mozilla marketing art.

## Icon codepoints

Glyphs are declared as `content` in `icons.css` and resolved through the
`--nf` font stack, which is `JetBrainsMono Nerd Font` then `Symbols Nerd Font`.
Those are two separate `@font-face` families on purpose: multiple `url()`
entries inside one `src` are *load* fallbacks, not per-glyph fallbacks, so a
glyph missing from the first font would render as tofu instead of falling
through to the second.

Pick codepoints from the Nerd Fonts set only. Font Awesome 5 codepoints in the
`U+F5xx`–`U+F8xx` range are **not** in Nerd Fonts; `U+F6A9` (volume mute) and
`U+F6AC` (wifi off) both rendered as tofu before being swapped for the Material
Design equivalents `U+F075F` and `U+F05A9`.

Where upstream specifies a literal glyph, this repo uses that exact one:
hakuspace's `󰝟` mute and `󰝚` cavaunderbar, ViegPhunt's `⭘` power and
`󰂯` / `󰂲` bluetooth, and socrates-KDE's `` clock, `󰤆` power, `󰤨` wifi.

## Numbers checked against upstream

ViegPhunt `waybar/config` + `style.css` + `hypr/conf/appearance.conf`:

- modules-left `custom/power`, `hyprland/workspaces`; modules-right `tray`,
  `bluetooth`, `network`, `battery`, `pulseaudio`, `clock`
- clock `{:%a %d/%m/%Y ~ %H:%M}`, bar `alpha(@background, 0.6)`, radius 0
- everything 13px bold JetBrainsMono Nerd Font, radius 5px
- module padding `0 10px` margin `1px 0`; power `0 10px 0 15px` margin-left 10
- workspace idle `padding 0 5px`; active `border 2px @pink`, `padding 0 8px`, `margin 0 2px`
- tray icon-size 20, spacing 10, and **no hover rule** (the other modules hover `alpha(@select,0.6)`)
- windows: `gaps_out 5`, `border_size 2`, `rounding 2`, `col.active_border rgba(cdd6f4aa)`

hakuspace `waybar/island/config` + `style.css` + `module/*` + `cava/config_waybar`:

- left `group/utilities`, `group/hworkspaces`, `group/musics`; center `group/clocks`;
  right `group/monitor`, `group/adjusters`, `group/trays`, `group/tools`
- every group `margin 8px`, `padding 8px`, `rgba(0,0,0,0.8)`, radius 4px,
  `box-shadow 0 0 4px rgba(0,0,0,0.5)`
- modules `margin 1px`, `padding 0 10px`, `min-width 20px`; hover flips to
  black-on-accent with `padding 0 20px`
- so every island is 36px tall except `#hworkspaces`, which is 38px because
  `#workspaces` adds its own 2px padding inside the group
- workspace pills `min-width 10px` → `40px` active, opacity 0.5 → 1
- `group/musics` is `custom/cavaunderbar` + `cava` + `mpris`
- cava `bars = 12`, glyphs `▁▂▃▄▅▆▇█`, `bar_delimiter 0`
- mpris `  / {title}`, `title-len 25`, italic title when paused
- `group/adjusters` is backlight, pulseaudio, battery. pulseaudio drops the
  percentage when muted
- `group/trays` is a bare `tray` (icon-size 18, spacing 10). There is no network
  or bluetooth module on this bar
- `group/tools` is power-profiles-daemon, custom/recorder, custom/recordertime,
  custom/power, custom/notification. recordertime only appears while recording

Aevstiel/amethyst `.themes/Catppuccin/gnome-shell/gnome-shell.css`:

- `#panel` height 35px, `background-color rgba(30, 30, 46, 0.85)`, 12pt bold
- `.panel-button` radius 12px, padding 12px, hover color `#89b4fa` with inset
  `rgba(57, 57, 72, 0.624)`
- Activities extra padding 18px, workspace dots 8px `#eff1f5`
- `#dash .dash-background` radius 23px, overview fill `rgba(49, 50, 68, 0.65)`,
  dock fill `rgba(30, 30, 46, 0.85)`
- `#dashtodockContainer.left #dash` margin-left 6px, padding 12px 0
- running dot 6px, idle `rgba(239, 241, 245, 0.3)`, focused `#e6e9ef`

EliverLara/Sweet `gnome-shell/gnome-shell.css`:

- `#panel` `rgba(34, 46, 57, 0.95)`, height `2.1em`, solid `#222e39`
- hover inset `rgba(63, 85, 105, 0.95)`; active fill `#00e8b7`, text `#272727`
- running dot 4px `#00e8b7` with `box-shadow 0 0 5px 4px rgba(0, 232, 183, 0.8)`

socrates-KDE `waybar/config` + `style.css`:

- `height 48`, `margin-top 6`, `margin-left/right 10`
- modules-left `clock`, `custom/power`, `network`, `custom/bt-status`,
  `custom/microphone`, `custom/vpn`
- modules-center `custom/workspace-1`, `custom/workspace-2`, `custom/asus-profile`,
  `custom/workspace-3`, `custom/workspace-4`
- modules-right `custom/battery`, `custom/volume`, `custom/brightness`
- clock `format: "[   {:%I:%M %p} ]"`, power `"[ 󰤆 ]"`
- `window#waybar` `#282c34`, `#9cdef2`, border 3px `#61afef` / `#56b6c2`
- modules padding `2px 10px`, margin `7px 6px`, fill `#292d35`, border 2px `#61afef`
- clock `#fab387` 12px bold; asus `#e5c07b` 16px bold
- muted pulse `#f38ba8`; hover fill `#4c566a`, border `#56b6c2`

catppuccin/kde `CatppuccinMochaMauve.colors`:

- Header `BackgroundNormal 24,24,37` (`#181825`)
- Window same; View `30,30,46`; Button `49,50,68`
- Selection / DecorationFocus `203,166,247` (`#cba6f7`)
- ForegroundNormal `205,214,244`
- WM `activeBackground 30,30,46`, `activeForeground 205,214,244`
