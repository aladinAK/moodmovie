import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Film, Star, ArrowLeft } from 'lucide-react'

const BASE_URL = 'https://moodmovie-by-aladin-akkari.vercel.app'

const moodConfig = {
  joie: {
    key: 'joy',
    emoji: '😄',
    label: 'LAUGH',
    title: 'Films de comédie pour rire et se sentir bien',
    description: 'Découvre les meilleures comédies pour te mettre de bonne humeur. Films drôles, légers et feel-good sélectionnés pour toi.',
    genreId: 35,
    genreName: 'Comédie',
    color: 'from-yellow-500/20 to-orange-500/20',
  },
  tristesse: {
    key: 'sadness',
    emoji: '😢',
    label: 'CRY',
    title: 'Films dramatiques pour toucher le cœur',
    description: 'Laisse-toi emporter par les meilleurs films dramatiques. Des histoires profondes et émouvantes pour les moments de mélancolie.',
    genreId: 18,
    genreName: 'Drame',
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  choc: {
    key: 'disgust',
    emoji: '🤢',
    label: 'SHOCK',
    title: 'Films d\'horreur pour frissonner et être choqué',
    description: 'Les meilleurs films d\'horreur pour te glacer le sang. Sélection de films qui vont te choquer et te surprendre.',
    genreId: 27,
    genreName: 'Horreur',
    color: 'from-green-900/20 to-emerald-500/20',
  },
  peur: {
    key: 'fear',
    emoji: '😱',
    label: 'SCARE',
    title: 'Films thriller pour avoir peur et être tenu en haleine',
    description: 'Les meilleurs thrillers pour te tenir en haleine. Suspense, tension et rebondissements garantis.',
    genreId: 53,
    genreName: 'Thriller',
    color: 'from-purple-900/20 to-violet-500/20',
  },
  energie: {
    key: 'anger',
    emoji: '😤',
    label: 'ENERGY',
    title: 'Films d\'action pour se sentir énergisé',
    description: 'Les meilleurs films d\'action pour booster ton énergie. Explosions, combats et adrénaline au rendez-vous.',
    genreId: 28,
    genreName: 'Action',
    color: 'from-red-500/20 to-orange-600/20',
  },
  surprise: {
    key: 'surprise',
    emoji: '😲',
    label: 'SURPRISE',
    title: 'Films mystère pour être surpris et intrigué',
    description: 'Les meilleurs films de mystère pour te surprendre. Des intrigues captivantes avec des twists inattendus.',
    genreId: 9648,
    genreName: 'Mystère',
    color: 'from-cyan-500/20 to-teal-500/20',
  },
}

type Slug = keyof typeof moodConfig

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date: string
  overview: string
}

async function fetchMovies(genreId: number): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) return []
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=100&page=1&language=fr-FR`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    return (data.results || []).slice(0, 16)
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  return Object.keys(moodConfig).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const config = moodConfig[slug as Slug]
  if (!config) return {}

  return {
    title: config.title,
    description: config.description,
    keywords: [
      `film ${config.genreName.toLowerCase()}`,
      `meilleurs films ${config.genreName.toLowerCase()}`,
      `film ${config.key}`,
      config.title,
      'recommendation film',
      'mood movie',
    ],
    alternates: { canonical: `${BASE_URL}/mood/${slug}` },
    openGraph: {
      title: `${config.emoji} ${config.title} | MoodMovie`,
      description: config.description,
      url: `${BASE_URL}/mood/${slug}`,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function MoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const config = moodConfig[slug as Slug]
  if (!config) notFound()

  const movies = await fetchMovies(config.genreId)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className={`bg-gradient-to-br ${config.color} border-b border-white/10`}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à MoodMovie
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{config.emoji}</span>
            <div>
              <p className="text-white/50 text-sm uppercase tracking-widest mb-1">{config.genreName}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{config.title}</h1>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">{config.description}</p>
        </div>
      </div>

      {/* Grille de films */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {movies.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold text-white/80 mb-6">
              Sélection de {config.genreName} — {movies.length} films
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <article key={movie.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all">
                  <div className="relative aspect-[2/3] bg-gray-800">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="h-12 w-12 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-white line-clamp-2 mb-1">{movie.title}</h3>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{movie.release_date?.split('-')[0] || '—'}</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    {movie.overview && (
                      <p className="text-white/40 text-xs mt-2 line-clamp-3">{movie.overview}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="text-white/50 text-center py-20">Aucun film disponible pour le moment.</p>
        )}

        {/* CTA vers l'app */}
        <div className="mt-12 text-center bg-white/5 rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Envie de plus ? Découvrez aussi des séries, livres et musique.
          </h2>
          <p className="text-white/60 mb-6">
            MoodMovie te recommande du contenu dans 4 formats selon ton humeur du moment.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            {config.emoji} Ouvrir MoodMovie
          </Link>
        </div>
      </div>
    </div>
  )
}
