
import React from 'react';
import { Movie } from '../types';
import { getAgeRatingColor } from '../constants';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isLarge?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isLarge }) => {
  return (
    <div 
      onClick={() => onClick(movie)}
      className={`relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-out transform hover:scale-110 hover:z-50 group ${
        isLarge ? 'w-44 md:w-60 aspect-[2/3]' : 'w-40 md:w-64 aspect-video'
      }`}
    >
      <img 
        src={isLarge ? movie.posterPath : movie.backdropPath} 
        alt={movie.title}
        className={`w-full h-full object-cover shadow-lg border border-transparent group-hover:border-gray-700 group-hover:shadow-2xl transition-all duration-300 ${isLarge ? 'rounded-2xl' : 'rounded-xl md:rounded-2xl'}`}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex flex-col justify-end p-3">
         <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
           <p className="text-xs md:text-sm font-bold truncate drop-shadow-lg">{movie.title}</p>
           
           <div className="flex gap-2 items-center">
             <div className="flex items-center gap-1">
               <span className="text-yellow-400 text-[10px] md:text-xs">★</span>
               <span className="text-white text-[10px] md:text-xs font-black">{movie.rating.toFixed(1)}</span>
             </div>
             <span className="text-white bg-transparent border border-gray-500 px-2 rounded-full text-[8px] md:text-[10px]">{movie.year}</span>
             {movie.ageRating && (
               <span className={`text-[8px] md:text-[10px] px-2 rounded-sm font-black shadow-md ${getAgeRatingColor(movie.ageRating)}`}>
                 {movie.ageRating === 'L' ? 'L' : movie.ageRating}
               </span>
             )}
           </div>
         </div>
      </div>
      
      {movie.rating > 9 && !isLarge && (
        <div className="absolute top-2 right-2 bg-[#A78BFA] text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
          EM ALTA
        </div>
      )}
    </div>
  );
};

export default MovieCard;
