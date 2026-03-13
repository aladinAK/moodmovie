"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { Track } from "@/types/track"

interface MusicPlayerContextValue {
  currentTrack: Track | null
  isPlaying: boolean
  toggle: (track: Track) => void
  pause: () => void
  dismiss: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextValue>({
  currentTrack: null,
  isPlaying: false,
  toggle: () => {},
  pause: () => {},
  dismiss: () => {},
})

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audio.volume = 0.6
    audio.onended = () => setIsPlaying(false)
    audioRef.current = audio
    return () => { audio.pause(); audio.src = "" }
  }, [])

  const toggle = (track: Track) => {
    const audio = audioRef.current
    if (!audio) return

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.play().catch(console.error)
        setIsPlaying(true)
      }
    } else {
      audio.pause()
      audio.src = track.preview
      audio.play().catch(console.error)
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const pause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const dismiss = () => {
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.src = "" }
    setIsPlaying(false)
    setCurrentTrack(null)
  }

  return (
    <MusicPlayerContext.Provider value={{ currentTrack, isPlaying, toggle, pause, dismiss }}>
      {children}
    </MusicPlayerContext.Provider>
  )
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)
