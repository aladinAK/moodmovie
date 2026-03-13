"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Music, Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Track } from "@/types/track"

export interface MusicListProps {
  genre: string
}

export function MusicList({ genre }: MusicListProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchTracks = useCallback(async (index: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const timestamp = Date.now()
      const response = await fetch(`/api/music?genre=${encodeURIComponent(genre)}&startIndex=${index}&_=${timestamp}`)
      const data = await response.json()

      const newTracks: Track[] = (data.data || []).filter(
        (t: Track) => t.preview && t.album?.cover_medium
      )

      if (newTracks.length === 0) {
        setHasMore(false)
      } else {
        setStartIndex(index)
        setHasMore(newTracks.length >= 20)
        if (append) {
          setTracks(prev => {
            const ids = new Set(prev.map(t => t.id))
            return [...prev, ...newTracks.filter(t => !ids.has(t.id))].slice(0, 60)
          })
        } else {
          setTracks(newTracks)
        }
      }
    } catch (error) {
      console.error("Error fetching music:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [genre])

  useEffect(() => {
    setTracks([])
    setStartIndex(0)
    setHasMore(true)
    setPlayingId(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    fetchTracks(0, false)
  }, [fetchTracks])

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && !loading && hasMore) {
          fetchTracks(startIndex + 40, true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadingMore, loading, hasMore, startIndex, fetchTracks])

  const togglePlay = (track: Track) => {
    if (playingId === track.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const audio = new Audio(track.preview)
    audio.volume = 0.6
    audio.play()
    audio.onended = () => setPlayingId(null)
    audioRef.current = audio
    setPlayingId(track.id)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-black/20 border border-white/5">
            <div className="relative aspect-square w-full">
              <Skeleton className="absolute inset-0 bg-white/15" />
            </div>
            <CardContent className="p-3">
              <Skeleton className="h-4 w-full mb-1 bg-white/15" />
              <Skeleton className="h-3 w-2/3 bg-white/15" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-10">
        <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <p className="text-muted-foreground">No tracks found 😔.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tracks.map((track, index) => (
          <Card
            key={`${track.id}-${index}`}
            className="overflow-hidden bg-black/20 border-white/5
                      transition-all duration-300 ease-out
                      hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                      hover:border-white/20 hover:bg-black/30"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={track.album.cover_medium}
                alt={track.album.title}
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-110"
                loading={index >= 5 ? "lazy" : undefined}
              />

              {/* Play preview */}
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200"
                onClick={() => togglePlay(track)}
                aria-label={playingId === track.id ? "Pause" : "Écouter 30s"}
              >
                <div className="rounded-full bg-white/20 backdrop-blur-sm p-3">
                  {playingId === track.id
                    ? <Pause className="h-6 w-6 text-white fill-white" />
                    : <Play className="h-6 w-6 text-white fill-white" />}
                </div>
              </button>

              {/* Indicateur lecture en cours */}
              {playingId === track.id && (
                <div className="absolute bottom-2 left-2 flex gap-[2px] items-end h-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-white rounded-full animate-bounce"
                      style={{ height: `${8 + (i % 3) * 4}px`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Lien Deezer */}
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                  onClick={() => window.open(track.link, '_blank')}
                  title="Ouvrir sur Deezer"
                >
                  <ExternalLink className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            <CardContent className="p-3">
              <h3 className="font-medium text-white line-clamp-1 text-sm">{track.title}</h3>
              <p className="text-xs text-white/60 line-clamp-1 mt-0.5">{track.artist.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sentinel infinite scroll */}
      <div ref={sentinelRef} className="h-8 flex items-center justify-center">
        {loadingMore && (
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
