"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MovieList } from "@/components/movie-list"
import { BookList } from "@/components/book-list"
import { ShowList } from "@/components/show-list"
import { MusicList } from "@/components/music-list"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart, Film, BookOpen, Tv, Music } from "lucide-react"
import { FavoritesModal } from "@/components/favorites-modal"

const moodGenreMap = {
  joy:      { id: 35,   name: "Comédie" },
  sadness:  { id: 18,   name: "Drame" },
  disgust:  { id: 27,   name: "Horreur" },
  fear:     { id: 53,   name: "Thriller" },
  anger:    { id: 28,   name: "Action" },
  surprise: { id: 9648, name: "Mystère" },
}

const moodShowMap = {
  joy:      { id: 35,    name: "Comédie" },
  sadness:  { id: 18,    name: "Drame" },
  disgust:  { id: 80,    name: "Crime" },
  fear:     { id: 9648,  name: "Mystère" },
  anger:    { id: 10759, name: "Action & Aventure" },
  surprise: { id: 10765, name: "Sci-Fi & Fantaisie" },
}

const moodBookMap = {
  joy:      { subject: "humor",   name: "Humour" },
  sadness:  { subject: "drama",   name: "Drame" },
  disgust:  { subject: "horror",  name: "Horreur" },
  fear:     { subject: "thriller",name: "Thriller" },
  anger:    { subject: "action",  name: "Action" },
  surprise: { subject: "mystery", name: "Mystère" },
}

const moodMusicMap = {
  joy:      { genre: "happy pop",        name: "Pop Joyeux" },
  sadness:  { genre: "sad ballad soul",  name: "Ballades Tristes" },
  disgust:  { genre: "dark metal",       name: "Metal Sombre" },
  fear:     { genre: "horror atmospheric", name: "Atmosphérique" },
  anger:    { genre: "rage rock metal",  name: "Rock Rage" },
  surprise: { genre: "experimental indie", name: "Indie Expérimental" },
}

const moodTextMap = {
  default:  "...",
  joy:      "LAUGH",
  sadness:  "CRY",
  disgust:  "BE SHOCKED",
  fear:     "BE SCARED",
  anger:    "FEEL ENERGIZED",
  surprise: "BE SURPRISED",
}

type ContentType = 'movies' | 'shows' | 'books' | 'music'

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [displayText, setDisplayText] = useState(moodTextMap.default)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)
  const [contentType, setContentType] = useState<ContentType>('movies')
  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 280)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMoodSelect = (mood: string) => {
    if (mood !== selectedMood && !isTransitioning) {
      setIsTransitioning(true)
      setSelectedMood(mood)
    }
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setDisplayText(selectedMood
          ? moodTextMap[selectedMood as keyof typeof moodTextMap]
          : moodTextMap.default)
        setIsTransitioning(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [selectedMood, isTransitioning])

  useEffect(() => {
    document.body.classList.remove('radial-bg-joy', 'radial-bg-sadness', 'radial-bg-disgust', 'radial-bg-fear', 'radial-bg-anger', 'radial-bg-surprise')
    if (selectedMood) {
      document.body.classList.remove('radial-bg')
      document.body.classList.add(`radial-bg-${selectedMood}`)
    } else {
      document.body.classList.add('radial-bg')
    }
  }, [selectedMood])

  const contentButtons: { type: ContentType; icon: React.ReactNode; label: string }[] = [
    { type: 'movies', icon: <Film className="h-4 w-4" />, label: 'Movies' },
    { type: 'shows',  icon: <Tv className="h-4 w-4" />,   label: 'Shows' },
    { type: 'books',  icon: <BookOpen className="h-4 w-4" />, label: 'Books' },
    { type: 'music',  icon: <Music className="h-4 w-4" />, label: 'Music' },
  ]

  return (
    <div className="min-h-screen pb-10 pt-5 px-4">

      {/* Barre sticky — format + mood + favorites, apparaît au scroll */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/70 border-b border-white/10 px-4 py-2.5 transition-all duration-300",
        showStickyBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
          <div className="flex gap-1.5">
            {contentButtons.map(({ type, icon, label }) => (
              <button
                key={type}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-9 rounded-full border text-xs font-medium transition-all duration-200 min-w-[44px]",
                  contentType === type
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-black/40 text-white/70 border-white/20 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setContentType(type)}
              >
                {icon}
                <span className="max-sm:hidden">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {Object.keys(moodGenreMap).map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={cn(
                  "rounded-full w-9 h-9 text-base transition-all duration-300 min-w-[44px]",
                  selectedMood === mood
                    ? "bg-white/40 border-2 border-white scale-110"
                    : "bg-white/10 border border-white/20 hover:bg-white/20"
                )}
                title={mood.toUpperCase()}
              >
                {mood === "joy" ? "😄" : mood === "sadness" ? "😢" : mood === "disgust" ? "🤢" : mood === "fear" ? "😱" : mood === "anger" ? "😤" : "😲"}
              </button>
            ))}
            <Button
              variant="outline"
              className="gap-1.5 px-3 h-9 bg-black/40 border-white/20 rounded-full hover:text-white hover:bg-black/60 min-w-[44px]"
              onClick={() => setIsFavoritesModalOpen(true)}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Barre statique — toujours visible en haut */}
        <div className="flex justify-between items-center mb-6 gap-2">
          <div className="flex gap-2 flex-wrap">
            {contentButtons.map(({ type, icon, label }) => (
              <button
                key={type}
                className={cn(
                  "flex items-center gap-2 px-4 h-10 rounded-full border font-medium transition-all duration-200 min-w-[44px]",
                  contentType === type
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-black/40 backdrop-blur-sm text-white/70 border-white/20 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setContentType(type)}
              >
                {icon}
                <span className="max-sm:hidden">{label}</span>
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="gap-2 px-4 h-10 bg-black/40 backdrop-blur-sm border-white/20 rounded-full hover:text-white hover:bg-black/60 min-w-[44px]"
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
              const animations = ["animate-float-1", "animate-float-2", "animate-float-3"]
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
                  {mood === "joy" ? "LAUGH" : mood === "sadness" ? "CRY" : mood === "disgust" ? "SHOCK" : mood === "fear" ? "SCARE" : mood === "anger" ? "ENERGY" : "SURPRISE"}
                </button>
              )
            })}
          </div>
        </div>

        {selectedMood ? (
          <Tabs value={selectedMood} className="max-w-4xl mx-auto">
            {Object.entries(moodGenreMap).map(([mood, genre]) => (
              <TabsContent key={mood} value={mood} className="mt-0">
                <Card className="backdrop-blur-md bg-black/30 border-white/10">
                  <CardContent className="pt-4">
                    {/* Label genre actif */}
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-4">
                      {contentType === 'movies' ? genre.name
                        : contentType === 'shows' ? moodShowMap[mood as keyof typeof moodShowMap].name
                        : contentType === 'books' ? moodBookMap[mood as keyof typeof moodBookMap].name
                        : moodMusicMap[mood as keyof typeof moodMusicMap].name}
                    </p>
                    {contentType === 'movies' && <MovieList genreId={genre.id} />}
                    {contentType === 'shows'  && <ShowList genreId={moodShowMap[mood as keyof typeof moodShowMap].id} />}
                    {contentType === 'books'  && <BookList subject={moodBookMap[mood as keyof typeof moodBookMap].subject} />}
                    {contentType === 'music'  && <MusicList genre={moodMusicMap[mood as keyof typeof moodMusicMap].genre} />}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card className="backdrop-blur-md bg-black/30 border-white/10">
            <CardContent className="pt-6 text-center py-16">
              <h2 className="text-2xl text-white custom-font mb-4">
                Select your mood above to find {contentType === 'movies' ? 'movies' : contentType === 'shows' ? 'shows' : contentType === 'books' ? 'books' : 'music'}
              </h2>
              <p className="text-white/70">
                Choose one of the mood bubbles above to discover content that matches your current emotional state.
              </p>
            </CardContent>
          </Card>
        )}

        <FavoritesModal
          isOpen={isFavoritesModalOpen}
          onClose={() => setIsFavoritesModalOpen(false)}
        />
      </div>
    </div>
  )
}
