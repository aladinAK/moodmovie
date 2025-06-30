export interface Book {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  averageRating?: number;
  ratingsCount?: number;
  pageCount?: number;
  language?: string;
  publisher?: string;
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  infoLink?: string;
  previewLink?: string;
}

export interface BookSearchResponse {
  items?: Array<{
    id: string;
    volumeInfo: Omit<Book, 'id'>;
  }>;
  totalItems: number;
}
