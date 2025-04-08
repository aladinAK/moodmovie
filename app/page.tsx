"use client"

import { useState, useEffect } from "react"  // Ajout de useEffect
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MovieList } from "@/components/movie-list"
import { cn } from "@/lib/utils"

// Map moods to genres
const moodGenreMap = {
  joy: { id: 35, name: "Comédie" },
  sadness: { id: 18, name: "Drame" },
  disgust: { id: 27, name: "Horreur" },
  fear: { id: 53, name: "Thriller" },
  anger: { id: 28, name: "Action" },
  surprise: { id: 9648, name: "Mystère" },
}

// Mapping des textes à afficher par humeur
const moodTextMap = {
  joy: "LAUGH",
  sadness: "CRY",
  disgust: "BE SHOCKED",
  fear: "BE SCARED",
  anger: "FEEL ENERGIZED",
  surprise: "BE SURPRISED",
};

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("joy")
  const [displayText, setDisplayText] = useState(moodTextMap["joy"])
  const [isTransitioning, setIsTransitioning] = useState(false)

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
        setDisplayText(moodTextMap[selectedMood as keyof typeof moodTextMap])
        setIsTransitioning(false)
      }, 400) // Délai correspondant à la moitié de la durée de transition
      
      return () => clearTimeout(timer)
    }
  }, [selectedMood, isTransitioning])

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section titre et bulles d'humeur */}
        <div className="relative h-[300px] flex items-center my-16">
          {/* Titre central */}
          <h1 className="custom-font text-7xl font-bold text-white z-10">
            I&apos;WANT<br />TO
            <span 
              className={cn(
                "text-6xl font-bold ml-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600",
                "transition-all duration-800",
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
            >
              {displayText}
            </span>
          </h1>

          {/* Bulles d'humeur */}
          <div className="relative w-full h-[150px]">
            {Object.entries(moodGenreMap).map(([mood], index) => {
              const numberOfMoods = Object.keys(moodGenreMap).length;
              
              // Distribution horizontale équilibrée
              const horizontalStep = 100 / (numberOfMoods + 1);
              const horizontalPosition = (index + 1) * horizontalStep;
              
              // Variation verticale pour créer une ligne ondulée
              const verticalVariations = [-20, 30, -10, 40, -30, 20];
              const verticalOffset = verticalVariations[index % verticalVariations.length];
              
              // Animation pour chaque bulle
              const animations = [
                "animate-float-1",
                "animate-float-2", 
                "animate-float-3",
              ];
              
              return (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  style={{ 
                    position: 'absolute',
                    top: `calc(0% + ${verticalOffset}px)`, 
                    left: `${horizontalPosition}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={cn(
                    // Classes de base pour toutes les bulles
                    "backdrop-blur-md shadow-glow rounded-full w-20 h-20 md:w-24 md:h-24",
                    "flex items-center justify-center text-center custom-font text-xs font-medium",
                    // Animation flottante
                    animations[index % animations.length],
                    // Transition améliorée pour un effet plus doux et plus visible
                    "transition-all duration-500 ease-in-out",
                    // État conditionnel avec un effet plus prononcé pour la bulle sélectionnée
                    selectedMood === mood
                      ? "bg-white/30 border-2 border-white text-white scale-125 shadow-xl z-20" 
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

        <Tabs value={selectedMood} className="max-w-4xl mx-auto">
          {Object.entries(moodGenreMap).map(([mood, genre]) => (
            <TabsContent key={mood} value={mood} className="mt-0">
              <Card className="backdrop-blur-md bg-black/30 border-white/10">
                <CardContent className="pt-6">
                 
                  <MovieList genreId={genre.id} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}