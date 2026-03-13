"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Heart, Eye, EyeOff, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookDetailsModal } from "./book-details-modal"
import { useFavorites } from '@/context/favorites-context'
import { useWatched } from '@/context/watched-context'
import { Book } from "@/types/book"

export interface BookListProps {
  subject: string
}

export function BookList({ subject }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isWatched, toggleWatched } = useWatched()

  const fetchBooks = useCallback(async (index: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const orderOptions = ['relevance', 'newest']
      const orderBy = orderOptions[Math.floor(Math.random() * orderOptions.length)]
      const timestamp = Date.now()
      const response = await fetch(`/api/books?subject=${subject}&startIndex=${index}&orderBy=${orderBy}&_=${timestamp}`)
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const filtered = data.items
          .filter((book: Book) =>
            book.title &&
            (book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail) &&
            (book.averageRating === undefined || book.averageRating >= 3.5)
          )
          .slice(0, 10)

        setHasMore(data.items.length >= 20)
        setStartIndex(index)

        if (append) {
          setBooks(prev => {
            const ids = new Set(prev.map(b => b.id))
            return [...prev, ...filtered.filter((b: Book) => !ids.has(b.id))]
          })
        } else {
          setBooks(filtered)
        }
      } else if (!append && index > 0) {
        // Fallback : startIndex aléatoire vide → retry depuis 0
        const res2 = await fetch(`/api/books?subject=${subject}&startIndex=0&orderBy=relevance`)
        const data2 = await res2.json()
        if (data2.items && data2.items.length > 0) {
          const filtered2 = data2.items
            .filter((book: Book) =>
              book.title &&
              (book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail) &&
              (book.averageRating === undefined || book.averageRating >= 3.5)
            )
            .slice(0, 10)
          setHasMore(data2.items.length >= 20)
          setStartIndex(0)
          setBooks(filtered2)
        } else {
          setBooks([])
          setHasMore(false)
        }
      } else {
        if (!append) setBooks([])
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      if (!append) setBooks([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [subject])

  useEffect(() => {
    const randomStart = Math.floor(Math.random() * 3) * 40
    setBooks([])
    setStartIndex(randomStart)
    setHasMore(true)
    fetchBooks(randomStart, false)
  }, [fetchBooks])

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && !loading && hasMore) {
          fetchBooks(startIndex + 40, true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loadingMore, loading, hasMore, startIndex, fetchBooks])

  // Convertit un livre en Movie pour favoris/watched (IDs négatifs pour les livres)
  const bookToMovie = (book: Book) => ({
    id: -(parseInt(book.id.replace(/\D/g, '')) || Math.abs(book.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0))),
    title: book.title,
    poster_path: (book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || null)?.replace(/^http:/, 'https:') || null,
    vote_average: book.averageRating || 0,
    release_date: book.publishedDate || '',
    overview: book.description || ''
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-black/20 border border-white/5">
            <div className="relative aspect-[2/3] w-full">
              <Skeleton className="absolute inset-0 bg-white/15" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2 bg-white/15" />
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-3 w-10 bg-white/15" />
                <Skeleton className="h-3 w-16 bg-white/15" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (books.length === 0 && !loading) {
    return (
      <div className="text-center py-10">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <p className="text-muted-foreground">No books found 😔.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book, index) => {
          const movieFormat = bookToMovie(book)
          return (
            <Card
              key={`${book.id}-${index}`}
              className="overflow-hidden cursor-pointer bg-black/20 border-white/5
                        transition-all duration-300 ease-out
                        transform hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                        hover:border-white/20 hover:bg-black/30"
              onClick={() => { setSelectedBook(book); setIsModalOpen(true) }}
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={(book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || "/no-image.png").replace(/^http:/, 'https:')}
                  alt={book.title}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  priority={index < 5}
                  loading={index >= 5 ? "lazy" : undefined}
                />

                <div className="absolute top-2 left-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                    onClick={e => { e.stopPropagation(); toggleWatched(movieFormat) }}
                    title={isWatched(movieFormat.id) ? "Marquer comme non lu" : "Marquer comme lu"}
                  >
                    {isWatched(movieFormat.id)
                      ? <EyeOff className="h-4 w-4 text-blue-400" />
                      : <Eye className="h-4 w-4 text-white" />}
                  </Button>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                    onClick={e => { e.stopPropagation(); toggleFavorite(movieFormat) }}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(movieFormat.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-medium text-white line-clamp-2 text-sm leading-tight mb-1">{book.title}</h3>
                {book.authors && book.authors.length > 0 && (
                  <p className="text-xs text-white/60 line-clamp-1 mb-2">by {book.authors.slice(0, 2).join(", ")}</p>
                )}
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>{book.publishedDate?.split("-")[0] || "N/A"}</span>
                  {book.averageRating && (
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{book.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Sentinel infinite scroll */}
      <div ref={sentinelRef} className="h-8 flex items-center justify-center">
        {loadingMore && (
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        )}
      </div>

      {selectedBook && (
        <BookDetailsModal
          bookId={selectedBook.id}
          bookTitle={selectedBook.title}
          bookDescription={selectedBook.description}
          bookAuthors={selectedBook.authors}
          bookImageUrl={selectedBook.imageLinks?.thumbnail || selectedBook.imageLinks?.smallThumbnail}
          bookPublishedDate={selectedBook.publishedDate}
          bookRating={selectedBook.averageRating}
          bookPreviewLink={selectedBook.previewLink}
          bookInfoLink={selectedBook.infoLink}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
