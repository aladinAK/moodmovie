"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart, Trash2 } from "lucide-react"
import { useFavorites } from "@/context/favorites-context"
import { WatchProvidersModal } from "./watch-providers-modal"
import { Movie } from "@/types/movie"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FavoritesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const { favorites, toggleFavorite, clearAllFavorites } = useFavorites()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsProviderModalOpen(true)
  }

  const closeProviderModal = () => {
    setIsProviderModalOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/80 backdrop-blur-md border-white/10">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl custom-font font-bold">My Favorite Movies</DialogTitle>
          
          {/* Bouton pour effacer tous les favoris - visible uniquement quand il y a des favoris */}
          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-6 top-0 gap-1 bg-black/40 backdrop-blur-sm border-white/20 hover:bg-black/60 hover:text-red-400"
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="max-sm:hidden">Clear All</span>
            </Button>
          )}
        </DialogHeader>

        {favorites.length === 0 ? (
          <div className="py-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h2 className="text-xl text-white custom-font mb-2">No favorites yet</h2>
            <p className="text-white/70 mb-4">
              Add movies to your favorites by clicking the heart icon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {favorites.map((movie) => (
              <Card
                key={movie.id}
                className="overflow-hidden bg-black/20 border-white/5
                        transition-all duration-300 ease-out hover:border-white/20 hover:bg-black/30"
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover cursor-pointer"
                    onClick={() => handleMovieClick(movie)}
                  />
                  
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                      onClick={() => toggleFavorite(movie)}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4 cursor-pointer" onClick={() => handleMovieClick(movie)}>
                  <h3 className="font-medium text-white line-clamp-1">{movie.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-white/70">
                    <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>

      {/* Modal de confirmation pour Clear All */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="bg-black/80 backdrop-blur-md border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Favorites?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This will remove all movies from your favorites. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent px-3 border-white/20 hover:bg-black/40 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500/20 px-3 hover:bg-red-500/40 text-white border border-red-500/50"
              onClick={() => {
                clearAllFavorites();
                setIsConfirmDialogOpen(false);
              }}
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedMovie && (
        <WatchProvidersModal
          movieId={selectedMovie.id}
          movieTitle={selectedMovie.title}
          movieOverview={selectedMovie.overview}
          isOpen={isProviderModalOpen}
          onClose={closeProviderModal}
        />
      )}
    </Dialog>
  )
}