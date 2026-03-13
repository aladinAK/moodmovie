"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, RefreshCw, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WatchProvidersModal } from "./watch-providers-modal"
import { useFavorites } from '@/context/favorites-context'
import { Movie } from "@/types/movie";

export interface MovieListProps {
  genreId: number;
}

export function MovieList({ genreId }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  const getDailyPageOffset = () => {
    // Génère un offset basé sur la date (change chaque jour)
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return (dayOfYear % 25) + 1; // Valeur entre 1 et 25 qui change chaque jour
  }
  
  const getRandomSortMethod = () => {
    const sortMethods = [
      'popularity.desc',
      'vote_average.desc',
      'release_date.desc', 
      'revenue.desc'
    ];
    return sortMethods[Math.floor(Math.random() * sortMethods.length)];
  }

  const fetchMovies = useCallback(async (pageNumber: number) => {
    setLoading(true)
    try {
      let targetPage = pageNumber;
      
      if (!targetPage) {
        // Utilise l'offset quotidien comme base + randomisation
        const dailyOffset = getDailyPageOffset();
        // Ajoute une randomisation autour de l'offset quotidien
        targetPage = dailyOffset + Math.floor(Math.random() * 5);
      }
      
      // Assure que la page est entre 1 et 40
      targetPage = Math.min(Math.max(targetPage, 1), 40);
      
      const sortMethod = getRandomSortMethod();
      const response = await fetch(`/api/movies?genreId=${genreId}&page=${targetPage}&sort=${sortMethod}`);
      const data = await response.json();

      // Check if we have results, otherwise show empty state
      if (data.results && data.results.length > 0) {
        setMovies(data.results.slice(0, 10))
        setPage(targetPage) // Mémoriser la page courante
      } else {
        setMovies([])
        console.error("No movies found or API error:", data.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error fetching movies:", error)
      setMovies([])
      // Essayer une autre page si la première échoue
      if (pageNumber < 2) {
        fetchMovies(Math.floor(Math.random() * 5) + 1)
      }
    }  finally {
      setLoading(false)
    }
  }, [genreId])

  useEffect(() => {
    // Au chargement initial, utiliser l'offset quotidien
    fetchMovies(0) // 0 indique qu'on veut utiliser l'offset quotidien
  }, [fetchMovies])
  
  const handleRefresh = () => {
    // Génère une page différente de celle actuellement affichée
    let newPage;
    do {
      // Augmentation de la plage pour compenser le filtrage plus restrictif
      newPage = Math.floor(Math.random() * 40) + 1;
    } while (newPage === page);
    
    // Forcer un nouveau chargement
    setLoading(true);
    fetchMovies(newPage);
  }

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="sticky top-4 z-30 flex justify-end mb-4">
          <Button variant="outline" disabled className="gap-2 bg-black/40 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 stroke-white hover:stroke-black" />
          </Button>
        </div>
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
      </div>
    )
  }

  // Add an empty state when no movies are found
  if (movies.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        <div className="sticky top-4 z-30 flex justify-end mb-4">
          <Button variant="outline" disabled className="gap-2 bg-black/40 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 stroke-white hover:stroke-black" />
          </Button>
        </div>
        <div className="text-center py-10">
          <p className="text-muted-foreground">No movies found 😔.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Container sticky pour le bouton de rafraîchissement */}
      <div className="sticky top-4 z-30 flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="max-md:p-3 rounded-full gap-2 bg-black/40 backdrop-blur-sm border-white/20 shadow-lg hover:bg-white/10"
          title="more movies"
        >
          <RefreshCw className="h-4 w-4 stroke-white hover:stroke-black" />
        </Button>
      </div>
      
      {/* Contenu existant - grille de films */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <Card
            key={movie.id}
            className="overflow-hidden cursor-pointer bg-black/20 border-white/5
                      transition-all duration-300 ease-out 
                      transform hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                      hover:border-white/20 hover:bg-black/30"
            onClick={() => handleMovieClick(movie)}
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/no-image.png"
                }
                alt={movie.title}
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-110"
                priority={index < 5}
                loading={index >= 5 ? "lazy" : undefined}
              />
              
              {/* Bouton de favoris ajouté ici */}
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêche l'ouverture du modal
                    toggleFavorite(movie);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(movie.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                  />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-medium text-white line-clamp-1">{movie.title}</h3>
              <div className="flex items-center justify-between mt-2 text-sm text-white/70">
                <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMovie && (
        <WatchProvidersModal
          movieId={selectedMovie.id}
          movieTitle={selectedMovie.title}
          movieOverview={selectedMovie.overview}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  )
}