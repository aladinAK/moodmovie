import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const subject = searchParams.get("subject")
  const maxResults = searchParams.get("maxResults") || "20"
  const orderBy = searchParams.get("orderBy") || "relevance"

  if (!subject) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 })
  }

  try {
    // Construction de l'URL de l'API Google Books
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${subject}&maxResults=${maxResults}&orderBy=${orderBy}&langRestrict=fr`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Google Books API error: ${response.status}`, errorData)
      return NextResponse.json({
        error: `Google Books API responded with status: ${response.status}`,
        items: [],
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Transformer les données pour correspondre à notre interface Book
    const transformedData = {
      ...data,
      items: data.items?.map((item: { id: string; volumeInfo: Record<string, unknown> }) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        description: item.volumeInfo.description,
        publishedDate: item.volumeInfo.publishedDate,
        categories: item.volumeInfo.categories,
        imageLinks: item.volumeInfo.imageLinks,
        averageRating: item.volumeInfo.averageRating,
        ratingsCount: item.volumeInfo.ratingsCount,
        pageCount: item.volumeInfo.pageCount,
        language: item.volumeInfo.language,
        publisher: item.volumeInfo.publisher,
        industryIdentifiers: item.volumeInfo.industryIdentifiers,
        infoLink: item.volumeInfo.infoLink,
        previewLink: item.volumeInfo.previewLink,
      })) || []
    }
    
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error fetching from Google Books:", error)
    return NextResponse.json({ error: "Failed to fetch books", items: [] }, { status: 500 })
  }
}
