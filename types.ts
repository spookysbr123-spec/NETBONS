
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
  ageRating?: 'L' | '10' | '12' | '14' | '16' | '18';
  duration?: string;
  videoUrl?: string; // URL.createObjectURL para vídeos locais
  isInMyList?: boolean;
}

export interface Category {
  id: string;
  title: string;
  movies: Movie[];
}
