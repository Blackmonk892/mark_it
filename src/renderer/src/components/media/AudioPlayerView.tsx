import { FiMusic } from 'react-icons/fi'
import { MediaTrack } from '../../store/MediaContext'

interface Props {
  track: MediaTrack
}

export function AudioPlayerView({ track }: Props) {
  const highResArt = track.artworkUrl100.replace('100x100', '600x600bb')

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 pb-32 animate-in fade-in zoom-in-95 duration-500">
      {highResArt ? (
        <img
          src={highResArt}
          alt="Album Art"
          className="h-64 w-64 md:h-80 md:w-80 rounded-2xl object-cover shadow-2xl border border-white/40 ring-4 ring-white/20"
        />
      ) : (
        <div className="h-64 w-64 rounded-2xl bg-slate-200 flex items-center justify-center shadow-2xl border border-white/40">
          <FiMusic className="h-20 w-20 text-slate-400" />
        </div>
      )}

      <h2 className="mt-8 text-2xl font-bold text-slate-800 drop-shadow-sm">{track.trackName}</h2>

      <p className="mt-2 text-lg font-medium text-slate-500">{track.artistName}</p>
    </div>
  )
}
