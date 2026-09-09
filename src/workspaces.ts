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

export function defaultPos(app: AppId, end4: boolean): WindowPosLike {
  if (app === 'terminal') return { x: end4 ? 320 : 80, y: end4 ? 100 : 90 }
  if (app === 'browser') return { x: end4 ? 560 : 320, y: end4 ? 140 : 120 }
  return { x: end4 ? 720 : 520, y: end4 ? 180 : 160 }
}
