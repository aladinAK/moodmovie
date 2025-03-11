import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const movieId = searchParams.get("movieId")

  if (!movieId) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
  }

  if (!API_KEY) {
    console.error("TMDB API key is missing. Please set the TMDB_API_KEY environment variable.")
    return NextResponse.json({ error: "API configuration error" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`TMDB API error: ${response.status}`, errorData)
      return NextResponse.json({
        error: `TMDB API responded with status: ${response.status}`,
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 })
  }
}

