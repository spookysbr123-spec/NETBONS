
import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getMoreInfoAboutMovie } from '../services/geminiService';
import { getAgeRatingColor } from '../constants';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onToggleMyList?: () => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose, onToggleMyList }) => {
  const [geminiInfo, setGeminiInfo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.body.classList.add('modal-open');
    const fetchInfo = async () => {
      setLoading(true);
      const info = await getMoreInfoAboutMovie(movie.title);
      setGeminiInfo(info);
      setLoading(false);
    };
    fetchInfo();
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [movie]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(10)].map((_, i) => (
          <span 
            key={i} 
            className={`text-sm md:text-base ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-white font-black text-sm md:text-lg">{rating.toFixed(1)} <span className="text-gray-500 font-normal text-xs md:text-sm">/ 10</span></span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-start justify-center md:p-8 md:pt-20 overflow-y-auto">
      <div className="relative bg-[#181818] w-full max-w-4xl min-h-screen md:min-h-0 md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up border-x border-b border-gray-800">
        
        {/* Botão fechar */}
        <button 
          onClick={onClose}
          className="fixed md:absolute top-6 right-6 z-[120] bg-black/60 p-3 rounded-full text-white border border-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-video md:h-[500px]">
          {isPlaying && movie.videoUrl ? (
            <video src={movie.videoUrl} className="w-full h-full object-contain bg-black" controls autoPlay />
          ) : (
            <>
              <img src={movie.backdropPath} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 netflix-gradient" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10">
                <h2 className="text-2xl md:text-5xl font-black mb-4 drop-shadow-2xl">{movie.title}</h2>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  <button 
                    onClick={() => movie.videoUrl ? setIsPlaying(true) : null}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-opacity-80 transition flex items-center justify-center gap-2 text-base shadow-2xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Assistir
                  </button>
                  
                  <button 
                    onClick={onToggleMyList}
                    className={`flex items-center justify-center gap-2 border-2 px-6 py-3 rounded-full transition shadow-xl ${movie.isInMyList ? 'bg-white border-white text-black' : 'bg-black/20 backdrop-blur-md border-gray-400 text-white'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={movie.isInMyList ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                    </svg>
                    {movie.isInMyList ? 'Na minha lista' : 'Minha lista'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 md:p-12 space-y-6 md:space-y-8">
          <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm font-medium">
            <div className="flex flex-col gap-1">
               {renderStars(movie.rating)}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{movie.year}</span>
              <span className={`px-2 py-0.5 rounded-sm text-[10px] md:text-xs font-black shadow-md ${getAgeRatingColor(movie.ageRating)}`}>
                {movie.ageRating === 'L' ? 'L' : movie.ageRating}
              </span>
              <span className="text-gray-400">{movie.duration || '1h 50min'}</span>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm md:text-xl leading-relaxed">
            {movie.description}
          </p>
          
          <div className="bg-purple-900/10 p-5 md:p-8 rounded-3xl border border-purple-900/20 relative">
            <h4 className="text-[#A78BFA] text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              NETBONS Intelligence
            </h4>
            <p className="text-gray-200 text-sm md:text-lg italic font-light leading-snug">
              {loading ? <span className="animate-pulse opacity-50">Sintonizando canais...</span> : `"${geminiInfo}"`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm pt-4 border-t border-gray-800">
             <div>
               <span className="text-gray-500 font-bold block mb-1">Gêneros:</span>
               <div className="flex flex-wrap gap-2 text-gray-300">
                 {movie.genre.map((g, i) => <span key={i} className="bg-white/5 px-2 py-1 rounded-lg">{g}</span>)}
               </div>
             </div>
             <div>
               <span className="text-gray-500 font-bold block mb-1">Qualidade:</span>
               <span className="text-purple-400 font-black tracking-tighter uppercase">Ultra HD 4K | 5.1</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
