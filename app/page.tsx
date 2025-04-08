"use client"

import { useState } from "react"
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

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("joy")

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto">
        {/* Section titre et bulles d'humeur */}
        <div className="relative h-[500px] flex items-center justify-center my-16">
        {/* Titre central */}
        <h1 className="custom-font text-5xl font-bold text-white z-10 text-center">
          I&apos;WANT<br />TO
        </h1>

        {/* Bulles d'humeur en cercle */}
        {Object.entries(moodGenreMap).map(([mood, _], index) => {
          // Calculer la position en cercle
          const numberOfMoods = Object.keys(moodGenreMap).length;
          const angle = (index * 2 * Math.PI / numberOfMoods);
          
          // Rayon du cercle (ajustez selon vos besoins)
          const radius = 200;
          
          // Position calculée sur un cercle
          const top = `calc(50% - ${Math.cos(angle) * radius}px - 24px)`;
          const left = `calc(50% + ${Math.sin(angle) * radius}px - 24px)`;
          
          // Attribution d'animations différentes à chaque bulle
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
                top, 
                left 
              }}
              className={cn(
                "backdrop-blur-md transition-all duration-300 shadow-glow",
                "rounded-full w-24 h-24 flex items-center justify-center text-center font-medium",
                animations[index % animations.length],
                selectedMood === mood
                  ? "bg-white/20 border-2 border-white text-white scale-110 shadow-xl z-20" 
                  : "bg-white/10 border border-white/30 text-white/70 hover:bg-white/15 hover:scale-105"
              )}
            >
              {mood === "joy"
                ? "LAUGH"
                : mood === "sadness"
                  ? "CRY"
                  : mood === "disgust"
                    ? "BE SHOCKED"
                    : mood === "fear"
                      ? "BE SCARED"
                      : mood === "anger"
                        ? "FEEL ENERGIZED"
                        : "BE SURPRISED"}
            </button>
          );
        })}
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