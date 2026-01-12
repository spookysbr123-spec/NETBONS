
import React, { useRef } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  id?: string;
  title: string;
  movies: Movie[];
  isLarge?: boolean;
  onMovieClick: (movie: Movie) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ id, title, movies, isLarge, onMovieClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div id={id} className="space-y-1 md:space-y-4 px-4 md:px-12 py-3 md:py-4 scroll-mt-20">
      <h2 className="text-base md:text-xl font-bold text-gray-200">{title}</h2>
      
      <div className="group relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition p-2 focus:outline-none hidden md:flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-scroll no-scrollbar scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
        >
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              isLarge={isLarge} 
              onClick={onMovieClick}
            />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition p-2 focus:outline-none hidden md:flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
