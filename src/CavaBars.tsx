import { cavaGlyphs } from './music'

export function CavaBars({
  levels,
  className,
  title,
}: {
  levels: number[]
  className?: string
  title?: string
}) {
  return (
    <span className={className} title={title} aria-hidden>
      {cavaGlyphs(levels)}
    </span>
  )
}
