"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WatchProvidersModal } from "./watch-providers-modal"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
}

interface MovieListProps {
  genreId: number
}

export function MovieList({ genreId }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    } finally {
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
        <div className="flex justify-end">
          <Button variant="outline" disabled className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Nouvelle sélection
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-[225px] w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
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
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Nouvelle sélection
          </Button>
        </div>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun film trouvé. Veuillez vérifier votre clé API TMDB.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Nouvelle sélection
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {movies.map((movie, index) => (
    <Card
      key={movie.id}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleMovieClick(movie)}
    >
     <div className="relative aspect-[2/3] w-full">
  <Image
    src={
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder.svg?height=300&width=200"
    }
    alt={movie.title}
    fill
    sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
    className="object-cover"
    priority={index < 5} // Augmentez le nombre d'images prioritaires à 5
    loading={index >= 5 ? "lazy" : undefined}
  />
</div>
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
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
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

