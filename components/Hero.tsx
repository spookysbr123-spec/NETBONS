
import React, { useState, useEffect } from 'react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie;
  onMoreInfo: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onMoreInfo }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  return (
    <div className="relative h-[75vh] md:h-[95vh] w-full overflow-hidden group">
      <img 
        src={movie.backdropPath} 
        alt={movie.title} 
        className="absolute inset-0 w-full h-full object-cover brightness-[0.6] transition-transform duration-[10s] ease-linear group-hover:scale-105"
      />
      <div className="absolute inset-0 netflix-gradient" />
      
      <div className="absolute left-4 md:left-12 bottom-[12%] md:bottom-[25%] max-w-2xl space-y-4 pr-4 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
           <span className="bg-[#A78BFA] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-purple-500/20">Original</span>
           <span className="text-gray-300 text-sm font-medium tracking-wide opacity-80">{greeting}, aqui está sua escolha principal:</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black drop-shadow-2xl leading-[1.1] tracking-tight">{movie.title}</h1>
        
        <p className="text-sm md:text-xl text-gray-200 line-clamp-2 md:line-clamp-3 drop-shadow-md font-light max-w-xl">
          {movie.description}
        </p>
        
        <div className="flex items-center gap-3 pt-4">
          <button className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-[#e6e6e6] transition-all transform active:scale-95 text-sm md:text-lg shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Assistir
          </button>
          <button 
            onClick={() => onMoreInfo(movie)}
            className="flex items-center justify-center gap-2 bg-gray-500 bg-opacity-60 text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-40 transition-all transform active:scale-95 text-sm md:text-lg backdrop-blur-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mais informações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
