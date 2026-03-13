import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  if (!parsed.hostname.endsWith("dzcdn.net")) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "audio/mpeg, audio/*, */*",
        "Referer": "https://www.deezer.com/",
      },
      redirect: "follow",
    })

    if (!response.ok || !response.body) {
      return new NextResponse(null, { status: response.status })
    }

    const contentType = response.headers.get("content-type") || "audio/mpeg"
    const contentLength = response.headers.get("content-length")

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    }
    if (contentLength) headers["Content-Length"] = contentLength

    return new NextResponse(response.body, { headers })
  } catch (error) {
    console.error("Error proxying audio:", error)
    return NextResponse.json({ error: "Failed to fetch audio" }, { status: 500 })
  }
}
