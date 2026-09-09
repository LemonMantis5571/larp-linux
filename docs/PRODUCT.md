# LARP Linux — product

## Concept
Client-side web studio for fake Linux desktops. Target use: take a convincing screenshot for Instagram / WhatsApp / X status. Honest landing copy: you are not installing Arch; you are LARPing.

## Loop
1. Landing → **Start LARPing**
2. Setup: DE + name + hostname + wallpaper + accent
3. Fake desktop: bar, icons, draggable windows (terminal neofetch, empty browser, empty files)
4. Optional: paste dots → best-effort rice (colors/layout tokens only)
5. **Export** PNG (story / square / wide)
6. Upload to social. Done.

## Screens

### Landing
Hero with a pretty fake desktop + honest copy + CTA.

### Setup (sidebar or sheet)
- Skin: Hyprland | GNOME | KDE Plasma
- Identity: display name, `user@host`, fake neofetch (CPU/GPU/WM)
- Wallpaper: URL or upload
- Accent color
- Dots: textarea / drop `.conf` / CSS (hyprland colors, waybar, gtk/kde hints)

### Stage (fullscreen desktop)
- Wallpaper + DE chrome
- Fake apps: Terminal (spoofed neofetch), Browser, Files
- Panel with clock + username
- Fixed **Export** control (excluded from PNG)

## Non-goals
No pacman, no real Wayland/Hyprland, no executing configs, no auth, no backend, no telemetry. Partial parse → show *best-effort rice* and continue.

## MVP ship bar
- 3 recognizable skins in a photo
- Identity + wallpaper + accent
- Fake terminal neofetch
- Export PNG (story + square)
- README that tells the truth

## Stack
Vite + React + TypeScript. CSS tokens per skin. `html-to-image` for export. Client-only.

## Later
r/unixporn presets, more fake windows (Spotify/code), X mosaic 1+2 export, share state in URL.
