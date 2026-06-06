import { useState } from 'react'
import { FiFolderPlus, FiHardDrive, FiMusic, FiSearch, FiVideo } from 'react-icons/fi'
import { MediaTrack, useMedia } from '../../store/MediaContext'
import { cn } from '../../utils'

export function MediaSidebar() {
  const [query, setQuery] = useState('')
  const {
    searchResults,
    localLibrary,
    isSearching,
    searchMedia,
    addLocalFolder,
    currentTrack,
    playTrack
  } = useMedia()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchMedia(query)
  }

  const TrackItem = ({ track }: { track: MediaTrack }) => (
    <div
      onClick={() => playTrack(track)}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-all',
        currentTrack?.trackId === track.trackId
          ? 'bg-white/80 shadow-sm border border-slate-200/50'
          : 'hover:bg-white/50 border border-transparent'
      )}
    >
      {track.artworkUrl100 ? (
        <img
          src={track.artworkUrl100}
          alt="art"
          className="h-10 w-10 rounded-md object-cover shadow-sm"
        />
      ) : (
        <div className="h-10 w-10 rounded-md bg-slate-200 flex items-center justify-center shadow-sm">
          {track.kind === 'video' ? (
            <FiVideo className="text-slate-400" />
          ) : (
            <FiMusic className="text-slate-400" />
          )}
        </div>
      )}

      <div className="flex flex-col overflow-hidden">
        <span className="truncate text-sm font-semibold text-slate-800">{track.trackName}</span>
        <span className="truncate text-[10px] text-slate-500 flex items-center gap-1 font-medium">
          {track.isLocal ? (
            <FiHardDrive className="h-3 w-3 text-blue-400" />
          ) : track.kind.includes('video') ? (
            <FiVideo className="h-3 w-3 text-rose-400" />
          ) : (
            <FiMusic className="h-3 w-3 text-purple-400" />
          )}
          {track.artistName}
        </span>
      </div>
    </div>
  )

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-white/30 bg-white/25 backdrop-blur-md">
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Discover & Play
          </h2>

          <button
            onClick={addLocalFolder}
            className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-slate-800 hover:text-white text-slate-500 transition-all shadow-sm border border-slate-200 bg-white/50"
            title="Add Local Media Folder"
          >
            <FiFolderPlus className="h-3.5 w-3.5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (e.target.value === '') searchMedia('') // Clear results if empty
            }}
            placeholder="Search online media..."
            className="w-full rounded-lg border border-white/40 bg-white/50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400/50 focus:bg-white/70 transition-all shadow-sm"
          />
          <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {localLibrary.length > 0 && (
          <div>
            <h3 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Local Library
            </h3>
            <div className="space-y-1">
              {localLibrary.map((track) => (
                <TrackItem key={track.trackId} track={track} />
              ))}
            </div>
          </div>
        )}

        {query && (
          <div>
            <h3 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Online Results
            </h3>
            {isSearching ? (
              <div className="text-center text-sm text-slate-400 mt-2 animate-pulse">
                Searching iTunes...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-sm text-slate-400 mt-2">
                No online results found.
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((track) => (
                  <TrackItem key={track.trackId} track={track} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
