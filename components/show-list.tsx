"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Heart, Eye, EyeOff, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WatchProvidersModal } from "./watch-providers-modal"
import { useFavorites } from '@/context/favorites-context'
import { useWatched } from '@/context/watched-context'
import { Show } from "@/types/show"
import { Movie } from "@/types/movie"

export interface ShowListProps {
  genreId: number
}

const SORT_METHODS = ['popularity.desc', 'vote_average.desc', 'first_air_date.desc']
const randomPage = () => Math.floor(Math.random() * 6) + 1

// Convertit un Show en Movie pour favoris/watched
function showToMovie(show: Show): Movie {
  return {
    id: show.id,
    title: show.name,
    poster_path: show.poster_path,
    vote_average: show.vote_average,
    release_date: show.first_air_date,
    overview: show.overview,
    media_type: 'show',
  }
}

export function ShowList({ genreId }: ShowListProps) {
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('')
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isWatched, toggleWatched } = useWatched()

  const fetchShows = useCallback(async (pageNumber: number, sortMethod: string, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const timestamp = Date.now()
      const response = await fetch(`/api/shows?genreId=${genreId}&page=${pageNumber}&sort=${sortMethod}&_=${timestamp}`)
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        setTotalPages(data.total_pages || 1)
        setPage(pageNumber)
        if (append) {
          setShows(prev => [...prev, ...data.results.slice(0, 10)])
        } else {
          setShows(data.results.slice(0, 10))
        }
      } else if (!append && pageNumber > 1) {
        // Fallback: page aléatoire vide → retry page 1
        const res2 = await fetch(`/api/shows?genreId=${genreId}&page=1&sort=${sortMethod}&_=${timestamp}`)
        const data2 = await res2.json()
        if (data2.results && data2.results.length > 0) {
          setTotalPages(data2.total_pages || 1)
          setPage(1)
          setShows(data2.results.slice(0, 10))
        }
      }
    } catch (error) {
      console.error("Error fetching shows:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [genreId])

  useEffect(() => {
    const initialSort = SORT_METHODS[Math.floor(Math.random() * SORT_METHODS.length)]
    setSort(initialSort)
    fetchShows(randomPage(), initialSort, false)
  }, [fetchShows])

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && !loading && page < totalPages) {
          fetchShows(page + 1, sort, true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadingMore, loading, page, totalPages, sort, fetchShows])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-black/20 border border-white/5">
            <div className="relative aspect-[2/3] w-full">
              <Skeleton className="absolute inset-0 bg-white/15" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2 bg-white/15" />
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-3 w-10 bg-white/15" />
                <Skeleton className="h-3 w-16 bg-white/15" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (shows.length === 0) {
    return (
      <div className="text-center py-10">
        <Tv className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <p className="text-muted-foreground">No shows found 😔.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {shows.map((show, index) => {
          const movieFormat = showToMovie(show)
          return (
            <Card
              key={`${show.id}-${index}`}
              className="overflow-hidden cursor-pointer bg-black/20 border-white/5
                        transition-all duration-300 ease-out
                        transform hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                        hover:border-white/20 hover:bg-black/30"
              onClick={() => { setSelectedShow(show); setIsModalOpen(true) }}
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "/no-image.png"}
                  alt={show.name}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  priority={index < 5}
                  loading={index >= 5 ? "lazy" : undefined}
                />

                <div className="absolute top-2 left-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                    onClick={e => { e.stopPropagation(); toggleWatched(movieFormat) }}
                    title={isWatched(show.id) ? "Marquer comme non vu" : "Marquer comme vu"}
                  >
                    {isWatched(show.id)
                      ? <EyeOff className="h-4 w-4 text-blue-400" />
                      : <Eye className="h-4 w-4 text-white" />}
                  </Button>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                    onClick={e => { e.stopPropagation(); toggleFavorite(movieFormat) }}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(show.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-medium text-white line-clamp-1">{show.name}</h3>
                <div className="flex items-center justify-between mt-2 text-sm text-white/70">
                  <span>{show.first_air_date?.split("-")[0] || "N/A"}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{show.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
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

      {selectedShow && (
        <WatchProvidersModal
          movieId={selectedShow.id}
          movieTitle={selectedShow.name}
          movieOverview={selectedShow.overview}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mediaType="tv"
        />
      )}
    </div>
  )
}
