import { Movie } from "@/types/movie";

// Clé utilisée pour stocker les favoris dans localStorage
const FAVORITES_KEY = 'moodmovie_favorites';

// Récupérer les favoris depuis localStorage
export function getFavorites(): Movie[] {
  if (typeof window === 'undefined') return [];
  
  const favoritesJSON = localStorage.getItem(FAVORITES_KEY);
  if (!favoritesJSON) return [];
  
  try {
    return JSON.parse(favoritesJSON);
  } catch (error) {
    console.error('Error parsing favorites:', error);
    return [];
  }
}

// Ajouter un film aux favoris
export function addToFavorites(movie: Movie): void {
  const favorites = getFavorites();
  
  // Vérifier si le film est déjà dans les favoris
  if (!favorites.some(fav => fav.id === movie.id)) {
    // Ajouter le film et sauvegarder
    const newFavorites = [...favorites, movie];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }
}

// Retirer un film des favoris
export function removeFromFavorites(movieId: number): void {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
}

// Vérifier si un film est dans les favoris
export function isMovieFavorite(movieId: number): boolean {
  const favorites = getFavorites();
  return favorites.some(movie => movie.id === movieId);
}

// Basculer l'état favori d'un film (ajouter s'il n'est pas présent, retirer s'il l'est)
export function toggleFavorite(movie: Movie): boolean {
  const isFavorite = isMovieFavorite(movie.id);
  
  if (isFavorite) {
    removeFromFavorites(movie.id);
    return false;
  } else {
    addToFavorites(movie);
    return true;
  }
}