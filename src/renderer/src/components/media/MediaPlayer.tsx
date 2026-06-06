import { useMedia } from '../../store/MediaContext'

import { AudioPlayerView } from './AudioPlayerView'
import { EmptyPlayer } from './EmptyPlayer'
import { PlayerControls } from './PlayerControls'
import { ProgressBar } from './ProgressBar'
import { VideoPlayerView } from './VideoPlayerView'

import { useMediaPlayer } from '../../hooks/useMediaPlayer'

export function MediaPlayer() {
  const { currentTrack } = useMedia()
  const player = useMediaPlayer(currentTrack)

  if (!currentTrack) {
    return <EmptyPlayer />
  }

  const isVideo = currentTrack.kind.includes('video') || currentTrack.kind.includes('movie')

  return (
    <div className="flex h-full w-full flex-col relative overflow-hidden bg-gradient-to-br from-white/40 to-white/10">
      {isVideo ? (
        <VideoPlayerView
          mediaRef={player.mediaRef}
          onTimeUpdate={player.handleTimeUpdate}
          onLoadedMetadata={() => player.setDuration(player.mediaRef.current?.duration || 0)}
          onEnded={() => player.setIsPlaying(false)}
        />
      ) : (
        <>
          <video
            ref={player.mediaRef}
            className="hidden"
            onTimeUpdate={player.handleTimeUpdate}
            onLoadedMetadata={() => player.setDuration(player.mediaRef.current?.duration || 0)}
            onEnded={() => player.setIsPlaying(false)}
          />

          <AudioPlayerView track={currentTrack} />
        </>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl rounded-2xl border border-white/30 bg-white/60 p-4 shadow-xl backdrop-blur-xl">
        <ProgressBar
          progress={player.progress}
          duration={player.duration}
          onSeek={player.handleSeek}
        />

        <PlayerControls
          isPlaying={player.isPlaying}
          isMuted={player.isMuted}
          volume={player.volume}
          trackName={currentTrack.trackName}
          artistName={currentTrack.artistName}
          onTogglePlay={player.togglePlay}
          onToggleMute={player.toggleMute}
          onVolumeChange={player.handleVolume}
        />
      </div>
    </div>
  )
}
