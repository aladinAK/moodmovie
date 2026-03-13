"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Movie } from "@/types/movie"
import { getWatched, toggleWatched as toggleWatchedUtil, clearWatched as clearWatchedUtil } from '@/lib/watched'

interface WatchedContextType {
  watched: Movie[]
  isWatched: (id: number) => boolean
  toggleWatched: (item: Movie) => void
  clearAllWatched: () => void
}

const WatchedContext = createContext<WatchedContextType | undefined>(undefined)

export function WatchedProvider({ children }: { children: ReactNode }) {
  const [watched, setWatched] = useState<Movie[]>([])

  useEffect(() => {
    setWatched(getWatched())
  }, [])

  const isWatched = (id: number) => watched.some(w => w.id === id)

  const handleToggle = (item: Movie) => {
    const nowWatched = toggleWatchedUtil(item)
    if (nowWatched) {
      setWatched(prev => [...prev, item])
    } else {
      setWatched(prev => prev.filter(w => w.id !== item.id))
    }
  }

  const clearAllWatched = useCallback(() => {
    clearWatchedUtil()
    setWatched([])
  }, [])

  return (
    <WatchedContext.Provider value={{ watched, isWatched, toggleWatched: handleToggle, clearAllWatched }}>
      {children}
    </WatchedContext.Provider>
  )
}

export function useWatched() {
  const context = useContext(WatchedContext)
  if (!context) throw new Error('useWatched doit être utilisé dans WatchedProvider')
  return context
}
