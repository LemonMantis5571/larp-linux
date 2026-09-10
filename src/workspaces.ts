import type { AppId, WorkspaceId, WorkspaceSnap } from './types'

export const WORKSPACE_IDS: WorkspaceId[] = [1, 2, 3, 4]

export function emptySnap(seedTerminal = false): WorkspaceSnap {
  return {
    openApps: seedTerminal ? ['terminal'] : [],
    positions: {},
  }
}

export function initialWorkspaces(): Record<WorkspaceId, WorkspaceSnap> {
  return {
    1: emptySnap(true),
    2: emptySnap(false),
    3: emptySnap(false),
    4: emptySnap(false),
  }
}

export function switchWorkspace(
  workspaces: Record<WorkspaceId, WorkspaceSnap>,
  from: WorkspaceId,
  to: WorkspaceId,
  currentApps: AppId[],
  positions: Partial<Record<AppId, WindowPosLike>>,
): { workspaces: Record<WorkspaceId, WorkspaceSnap>; openApps: AppId[] } {
  const next = { ...workspaces }
  next[from] = {
    openApps: [...currentApps],
    positions: { ...positions },
  }
  const target = next[to] ?? emptySnap(false)
  return {
    workspaces: next,
    openApps: [...target.openApps],
  }
}

type WindowPosLike = { x: number; y: number }

export type WindowLayout = 'end4' | 'hypr' | 'gnome' | 'kde' | 'socrates'

export function defaultPos(app: AppId, layout: WindowLayout): WindowPosLike {
  if (layout === 'end4') {
    if (app === 'terminal') return { x: 320, y: 100 }
    if (app === 'browser') return { x: 560, y: 140 }
    return { x: 720, y: 180 }
  }
  if (layout === 'gnome') {
    if (app === 'terminal') return { x: 96, y: 72 }
    if (app === 'browser') return { x: 340, y: 108 }
    return { x: 540, y: 148 }
  }
  if (layout === 'kde') {
    if (app === 'terminal') return { x: 80, y: 64 }
    if (app === 'browser') return { x: 320, y: 100 }
    return { x: 520, y: 140 }
  }
  if (layout === 'socrates') {
    if (app === 'terminal') return { x: 80, y: 86 }
    if (app === 'browser') return { x: 320, y: 118 }
    return { x: 520, y: 156 }
  }
  if (app === 'terminal') return { x: 80, y: 90 }
  if (app === 'browser') return { x: 320, y: 120 }
  return { x: 520, y: 160 }
}
