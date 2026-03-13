import { Movie } from "@/types/movie"

const WATCHED_KEY = 'moodmovie_watched'

export function getWatched(): Movie[] {
  if (typeof window === 'undefined') return []
  const json = localStorage.getItem(WATCHED_KEY)
  if (!json) return []
  try {
    return JSON.parse(json)
  } catch {
    return []
  }
}

export function isWatched(id: number): boolean {
  return getWatched().some(item => item.id === id)
}

export function toggleWatched(item: Movie): boolean {
  const watched = getWatched()
  const already = watched.some(w => w.id === item.id)
  if (already) {
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watched.filter(w => w.id !== item.id)))
    return false
  } else {
    localStorage.setItem(WATCHED_KEY, JSON.stringify([...watched, item]))
    return true
  }
}

export function clearWatched(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(WATCHED_KEY)
}
