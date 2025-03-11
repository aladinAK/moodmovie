"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieList } from "@/components/movie-list"

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

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Cinéma d&apos;Humeur - {
          selectedMood === "joy" ? "Joie" :
          selectedMood === "sadness" ? "Tristesse" :
          selectedMood === "disgust" ? "Dégoût" :
          selectedMood === "fear" ? "Peur" :
          selectedMood === "anger" ? "Colère" :
          "Surprise"
        }
      </h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Choisissez votre humeur actuelle et découvrez une sélection de films qui correspondent à votre état
        d&apos;esprit.
      </p>

      <Tabs defaultValue="joy" className="max-w-4xl mx-auto" onValueChange={setSelectedMood}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
          <TabsTrigger value="joy">Joie</TabsTrigger>
          <TabsTrigger value="sadness">Tristesse</TabsTrigger>
          <TabsTrigger value="disgust">Dégoût</TabsTrigger>
          <TabsTrigger value="fear">Peur</TabsTrigger>
          <TabsTrigger value="anger">Colère</TabsTrigger>
          <TabsTrigger value="surprise">Surprise</TabsTrigger>
        </TabsList>

        {Object.entries(moodGenreMap).map(([mood, genre]) => (
          <TabsContent key={mood} value={mood} className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Films pour quand vous ressentez de la{" "}
                  {mood === "joy"
                    ? "joie"
                    : mood === "sadness"
                      ? "tristesse"
                      : mood === "disgust"
                        ? "dégoût"
                        : mood === "fear"
                          ? "peur"
                          : mood === "anger"
                            ? "colère"
                            : "surprise"}
                </h2>
                <MovieList genreId={genre.id} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}