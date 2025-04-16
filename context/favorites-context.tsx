"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Movie } from "@/types/movie"
import { getFavorites, toggleFavorite as toggleFavoriteUtil } from '@/lib/favorites';

// Définir le type du contexte
interface FavoritesContextType {
  favorites: Movie[];
  isFavorite: (movieId: number) => boolean;
  toggleFavorite: (movie: Movie) => void;
  clearAllFavorites: () => void;  // Ajout de la fonction pour effacer tous les favoris
}

// Constante pour la clé de stockage local
const FAVORITES_KEY = 'moodmovie_favorites';

// Créer le contexte avec une valeur initiale undefined
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Créer le provider qui enveloppera l'application
export function FavoritesProvider({ children }: { children: ReactNode }) {
  // État local pour stocker les favoris
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Charger les favoris depuis localStorage au montage du composant
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Fonction pour vérifier si un film est dans les favoris
  const isFavorite = (movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  };

  // Fonction pour basculer l'état favori d'un film
  const handleToggleFavorite = (movie: Movie) => {
    // Utiliser la fonction utilitaire qui gère localStorage
    const isNowFavorite = toggleFavoriteUtil(movie);
    
    // Mettre à jour l'état local en fonction du résultat
    if (isNowFavorite) {
      setFavorites(prev => [...prev, movie]); // Ajouter aux favoris
    } else {
      setFavorites(prev => prev.filter(m => m.id !== movie.id)); // Retirer des favoris
    }
  };

  // Fonction pour effacer tous les favoris
  const clearAllFavorites = useCallback(() => {
    // Vider localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FAVORITES_KEY);
    }
    // Mettre à jour l'état
    setFavorites([]);
  }, []);

  // Fournir le contexte avec ses valeurs
  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        isFavorite, 
        toggleFavorite: handleToggleFavorite,
        clearAllFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte facilement
export function useFavorites() {
  const context = useContext(FavoritesContext);
  
  // Vérifier que le hook est utilisé dans un composant enfant du Provider
  if (context === undefined) {
    throw new Error('useFavorites doit être utilisé à l\'intérieur de FavoritesProvider');
  }
  
  return context;
}