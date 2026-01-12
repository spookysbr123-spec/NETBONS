
export interface Movie {
  id: string;
  title: string;
  description: string;
  backdropPath: string;
  posterPath: string;
  rating: number;
  year: number;
  genre: string[];
  isOriginal?: boolean;
  isUserAdded?: boolean;
  isYoutube?: boolean; // Novo campo para identificar links do YT
  ageRating?: 'L' | '10' | '12' | '14' | '16' | '18';
  duration?: string;
  videoUrl?: string; 
  isInMyList?: boolean;
  authorName?: string;
}

export interface Category {
  id: string;
  title: string;
  movies: Movie[];
}
