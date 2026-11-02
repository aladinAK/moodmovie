"use client"

import { useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Star, Calendar, User } from "lucide-react"
import Image from "next/image"

interface BookDetailsModalProps {
  bookTitle: string
  bookDescription?: string
  bookAuthors?: string[]
  bookImageUrl?: string
  bookPublishedDate?: string
  bookRating?: number
  bookPreviewLink?: string
  bookInfoLink?: string
  isOpen: boolean
  onClose: () => void
}

interface BookSource {
  name: string
  link: string
  type: 'preview' | 'purchase'
}

export function BookDetailsModal({
  bookTitle,
  bookDescription,
  bookAuthors,
  bookImageUrl,
  bookPublishedDate,
  bookRating,
  bookPreviewLink,
  bookInfoLink,
  isOpen,
  onClose
}: BookDetailsModalProps) {
  // Sources construites à partir des liens Google Books et de recherches par titre
  const availability = useMemo<BookSource[]>(() => [
    {
      name: "Google Books",
      link: bookPreviewLink || bookInfoLink || '',
      type: "preview" as const
    },
    {
      name: "Google Play Books",
      link: `https://play.google.com/store/search?q=${encodeURIComponent(bookTitle)}&c=books`,
      type: "purchase" as const
    },
    {
      name: "Amazon",
      link: `https://amazon.fr/s?k=${encodeURIComponent(bookTitle)}&i=stripbooks`,
      type: "purchase" as const
    }
  ].filter(source => source.link !== ''), [bookTitle, bookPreviewLink, bookInfoLink])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-black/80 backdrop-blur-md border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white custom-font">{bookTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Book information */}
          <div className="flex gap-6 p-4 bg-black/20 rounded-lg border border-white/10">
            {bookImageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={bookImageUrl}
                  alt={bookTitle}
                  width={140}
                  height={210}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            )}
            
            <div className="space-y-4 flex-1">
              {bookAuthors && bookAuthors.length > 0 && (
                <div className="flex items-center gap-2 text-white/90">
                  <User className="h-4 w-4" />
                  <span className="font-medium">par {bookAuthors.join(", ")}</span>
                </div>
              )}
              
              {bookPublishedDate && (
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="h-4 w-4" />
                  <span>Publié en {bookPublishedDate}</span>
                </div>
              )}
              
              {bookRating && (
                <div className="flex items-center gap-2 text-white/80">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>Note : {bookRating.toFixed(1)} / 5</span>
                </div>
              )}

              {/* Synopsis */}
              {bookDescription && (
                <div className="space-y-2">
                  <h4 className="text-sm text-white font-semibold">Résumé</h4>
                  <p className="text-white/85 text-xs leading-relaxed line-clamp-4">
                    {bookDescription.replace(/<[^>]*>/g, '')} {/* Remove HTML tags */}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Where to find the book */}
          <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-white/10">
            <h3 className="text-lg text-white font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Où trouver ce livre
            </h3>
            
            {availability.length > 0 ? (
              <div className="space-y-3">
                {availability.map((source, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between p-4 bg-black/30 border-white/20 text-white"
                    onClick={() => window.open(source.link, '_blank', 'noopener,noreferrer')}
                  >
                    <span className="font-medium">{source.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
                        {source.type === 'preview' ? 'Aperçu' : 'Acheter'}
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-white/60 p-4">Aucune source trouvée pour ce livre.</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
