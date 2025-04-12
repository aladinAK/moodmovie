import { NextResponse } from "next/server"

/**
 * API Route pour récupérer les options de streaming pour un film
 * Cette route est protégée car la clé API est uniquement utilisée côté serveur
 */

// Récupération de la clé API depuis les variables d'environnement
const API_KEY = process.env.TMDB_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const movieId = searchParams.get("movieId")

  // Validation des paramètres requis
  if (!movieId) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
  }

  // Vérification de la configuration de l'API
  if (!API_KEY) {
    console.error("TMDB API key is missing. Please set the TMDB_API_KEY environment variable.")
    return NextResponse.json({ error: "API configuration error" }, { status: 500 })
  }

  try {
    // Appel à l'API TMDB pour récupérer les fournisseurs de streaming
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`, 
      {
        next: { revalidate: 86400 }, // Cache pour 24 heures (les options de streaming changent moins souvent)
      }
    )

    // Gestion des erreurs de l'API TMDB
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`TMDB API error: ${response.status}`, errorData)
      return NextResponse.json({
        error: `TMDB API responded with status: ${response.status}`,
      }, { status: response.status })
    }

    // Retourne les données récupérées
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
  }
}