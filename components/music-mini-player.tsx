"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Play, Pause, X } from "lucide-react"
import { useMusicPlayer } from "@/context/music-player-context"

export function MusicMiniPlayer() {
  const { currentTrack, isPlaying, toggle, dismiss } = useMusicPlayer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || !currentTrack) return null

  return createPortal(
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/85 border border-white/20 shadow-2xl w-[min(340px,calc(100vw-2rem))]">
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
        <Image
          src={currentTrack.album.cover_medium}
          alt={currentTrack.album.title}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium line-clamp-1">{currentTrack.title}</p>
        <p className="text-white/60 text-xs line-clamp-1">{currentTrack.artist.name}</p>
        {isPlaying ? (
          <div className="flex gap-[2px] items-end h-2 mt-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-[2px] bg-white/60 rounded-full animate-bounce"
                style={{ height: `${4 + (i % 3) * 3}px`, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-[10px] mt-1">En pause</p>
        )}
      </div>

      <button
        onClick={() => toggle(currentTrack)}
        className="rounded-full bg-white/20 hover:bg-white/30 p-2 transition-colors shrink-0"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying
          ? <Pause className="h-4 w-4 text-white fill-white" />
          : <Play className="h-4 w-4 text-white fill-white" />
        }
      </button>

      <button
        onClick={dismiss}
        className="rounded-full bg-white/10 hover:bg-white/20 p-1.5 transition-colors shrink-0"
        aria-label="Fermer"
      >
        <X className="h-3 w-3 text-white/60" />
      </button>
    </div>,
    document.body
  )
}
