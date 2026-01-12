
import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getMoreInfoAboutMovie } from '../services/geminiService';
import { getAgeRatingColor } from '../constants';
import { videoStore } from '../services/videoStore';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onToggleMyList?: () => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose, onToggleMyList }) => {
  const [geminiInfo, setGeminiInfo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add('modal-open');
    const fetchInfo = async () => {
      setLoading(true);
      const info = await getMoreInfoAboutMovie(movie.title);
      setGeminiInfo(info);
      setLoading(false);
    };

    const resolveVideo = async () => {
      if (movie.isUserAdded) {
        const url = await videoStore.getVideoUrl(movie.id);
        setResolvedVideoUrl(url);
      }
    };

    fetchInfo();
    resolveVideo();
    return () => document.body.classList.remove('modal-open');
  }, [movie]);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[...Array(10)].map((_, i) => (
        <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
      ))}
      <span className="ml-2 text-white font-black">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-start justify-center md:p-8 md:pt-20 overflow-y-auto">
      <div className="relative bg-[#181818] w-full max-w-4xl md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in-up border border-gray-800">
        
        <button onClick={onClose} className="absolute top-6 right-6 z-[120] bg-black/60 p-3 rounded-full text-white">X</button>

        <div className="relative aspect-video">
          {isPlaying && (resolvedVideoUrl || movie.videoUrl) ? (
            <video src={resolvedVideoUrl || movie.videoUrl} className="w-full h-full object-contain bg-black" controls autoPlay />
          ) : (
            <>
              <img src={movie.backdropPath} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 netflix-gradient" />
              <div className="absolute bottom-6 left-6">
                <h2 className="text-3xl md:text-5xl font-black mb-4">{movie.title}</h2>
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-opacity-80 transition flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Assistir Agora
                </button>
              </div>
            </>
          )}
        </div>

        <div className="p-6 md:p-12 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              {renderStars(movie.rating)}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{movie.year}</span>
                <span className={`px-2 py-0.5 rounded-sm font-black ${getAgeRatingColor(movie.ageRating)}`}>{movie.ageRating}</span>
              </div>
            </div>
            {movie.authorName && (
              <div className="text-right">
                <span className="text-gray-500 text-[10px] block uppercase font-black">Enviado por</span>
                <span className="text-[#A78BFA] font-bold">@{movie.authorName.replace(/\s+/g, '').toLowerCase()}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-300 text-sm md:text-xl leading-relaxed">{movie.description}</p>
          
          <div className="bg-purple-900/10 p-5 rounded-3xl border border-purple-900/20">
            <h4 className="text-[#A78BFA] text-[10px] font-black uppercase mb-1">NETBONS Intelligence</h4>
            <p className="text-gray-200 text-sm italic">{loading ? '...' : `"${geminiInfo}"`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
