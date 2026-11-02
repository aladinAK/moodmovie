"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Movie } from "@/types/movie"
import { getFavorites, toggleFavorite as toggleFavoriteUtil, removeManyFromFavorites } from '@/lib/favorites';

// Définir le type du contexte
interface FavoritesContextType {
  favorites: Movie[];
  isFavorite: (movieId: number) => boolean;
  toggleFavorite: (movie: Movie) => void;
  removeFavorites: (ids: number[]) => void;
}

// Créer le contexte avec une valeur initiale undefined
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Créer le provider qui enveloppera l'application
export function FavoritesProvider({ children }: { children: ReactNode }) {
  // État local pour stocker les favoris
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Charger les favoris depuis localStorage au montage du composant.
  // Lecture après hydratation volontaire : le rendu serveur n'a pas accès à localStorage.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Fonction pour retirer plusieurs favoris (ex. tous les livres)
  const removeFavorites = useCallback((ids: number[]) => {
    removeManyFromFavorites(ids);
    const idSet = new Set(ids);
    setFavorites(prev => prev.filter(m => !idSet.has(m.id)));
  }, []);

  // Fournir le contexte avec ses valeurs
  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        isFavorite, 
        toggleFavorite: handleToggleFavorite,
        removeFavorites
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