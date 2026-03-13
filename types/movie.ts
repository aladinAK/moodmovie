export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
    overview: string;
    
    // Propriétés optionnelles qui peuvent être utiles
    backdrop_path?: string | null;
    genre_ids?: number[];
    original_language?: string;
    popularity?: number;
    video?: boolean;
    vote_count?: number;
    adult?: boolean;
    original_title?: string;
  }