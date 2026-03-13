export interface Track {
  id: number
  title: string
  duration: number
  preview: string
  link: string
  artist: {
    id: number
    name: string
  }
  album: {
    id: number
    title: string
    cover: string
    cover_medium: string
    cover_big: string
  }
}
