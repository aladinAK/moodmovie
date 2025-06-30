"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, RefreshCw, Heart, BookOpen, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookDetailsModal } from "./book-details-modal"
import { useFavorites } from '@/context/favorites-context'
import { Book } from "@/types/book"

export interface BookListProps {
  subject: string;
}

export function BookList({ subject }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSubject, setCurrentSubject] = useState(subject)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  const fetchBooks = useCallback(async (bookSubject: string) => {
    setLoading(true)
    try {
      // Générer un orderBy aléatoire à chaque appel
      const orderOptions = ['relevance', 'newest']
      const orderBy = orderOptions[Math.floor(Math.random() * orderOptions.length)]
      
      // Ajouter un timestamp pour éviter le cache
      const timestamp = Date.now()
      const response = await fetch(`/api/books?subject=${bookSubject}&maxResults=15&orderBy=${orderBy}&_=${timestamp}`)
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        // Filtrer les livres qui ont au moins une image et un titre
        const filteredBooks = data.items
          .filter((book: Book) => book.title && (book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail))
          .slice(0, 10)
        setBooks(filteredBooks)
        setCurrentSubject(bookSubject)
      } else {
        setBooks([])
        console.error("No books found or API error:", data.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setCurrentSubject(subject)
    fetchBooks(subject)
  }, [fetchBooks, subject])
  
  const handleRefresh = () => {
    // Forcer un nouveau chargement avec le même subject
    setLoading(true)
    fetchBooks(currentSubject)
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Convertir un livre en format Movie pour la compatibilité avec les favoris
  const bookToMovie = (book: Book) => ({
    id: -(parseInt(book.id.replace(/\D/g, '')) || Math.abs(book.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0))), // ID négatif pour les livres
    title: book.title,
    poster_path: (book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || null)?.replace(/^http:/, 'https:') || null,
    vote_average: book.averageRating || 0,
    release_date: book.publishedDate || '',
    overview: book.description || ''
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="sticky top-4 z-30 flex justify-end mb-4">
          <Button variant="outline" disabled className="gap-2 bg-black/40 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 stroke-white hover:stroke-black" />
          </Button>
        </div>
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
      </div>
    )
  }

  if (books.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        <div className="sticky top-4 z-30 flex justify-end mb-4">
          <Button variant="outline" disabled className="gap-2 bg-black/40 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 stroke-white hover:stroke-black" />
          </Button>
        </div>
        <div className="text-center py-10">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground">No books found 😔.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      <div className="sticky top-4 z-30 flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="max-md:p-3 rounded-full gap-2 bg-black/40 backdrop-blur-sm border-white/20 shadow-lg hover:bg-white/10"
          title="more books"
        >
          <RefreshCw className="h-4 w-4 stroke-white hover:stroke-black" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book, index) => {
          const movieFormat = bookToMovie(book)
          return (
            <Card
              key={book.id}
              className="overflow-hidden cursor-pointer bg-black/20 border-white/5
                        transition-all duration-300 ease-out 
                        transform hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                        hover:border-white/20 hover:bg-black/30"
              onClick={() => handleBookClick(book)}
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">              <Image
                src={
                  (book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || "/no-image.png")
                    .replace(/^http:/, 'https:') // Force HTTPS pour Google Books
                }
                alt={book.title}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  priority={index < 5}
                  loading={index >= 5 ? "lazy" : undefined}
                />
                
                {/* Icône d'ouverture externe */}
                <div className="absolute top-2 left-2 z-10">
                  <div className="rounded-full bg-black/40 backdrop-blur-sm p-1">
                    <ExternalLink className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                {/* Bouton de favoris */}
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(movieFormat)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite(movieFormat.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                    />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-white line-clamp-2 text-sm leading-tight mb-1">{book.title}</h3>
                {book.authors && book.authors.length > 0 && (
                  <p className="text-xs text-white/60 line-clamp-1 mb-2">
                    by {book.authors.slice(0, 2).join(", ")}
                  </p>
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
          onClose={closeModal}
        />
      )}
    </div>
  )
}
