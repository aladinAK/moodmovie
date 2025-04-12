import { NextResponse } from "next/server"

/**
 * API Route pour récupérer les films par genre
 * Cette route est protégée car la clé API est uniquement utilisée côté serveur
 */

// Récupération de la clé API depuis les variables d'environnement
const API_KEY = process.env.TMDB_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genreId = searchParams.get("genreId")
  const page = searchParams.get("page") || "1"
  const sort = searchParams.get("sort") || "popularity.desc"

  // Validation des paramètres requis
  if (!genreId) {
    return NextResponse.json({ error: "Genre ID is required" }, { status: 400 })
  }

  // Vérification de la configuration de l'API
  if (!API_KEY) {
    console.error("TMDB API key is missing. Please set the TMDB_API_KEY environment variable.")
    return NextResponse.json({ error: "API configuration error", results: [] }, { status: 500 })
  }

  // Date actuelle au format YYYY-MM-DD pour n'afficher que les films déjà sortis
  const today = new Date().toISOString().split('T')[0];

  try {
    // Appel à l'API TMDB avec les filtres appropriés
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR&sort_by=${sort}&page=${page}&vote_average.gte=6&release_date.lte=${today}`,
      {
        next: { revalidate: 3600 }, // Cache pour 1 heure
      },
    )

    // Gestion des erreurs de l'API TMDB
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`TMDB API error: ${response.status}`, errorData)
      return NextResponse.json({
        error: `TMDB API responded with status: ${response.status}`,
        results: [],
      }, { status: response.status })
    }

    // Retourne les données récupérées
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from TMDB:", error)
    return NextResponse.json({ error: "Failed to fetch movies", results: [] }, { status: 500 })
  }
}