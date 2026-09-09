# Vendored CSS ports

Visual ports of upstream CSS. Never executed as Waybar or Quickshell.
Selectors are mapped onto LARP class names. Tokens and spacing stay.

| File | Ported from | Upstream | Licence |
|------|-------------|----------|---------|
| `vieg-waybar.css` | `.config/waybar/style.css` + `colors.css` | [ViegPhunt/Dotfiles](https://github.com/ViegPhunt/Dotfiles) | MIT |
| `haku-island.css` | `src/home/.config/waybar/island/style.css` + `dockbar/style.css` | [hakuimaku/hakuspace](https://github.com/hakuimaku/hakuspace) | MIT |
| `end4-media.css` | Quickshell `Media.qml` / `Lyrics.qml`, look only | [pctrade/end4-pC](https://github.com/pctrade/end4-pC), after [end-4/dots-hyprland](https://github.com/end-4/dots-hyprland) | GPL-3.0 |
| `icons.css` | Nerd Font glyphs as `::before` so JSX stays ASCII | [ryanoasis/nerd-fonts](https://github.com/ryanoasis/nerd-fonts) | MIT tooling |

The MIT sources require their copyright notices to travel with redistributed
copies of these files, and `end4-media.css` derives from GPL-3.0 work. See the
[Licensing status](../../README.md#licensing-status) section in the root README.

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
hakuspace's `󰝟` mute and `󰝚` cavaunderbar, and ViegPhunt's `⭘` power and
`󰂯` / `󰂲` bluetooth.

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
