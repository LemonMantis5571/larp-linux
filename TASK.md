# Cursor task: build LARP Linux MVP

Implement this in the current repo. Commit on a branch and open a PR to `main`, or land on `main` if that is simpler for an empty starter.

## Product
Client-side web studio to **LARP** (pretend) Arch Linux desktops for social screenshots. Skins: Hyprland, GNOME, KDE Plasma. Visual only. Honest copy: you are not installing Arch.

## Ship
Vite + React + TypeScript SPA.

1. Landing with honest CTA (**Start LARPing**).
2. Setup: DE skin, identity (display name, `user@host`, fake neofetch CPU/GPU/WM), wallpaper URL or file upload, accent color, optional dotfile paste (best-effort map colors into CSS tokens; never execute configs; show “best-effort rice” when partial).
3. Fake desktop stage: wallpaper, DE chrome/panel, icons, draggable/focusable windows — Terminal (spoofed neofetch), empty Browser, empty Files.
4. Export PNG of the stage only (`html-to-image` or equivalent). Presets: story + square. Export chrome must not appear in the PNG.
5. Write `docs/PRODUCT.md`, `docs/MVP.md`, and a truthful README (`npm install && npm run dev`; dots = visual only).
6. `npm run build` must succeed.

## Non-goals
No backend, auth, telemetry, pacman, real Wayland/Hyprland, or executing user configs.

## Done when
A stranger can pick a DE, set a name, open terminal neofetch, export a PNG, and build is green.
