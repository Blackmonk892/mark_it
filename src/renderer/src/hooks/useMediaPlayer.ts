import { useEffect, useRef, useState } from 'react'
import { MediaTrack } from '../store/MediaContext'

export function useMediaPlayer(currentTrack: MediaTrack | null) {
  const mediaRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (!mediaRef.current || !currentTrack) return

    mediaRef.current.src = currentTrack.previewUrl

    mediaRef.current.play().catch(console.error)
    setIsPlaying(true)
  }, [currentTrack])

  const togglePlay = () => {
    if (!mediaRef.current) return

    if (isPlaying) mediaRef.current.pause()
    else mediaRef.current.play()

    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (mediaRef.current) setProgress(mediaRef.current.currentTime)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)

    if (mediaRef.current) mediaRef.current.currentTime = time

    setProgress(time)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value)

    if (mediaRef.current) mediaRef.current.volume = vol

    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (!mediaRef.current) return

    mediaRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return {
    mediaRef,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    setDuration,
    setIsPlaying,
    togglePlay,
    handleSeek,
    handleTimeUpdate,
    handleVolume,
    toggleMute
  }
}
