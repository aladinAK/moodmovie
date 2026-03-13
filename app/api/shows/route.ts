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
    return NextResponse.json({ error: "API configuration error", results: [] }, { status: 500 })
  }

  const today = new Date().toISOString().split('T')[0]

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR&sort_by=${sort}&page=${page}&vote_average.gte=6&first_air_date.lte=${today}&vote_count.gte=50`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`TMDB API error: ${response.status}`, errorData)
      return NextResponse.json({ error: `TMDB API responded with status: ${response.status}`, results: [] }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from TMDB:", error)
    return NextResponse.json({ error: "Failed to fetch shows", results: [] }, { status: 500 })
  }
}
