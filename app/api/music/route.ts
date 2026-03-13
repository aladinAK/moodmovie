import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get("genre")
  const startIndex = searchParams.get("startIndex") || "0"

  if (!genre) {
    return NextResponse.json({ error: "Genre is required" }, { status: 400 })
  }

  try {
    const url = `https://api.deezer.com/search/track?q=${encodeURIComponent(genre)}&limit=40&index=${startIndex}&order=RATING_DESC`
    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      return NextResponse.json({ error: "Deezer API error", data: [] }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from Deezer:", error)
    return NextResponse.json({ error: "Failed to fetch music", data: [] }, { status: 500 })
  }
}
