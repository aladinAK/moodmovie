"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MovieList } from "@/components/movie-list"
import { BookList } from "@/components/book-list"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart, Film, BookOpen } from "lucide-react"
import { FavoritesModal } from "@/components/favorites-modal"

// Map moods to genres
const moodGenreMap = {
  joy: { id: 35, name: "Comédie" },
  sadness: { id: 18, name: "Drame" },
  disgust: { id: 27, name: "Horreur" },
  fear: { id: 53, name: "Thriller" },
  anger: { id: 28, name: "Action" },
  surprise: { id: 9648, name: "Mystère" },
}

// Map moods to book subjects
const moodBookMap = {
  joy: { subject: "humor", name: "Humour" },
  sadness: { subject: "drama", name: "Drame" },
  disgust: { subject: "horror", name: "Horreur" },
  fear: { subject: "thriller", name: "Thriller" },
  anger: { subject: "action", name: "Action" },
  surprise: { subject: "mystery", name: "Mystère" },
}

// Mapping des textes à afficher par humeur
const moodTextMap = {
  default: "...", // Nouveau texte par défaut
  joy: "LAUGH",
  sadness: "CRY",
  disgust: "BE SHOCKED",
  fear: "BE SCARED",
  anger: "FEEL ENERGIZED",
  surprise: "BE SURPRISED",
};

export default function Home() {
  // Changer l'état initial à null pour qu'aucune bulle ne soit sélectionnée
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [displayText, setDisplayText] = useState(moodTextMap.default)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)
  const [contentType, setContentType] = useState<'movies' | 'books'>('movies')

  const handleMoodSelect = (mood: string) => {
    if (mood !== selectedMood && !isTransitioning) {
      setIsTransitioning(true)
      setSelectedMood(mood)
    }
  }
  
  // Gestion de la transition du texte
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        // Si selectedMood est null, afficher le texte par défaut
        setDisplayText(selectedMood 
          ? moodTextMap[selectedMood as keyof typeof moodTextMap] 
          : moodTextMap.default)
        setIsTransitioning(false)
      }, 400)
      
      return () => clearTimeout(timer)
    }
  }, [selectedMood, isTransitioning])
  
  // Gestion des classes du body
  useEffect(() => {
    // Supprimer toutes les classes de couleur
    document.body.classList.remove(
      'radial-bg-joy', 
      'radial-bg-sadness', 
      'radial-bg-disgust', 
      'radial-bg-fear', 
      'radial-bg-anger', 
      'radial-bg-surprise'
    );
    
    // Si une humeur est sélectionnée, ajouter la classe correspondante
    // Sinon, s'assurer que la classe radial-bg est appliquée
    if (selectedMood) {
      document.body.classList.remove('radial-bg');
      document.body.classList.add(`radial-bg-${selectedMood}`);
    } else {
      document.body.classList.add('radial-bg');
    }
  }, [selectedMood]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Bouton d'accès aux favoris et sélecteur de contenu */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button 
              variant={contentType === 'movies' ? 'default' : 'outline'}
              className="gap-2 px-4 bg-black/40 backdrop-blur-sm border-white/20 rounded-full hover:text-white hover:bg-black/60"
              onClick={() => setContentType('movies')}
            >
              <Film className="h-4 w-4" />
              <span className="max-sm:hidden">Movies</span>
            </Button>
            <Button 
              variant={contentType === 'books' ? 'default' : 'outline'}
              className="gap-2 px-4 bg-black/40 backdrop-blur-sm border-white/20 rounded-full hover:text-white hover:bg-black/60"
              onClick={() => setContentType('books')}
            >
              <BookOpen className="h-4 w-4" />
              <span className="max-sm:hidden">Books</span>
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2 px-4 bg-black/40 backdrop-blur-sm border-white/20 rounded-full hover:text-white hover:bg-black/60"
            title="Mes favoris"
            onClick={() => setIsFavoritesModalOpen(true)}
          >
            <Heart className="h-4 w-4" />
            <span className="max-sm:hidden">Favorites</span>
          </Button>
        </div>

        <div className="relative flex flex-col items-center my-10 max-sm:mt-0 max-sm:mb-6">
          <h1 className="custom-font text-7xl max-sm:text-3xl text-center font-bold text-white z-10 mb-5">
            I WANT TO <br />
            <span 
              className={cn(
                "text-6xl max-sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600",
                "transition-all duration-800",
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
            >
              {displayText}
            </span>
          </h1>

          <div className="w-full flex justify-center flex-wrap gap-3 items-center mt-8">
            {Object.entries(moodGenreMap).map(([mood], index) => {
              const animations = [
                "animate-float-1",
                "animate-float-2", 
                "animate-float-3",
              ];
              
              return (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={cn(
                    "backdrop-blur-md shadow-glow rounded-full w-24 h-24",
                    "flex items-center justify-center text-center custom-font text-xs font-medium",
                    animations[index % animations.length],
                    "transition-all duration-500 ease-in-out",
                    selectedMood === mood
                       ? "bg-white/40 border-2 border-white text-white scale-125 shadow-xl z-20 animate-subtle-pulse" 
                        : "bg-white/10 border border-white/30 text-white/70 hover:bg-white/15 hover:scale-110"
                  )}
                >
                  {mood === "joy"
                    ? "LAUGH"
                    : mood === "sadness"
                      ? "CRY"
                      : mood === "disgust"
                        ? "SHOCK"
                        : mood === "fear"
                          ? "SCARE"
                          : mood === "anger"
                            ? "ENERGY"
                            : "SURPRISE"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Afficher une section par défaut ou celle qui correspond à l'humeur */}
        {selectedMood ? (
          <Tabs value={selectedMood} className="max-w-4xl mx-auto">
            {Object.entries(moodGenreMap).map(([mood, genre]) => (
              <TabsContent key={mood} value={mood} className="mt-0">
                <Card className="backdrop-blur-md bg-black/30 border-white/10">
                  <CardContent className="pt-6">
                    {contentType === 'movies' ? (
                      <MovieList genreId={genre.id} />
                    ) : (
                      <BookList subject={moodBookMap[mood as keyof typeof moodBookMap].subject} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          // Section d'accueil lorsqu'aucune humeur n'est sélectionnée
          <Card className="backdrop-blur-md bg-black/30 border-white/10">
            <CardContent className="pt-6 text-center py-16">
              <h2 className="text-2xl text-white custom-font mb-4">
                Select your mood above to find {contentType === 'movies' ? 'movies' : 'books'}
              </h2>
              <p className="text-white/70">
                Choose one of the mood bubbles above to discover {contentType === 'movies' ? 'films' : 'books'} that match your current emotional state.
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Modal des favoris */}
        <FavoritesModal 
          isOpen={isFavoritesModalOpen} 
          onClose={() => setIsFavoritesModalOpen(false)} 
        />
      </div>
    </div>
  )
}