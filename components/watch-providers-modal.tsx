"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink } from "lucide-react"

interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
  provider_url?: string
}

interface WatchProviders {
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
  link?: string
}

interface WatchProvidersModalProps {
  movieId: number | null
  movieTitle: string
  movieOverview?: string  // Ajout du champ pour la synopsis
  isOpen: boolean
  onClose: () => void
}

// Available countries list - only Canada and United States
const countries = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
]

export function WatchProvidersModal({ movieId, movieTitle, movieOverview, isOpen, onClose }: WatchProvidersModalProps) {
  const [providers, setProviders] = useState<WatchProviders | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState("CA") // Canada by default

  // Fonction qui génère l'URL de redirection en fonction du fournisseur
  const getProviderURL = (providerId: number, baseURL: string) => {
    // Ces mappings sont basés sur les IDs communs des fournisseurs
    // Ajouter plus de fournisseurs canadiens/français
    const providerURLs: Record<number, string> = {
      8: "https://www.netflix.com", // Netflix
      9: "https://www.primevideo.com", // Amazon Prime
      337: "https://www.disneyplus.com", // Disney+
      2: "https://www.apple.com/apple-tv-plus", // Apple TV+
      348: "https://www.crunchyroll.com", // Crunchyroll
      119: "https://www.amazonstudiosguilds.com", // Amazon Prime Video
      309: "https://crave.ca", // Crave
      230: "https://www.canalplus.com", // Canal+
      // Autres fournisseurs pertinents pour le Canada/France
    };
    
    // Si nous avons une URL spécifique pour ce fournisseur, utilisez-la
    if (providerURLs[providerId]) {
      return providerURLs[providerId];
    }
    
    // Sinon, utilisez l'URL de base de TMDB
    return baseURL || "https://www.themoviedb.org";
  }

  useEffect(() => {
    async function fetchProviders() {
      if (!movieId) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/movies/providers?movieId=${movieId}`)
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setProviders(null)
        } else if (data.results && data.results[country]) {
          // Récupérer les données du fournisseur avec l'URL de base
          const providerData = {...data.results[country]}
          const baseURL = data.results[country].link || "";
          
          // Ajouter l'URL à chaque fournisseur
          if (providerData.flatrate) {
            providerData.flatrate = providerData.flatrate.map((provider: Provider) => ({
              ...provider,
              provider_url: getProviderURL(provider.provider_id, baseURL)
            }))
          }
          
          if (providerData.rent) {
            providerData.rent = providerData.rent.map((provider: Provider) => ({
              ...provider,
              provider_url: getProviderURL(provider.provider_id, baseURL)
            }))
          }
          
          if (providerData.buy) {
            providerData.buy = providerData.buy.map((provider: Provider) => ({
              ...provider,
              provider_url: getProviderURL(provider.provider_id, baseURL)
            }))
          }
          
          setProviders(providerData)
        } else {
          const countryName = countries.find((c) => c.code === country)?.name || country
          setError(`No providers available for this movie in ${countryName}`)
          setProviders(null)
        }
      } catch (error) {
        console.error("Error fetching providers:", error)
        setError("Error retrieving providers")
        setProviders(null)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && movieId) {
      fetchProviders()
    }
  }, [isOpen, movieId, country])

  const hasProviders =
    providers &&
    ((providers.flatrate && providers.flatrate.length > 0) ||
      (providers.rent && providers.rent.length > 0) ||
      (providers.buy && providers.buy.length > 0))

  const handleCountryChange = (value: string) => {
    setCountry(value)
  }

  const countryName = countries.find((c) => c.code === country)?.name || country

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{movieTitle}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Find where to watch this movie online
          </DialogDescription>
          
          {/* Synopsis du film */}
          {movieOverview && (
            <div className="mt-3 text-sm text-white/80 border-t border-white/10 pt-3">
              <p className="line-clamp-4">{movieOverview}</p>
            </div>
          )}
        </DialogHeader>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Country</label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-md" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>{error}</p>
          </div>
        ) : !hasProviders ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>No providers available for this movie in {countryName}</p>
          </div>
        ) : (
          <Tabs defaultValue="flatrate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flatrate" disabled={!providers?.flatrate?.length}>
                Streaming
              </TabsTrigger>
              <TabsTrigger value="rent" disabled={!providers?.rent?.length}>
                Rental
              </TabsTrigger>
              <TabsTrigger value="buy" disabled={!providers?.buy?.length}>
                Purchase
              </TabsTrigger>
            </TabsList>

            {providers?.flatrate && providers.flatrate.length > 0 && (
              <TabsContent value="flatrate" className="py-4">
                <h3 className="mb-3 font-medium">Available for streaming on:</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.flatrate.map((provider) => (
                    <a 
                      key={provider.provider_id} 
                      href={provider.provider_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-center transition-transform hover:scale-105 group"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border group-hover:border-white/50">
                      <Image
  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
  alt={provider.provider_name}
  fill
  sizes="64px" // Taille fixe car les logos sont dans des conteneurs de 16x16
  className="object-cover"
/>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </div>
                     
                    </a>
                  ))}
                </div>
              </TabsContent>
            )}

            {providers?.rent && providers.rent.length > 0 && (
              <TabsContent value="rent" className="py-4">
                <h3 className="mb-3 font-medium">Available for rental on:</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.rent.map((provider) => (
                    <a 
                      key={provider.provider_id} 
                      href={provider.provider_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-center transition-transform hover:scale-105 group"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border group-hover:border-white/50">
                      <Image
  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
  alt={provider.provider_name}
  fill
  sizes="64px" // Taille fixe car les logos sont dans des conteneurs de 16x16
  className="object-cover"
/>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </div>
                     
                    </a>
                  ))}
                </div>
              </TabsContent>
            )}

            {providers?.buy && providers.buy.length > 0 && (
              <TabsContent value="buy" className="py-4">
                <h3 className="mb-3 font-medium">Available for purchase on:</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.buy.map((provider) => (
                    <a 
                      key={provider.provider_id} 
                      href={provider.provider_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-center transition-transform hover:scale-105 group"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border group-hover:border-white/50">
                      <Image
  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
  alt={provider.provider_name}
  fill
  sizes="64px" // Taille fixe car les logos sont dans des conteneurs de 16x16
  className="object-cover"
/>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </div>
                     
                    </a>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}