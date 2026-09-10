import { appIconKind, appIconSrc, appLabel } from './appIcons'
import type { AppId, Skin } from './types'

export function AppIcon({
  app,
  size = 32,
  skin = 'hyprland',
}: {
  app: AppId
  size?: number
  skin?: Skin
}) {
  const kind = appIconKind({ app, skin })
  const label = appLabel({ app, skin })
  return (
    <img
      className="app-icon"
      src={appIconSrc(kind)}
      alt=""
      width={size}
      height={size}
      draggable={false}
      title={label}
    />
  )
}
