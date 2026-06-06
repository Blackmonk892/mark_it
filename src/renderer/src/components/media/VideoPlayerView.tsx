interface Props {
  mediaRef: React.RefObject<HTMLVideoElement>
  onTimeUpdate: () => void
  onLoadedMetadata: () => void
  onEnded: () => void
}

export function VideoPlayerView({ mediaRef, onTimeUpdate, onLoadedMetadata, onEnded }: Props) {
  return (
    <video
      ref={mediaRef}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onEnded={onEnded}
      className="h-full w-full object-contain p-4 pb-28"
    />
  )
}
