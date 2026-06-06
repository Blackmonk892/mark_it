import { FiPause, FiPlay, FiVolume2, FiVolumeX } from 'react-icons/fi'

interface PlayerControlsProps {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  trackName: string
  artistName: string
  onTogglePlay: () => void
  onToggleMute: () => void
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PlayerControls({
  isPlaying,
  isMuted,
  volume,
  trackName,
  artistName,
  onTogglePlay,
  onToggleMute,
  onVolumeChange
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-between px-4">
      {/* Left: Track Info Mini */}
      <div className="w-1/3 flex flex-col overflow-hidden">
        <span className="truncate text-sm font-bold text-slate-800">{trackName}</span>

        <span className="truncate text-xs text-slate-500">{artistName}</span>
      </div>

      {/* Center: Play/Pause */}
      <div className="w-1/3 flex justify-center">
        <button
          onClick={onTogglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-md hover:scale-105 hover:bg-slate-700 transition-all"
        >
          {isPlaying ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5 ml-1" />}
        </button>
      </div>

      {/* Right: Volume */}
      <div className="w-1/3 flex justify-end items-center gap-2">
        <button
          onClick={onToggleMute}
          className="text-slate-500 hover:text-slate-800 transition-colors"
        >
          {isMuted || volume === 0 ? (
            <FiVolumeX className="h-4 w-4" />
          ) : (
            <FiVolume2 className="h-4 w-4" />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={onVolumeChange}
          className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-slate-300/50 accent-slate-700 hover:accent-blue-500 transition-all"
        />
      </div>
    </div>
  )
}
