"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface WatchProviders {
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}

interface WatchProvidersModalProps {
  movieId: number | null
  movieTitle: string
  isOpen: boolean
  onClose: () => void
}

// Liste des pays disponibles - seulement Canada et États-Unis
const countries = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "États-Unis" },
]

export function WatchProvidersModal({ movieId, movieTitle, isOpen, onClose }: WatchProvidersModalProps) {
  const [providers, setProviders] = useState<WatchProviders | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState("CA") // Canada par défaut

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
          setProviders(data.results[country])
        } else {
          const countryName = countries.find((c) => c.code === country)?.name || country
          setError(`Aucun fournisseur disponible pour ce film au ${countryName}`)
          setProviders(null)
        }
      } catch (error) {
        console.error("Error fetching providers:", error)
        setError("Erreur lors de la récupération des fournisseurs")
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
        </DialogHeader>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Pays</label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un pays" />
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
            <p>Aucun fournisseur disponible pour ce film au {countryName}</p>
          </div>
        ) : (
          <Tabs defaultValue="flatrate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flatrate" disabled={!providers?.flatrate?.length}>
                Streaming
              </TabsTrigger>
              <TabsTrigger value="rent" disabled={!providers?.rent?.length}>
                Location
              </TabsTrigger>
              <TabsTrigger value="buy" disabled={!providers?.buy?.length}>
                Achat
              </TabsTrigger>
            </TabsList>

            {providers?.flatrate && providers.flatrate.length > 0 && (
              <TabsContent value="flatrate" className="py-4">
                <h3 className="mb-3 font-medium">Disponible en streaming sur :</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.flatrate.map((provider) => (
                    <div key={provider.provider_id} className="text-center">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs">{provider.provider_name}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {providers?.rent && providers.rent.length > 0 && (
              <TabsContent value="rent" className="py-4">
                <h3 className="mb-3 font-medium">Disponible en location sur :</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.rent.map((provider) => (
                    <div key={provider.provider_id} className="text-center">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs">{provider.provider_name}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {providers?.buy && providers.buy.length > 0 && (
              <TabsContent value="buy" className="py-4">
                <h3 className="mb-3 font-medium">Disponible à l'achat sur :</h3>
                <div className="flex flex-wrap gap-3">
                  {providers.buy.map((provider) => (
                    <div key={provider.provider_id} className="text-center">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs">{provider.provider_name}</p>
                    </div>
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

