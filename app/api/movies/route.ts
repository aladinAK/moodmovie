import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genreId = searchParams.get("genreId")
  const page = searchParams.get("page") || "1"
  const sort = searchParams.get("sort") || "popularity.desc"

  if (!genreId) {
    return NextResponse.json({ error: "Genre ID is required" }, { status: 400 })
  }

  if (!API_KEY) {
    console.error("TMDB API key is missing. Please set the TMDB_API_KEY environment variable.")
    return NextResponse.json({ error: "API configuration error", results: [] }, { status: 500 })
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR&sort_by=${sort}&page=${page}&vote_average.gte=6&release_date.lte=${today}`,
      {
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`TMDB API error: ${response.status}`, errorData)
      return NextResponse.json({
        error: `TMDB API responded with status: ${response.status}`,
        results: [],
      }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from TMDB:", error)
    return NextResponse.json({ error: "Failed to fetch movies", results: [] }, { status: 500 })
  }
}