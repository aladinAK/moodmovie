"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  joy:      { genre: "pop dance",   name: "Pop Dansant" },
  sadness:  { genre: "soul blues",  name: "Soul & Blues" },
  disgust:  { genre: "heavy metal", name: "Heavy Metal" },
  fear:     { genre: "dark ambient",name: "Dark Ambient" },
  anger:    { genre: "hard rock",   name: "Hard Rock" },
  surprise: { genre: "indie rock",  name: "Indie Rock" },
}

// Emoji, libellé de bulle et fin du titre « JE VEUX … » pour chaque humeur
const moodMeta = {
  joy:      { emoji: "😄", label: "RIRE",     headline: "RIRE" },
  sadness:  { emoji: "😢", label: "PLEURER",  headline: "PLEURER" },
  disgust:  { emoji: "🤢", label: "CHOC",     headline: "FRISSONNER" },
  fear:     { emoji: "😱", label: "PEUR",     headline: "AVOIR PEUR" },
  anger:    { emoji: "😤", label: "ÉNERGIE",  headline: "ME DÉFOULER" },
  surprise: { emoji: "😲", label: "SURPRISE", headline: "ME LAISSER SURPRENDRE" },
}

type Mood = keyof typeof moodMeta

const DEFAULT_HEADLINE = "..."

type ContentType = 'movies' | 'shows' | 'books' | 'music'

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [displayText, setDisplayText] = useState(DEFAULT_HEADLINE)
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
          ? moodMeta[selectedMood as Mood].headline
          : DEFAULT_HEADLINE)
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
    { type: 'movies', icon: <Film className="h-4 w-4" />, label: 'Films' },
    { type: 'shows',  icon: <Tv className="h-4 w-4" />,   label: 'Séries' },
    { type: 'books',  icon: <BookOpen className="h-4 w-4" />, label: 'Livres' },
    { type: 'music',  icon: <Music className="h-4 w-4" />, label: 'Musique' },
  ]

  return (
    <div className="min-h-screen pb-10 pt-5 px-4">

      {/* Contenu statique pour le SEO — invisible à l'écran, lu par Google et les lecteurs d'écran */}
      <section className="sr-only">
        <h1>MoodMovie — Découvrez films, séries, livres et musique selon votre humeur</h1>
        <p>
          MoodMovie est une application de recommandation de contenu basée sur votre humeur.
          Choisissez votre état émotionnel et découvrez instantanément des films, séries télévisées,
          livres et musique parfaitement adaptés à ce que vous ressentez.
        </p>
        <ul>
          <li>😄 RIRE — Films de comédie, séries comiques, livres d&apos;humour, musique pop dansante</li>
          <li>😢 PLEURER — Films dramatiques, séries drame, livres drame, soul &amp; blues</li>
          <li>🤢 CHOC — Films d&apos;horreur, séries crime, livres horreur, heavy metal</li>
          <li>😱 PEUR — Films thriller, séries mystère, livres thriller, dark ambient</li>
          <li>😤 ÉNERGIE — Films d&apos;action, séries action &amp; aventure, livres action, hard rock</li>
          <li>😲 SURPRISE — Films mystère, séries sci-fi &amp; fantaisie, livres mystère, indie rock</li>
        </ul>
        <p>Formats disponibles : Films, Séries TV, Livres, Musique. Favoris et &quot;Déjà vu/Lu&quot; sauvegardés localement.</p>
      </section>

      {/* Barre sticky — format + mood + favorites, apparaît au scroll */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/70 border-b border-white/10 px-4 py-2.5 transition-all duration-300",
        showStickyBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        {/* Sur mobile : deux lignes (formats, puis humeurs + favoris) pour éviter tout débordement */}
        <div className="max-w-4xl mx-auto flex flex-wrap sm:flex-nowrap justify-center sm:justify-between items-center gap-2">
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
                aria-label={label}
                aria-pressed={contentType === type}
              >
                {icon}
                <span className="max-sm:hidden">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-1.5">
            {(Object.keys(moodMeta) as Mood[]).map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={cn(
                  "rounded-full w-9 h-9 text-base transition-all duration-300 sm:min-w-[44px]",
                  selectedMood === mood
                    ? "bg-white/40 border-2 border-white scale-110"
                    : "bg-white/10 border border-white/20 hover:bg-white/20"
                )}
                title={moodMeta[mood].label}
                aria-label={moodMeta[mood].label}
                aria-pressed={selectedMood === mood}
              >
                {moodMeta[mood].emoji}
              </button>
            ))}
            <Button
              variant="outline"
              className="gap-1.5 px-3 h-9 bg-black/40 border-white/20 rounded-full hover:text-white hover:bg-black/60 min-w-[44px]"
              onClick={() => setIsFavoritesModalOpen(true)}
              aria-label="Favoris"
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
                aria-label={label}
                aria-pressed={contentType === type}
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
            aria-label="Favoris"
          >
            <Heart className="h-4 w-4" />
            <span className="max-sm:hidden">Favoris</span>
          </Button>
        </div>
        <div className="relative flex flex-col items-center my-10 max-sm:mt-0 max-sm:mb-6">
          <h1 className="custom-font text-7xl max-sm:text-3xl text-center font-bold text-white z-10 mb-5">
            JE VEUX <br />
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
            {(Object.keys(moodMeta) as Mood[]).map((mood, index) => {
              const animations = ["motion-safe:animate-float-1", "motion-safe:animate-float-2", "motion-safe:animate-float-3"]
              return (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  aria-pressed={selectedMood === mood}
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
                  {moodMeta[mood].label}
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
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-4">
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
                Choisis ton humeur pour découvrir {contentType === 'movies' ? 'des films' : contentType === 'shows' ? 'des séries' : contentType === 'books' ? 'des livres' : 'de la musique'}
              </h2>
              <p className="text-white/70">
                Clique sur une des bulles ci-dessus pour trouver du contenu adapté à ce que tu ressens.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Maillage interne SEO — liens vers les pages mood statiques */}
        <nav className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3 text-center">Explorer par humeur</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { slug: 'joie',      emoji: '😄', label: 'Comédie' },
              { slug: 'tristesse', emoji: '😢', label: 'Drame' },
              { slug: 'choc',      emoji: '🤢', label: 'Horreur' },
              { slug: 'peur',      emoji: '😱', label: 'Thriller' },
              { slug: 'energie',   emoji: '😤', label: 'Action' },
              { slug: 'surprise',  emoji: '😲', label: 'Mystère' },
            ].map(({ slug, emoji, label }) => (
              <Link
                key={slug}
                href={`/mood/${slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs transition-colors"
              >
                {emoji} {label}
              </Link>
            ))}
          </div>
        </nav>

        <FavoritesModal
          isOpen={isFavoritesModalOpen}
          onClose={() => setIsFavoritesModalOpen(false)}
        />
      </div>
    </div>
  )
}
