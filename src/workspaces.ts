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

export type WindowLayout = 'end4' | 'gnome' | 'kde' | 'default'

export function defaultPos(app: AppId, layout: WindowLayout | boolean): WindowPosLike {
  const kind: WindowLayout = layout === true ? 'end4' : layout === false ? 'default' : layout
  if (kind === 'end4') {
    if (app === 'terminal') return { x: 320, y: 100 }
    if (app === 'browser') return { x: 560, y: 140 }
    return { x: 720, y: 180 }
  }
  if (kind === 'gnome') {
    if (app === 'terminal') return { x: 72, y: 64 }
    if (app === 'browser') return { x: 300, y: 96 }
    return { x: 500, y: 132 }
  }
  if (kind === 'kde') {
    if (app === 'terminal') return { x: 72, y: 40 }
    if (app === 'browser') return { x: 300, y: 76 }
    return { x: 500, y: 112 }
  }
  if (app === 'terminal') return { x: 80, y: 90 }
  if (app === 'browser') return { x: 320, y: 120 }
  return { x: 520, y: 160 }
}
