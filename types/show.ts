export interface Show {
  id: number
  name: string
  poster_path: string | null
  vote_average: number
  first_air_date: string
  overview: string
  backdrop_path?: string | null
  genre_ids?: number[]
  original_language?: string
}
