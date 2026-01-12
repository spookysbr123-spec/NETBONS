
import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getMetadataFromFilename } from '../services/geminiService';

interface AddContentModalProps {
  youtubeUrl: string;
  onConfirm: (movie: Movie) => void;
  onCancel: () => void;
  authorName: string;
}

const AddContentModal: React.FC<AddContentModalProps> = ({ youtubeUrl, onConfirm, onCancel, authorName }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Carregando...',
    description: '',
    genre: 'Vídeo do YouTube',
    ageRating: 'L' as any,
    year: new Date().getFullYear()
  });

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(youtubeUrl);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  useEffect(() => {
    if (videoId) {
      handleAiMagic();
    }
  }, [youtubeUrl]);

  const handleAiMagic = async () => {
    setLoading(true);
    try {
      // Usamos o Gemini para "adivinhar" metadados épicos baseados no link ou título temporário
      const metadata = await getMetadataFromFilename(youtubeUrl);
      setFormData({
        title: metadata.title || 'Título do Vídeo',
        description: metadata.description || 'Um conteúdo incrível compartilhado pela nossa comunidade.',
        genre: metadata.genre ? metadata.genre[0] : 'YouTube',
        ageRating: metadata.ageRating || 'L',
        year: metadata.year || new Date().getFullYear()
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) return alert("Erro ao identificar o vídeo.");

    const newMovie: Movie = {
      id: videoId,
      title: formData.title,
      description: formData.description,
      backdropPath: thumbnail,
      posterPath: thumbnail,
      rating: 8.5,
      year: formData.year,
      genre: [formData.genre],
      ageRating: formData.ageRating,
      isOriginal: false,
      isUserAdded: true,
      isYoutube: true, // Importante para o player
      videoUrl: youtubeUrl,
      authorName: authorName
    };
    onConfirm(newMovie);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-2xl min-h-screen md:min-h-0 md:rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
        <div className="relative aspect-video w-full bg-gray-900">
          <img src={thumbnail} className="w-full h-full object-cover opacity-60" alt="Preview" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-red-600 p-4 rounded-full shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
             </div>
          </div>
          <button onClick={onCancel} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white">X</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-black text-white">Adicionar do YouTube</h2>
            <button 
              type="button"
              onClick={handleAiMagic}
              className="text-[#A78BFA] text-sm font-bold bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20"
            >
              {loading ? 'Consultando IA...' : '✨ Refinar com IA'}
            </button>
          </div>

          <div className="space-y-4">
            <input 
              required
              placeholder="Título do Vídeo"
              className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
            <textarea 
              placeholder="Fale um pouco sobre este vídeo..."
              rows={3}
              className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-[#A78BFA] text-white py-4 rounded-full font-black text-lg hover:bg-[#8B5CF6] transition-all"
            >
              Publicar na Comunidade
            </button>
            <p className="text-center text-gray-500 text-[10px] mt-4 uppercase font-bold tracking-widest">
              Postado por: {authorName}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentModal;
