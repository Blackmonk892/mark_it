import React, { createContext, useContext, useState } from 'react'

export interface MediaTrack {
  trackId: string | number
  trackName: string
  artistName: string
  previewUrl: string
  artworkUrl100: string
  kind: string
  isLocal?: boolean
}

interface MediaContextType {
  currentTrack: MediaTrack | null
  searchResults: MediaTrack[]
  localLibrary: MediaTrack[]
  isSearching: boolean
  searchMedia: (query: string) => Promise<void>
  addLocalFolder: () => Promise<void>
  playTrack: (track: MediaTrack) => void
}

export const MediaContext = createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MediaTrack | null>(null)
  const [searchResults, setSearchResults] = useState<MediaTrack[]>([])
  const [localLibrary, setLocalLibrary] = useState<MediaTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchMedia = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      // Use the main process bridge to completely bypass renderer sandbox blocks
      const results = await window.context.searchOnlineMedia(query)

      // Filter items to ensure they contain playable stream links
      const playableTracks = results.filter((item: any) => item.previewUrl)
      setSearchResults(playableTracks)
    } catch (error) {
      console.error('Renderer search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const addLocalFolder = async () => {
    try {
      const newLocalTracks = await window.context.selectLocalMediaFolder()

      if (newLocalTracks && newLocalTracks.length > 0) {
        setLocalLibrary((prev) => {
          const merged = [...prev, ...newLocalTracks]
          const unique = merged.filter(
            (track, index, self) => index === self.findIndex((t) => t.trackId === track.trackId)
          )
          return unique
        })
      }
    } catch (error) {
      console.error('Failed to add local folder:', error)
    }
  }

  const playTrack = (track: MediaTrack) => setCurrentTrack(track)

  return (
    <MediaContext.Provider
      value={{
        currentTrack,
        searchResults,
        localLibrary,
        isSearching,
        searchMedia,
        addLocalFolder,
        playTrack
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const context = useContext(MediaContext)
  if (!context) throw new Error('useMedia must be used within a MediaProvider')
  return context
}
