import { lyricSlots, type LarpTrack } from './music'
import { CavaBars } from './CavaBars'

export function LyricsPanel({
  track,
  current,
  playing,
  cavaLevels,
  onClose,
  onTogglePlay,
  onPrev,
  onNext,
}: {
  track: LarpTrack
  current: number
  playing: boolean
  cavaLevels: number[]
  onClose: () => void
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const slots = lyricSlots(track, current)
  const mid = Math.floor(slots.length / 2)

  return (
    <div
      className="lyrics-overlay"
      role="dialog"
      aria-label="Lyrics"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="lyrics-card">
        <div className="lyrics-art" style={{ background: track.art }} aria-hidden />
        <CavaBars levels={cavaLevels} className="lyrics-cava" />
        <div className="lyrics-meta">
          <div className="lyrics-title">{track.title}</div>
          <div className="lyrics-artist">
            {track.artist} · {track.album}
          </div>
        </div>
        <div className="lyrics-lines">
          {slots.map((line, i) => {
            const dist = Math.abs(i - mid)
            return (
              <p
                key={`${i}-${line}`}
                className={`lyrics-line dist-${dist}${i === mid ? ' current' : ''}`}
              >
                {line || '\u00a0'}
              </p>
            )
          })}
        </div>
        <div className="lyrics-transport">
          <button type="button" onClick={onPrev} title="Previous">
            skip_previous
          </button>
          <button type="button" className="lyrics-play" onClick={onTogglePlay} title="Play/Pause">
            {playing ? 'pause' : 'play_arrow'}
          </button>
          <button type="button" onClick={onNext} title="Next">
            skip_next
          </button>
          <button type="button" className="lyrics-close" onClick={onClose} title="Close lyrics">
            lyrics
          </button>
        </div>
      </div>
    </div>
  )
}
