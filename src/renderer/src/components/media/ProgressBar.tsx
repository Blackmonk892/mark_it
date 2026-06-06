import { formatTime } from '../../utils/index'

interface Props {
  progress: number
  duration: number
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProgressBar({ progress, duration, onSeek }: Props) {
  return (
    <div className="flex items-center gap-3 mb-2 px-2">
      <span className="text-xs font-medium text-slate-500 w-10 text-right">
        {formatTime(progress)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 100}
        value={progress}
        onChange={onSeek}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-300/50 accent-slate-700 hover:accent-blue-500 transition-all"
      />

      <span className="text-xs font-medium text-slate-500 w-10">{formatTime(duration)}</span>
    </div>
  )
}
