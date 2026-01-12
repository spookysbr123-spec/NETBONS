
import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getMetadataFromFilename } from '../services/geminiService';

interface AddContentModalProps {
  file: File;
  videoUrl: string;
  thumbnail: string;
  onConfirm: (movie: Movie) => void;
  onCancel: () => void;
}

const AddContentModal: React.FC<AddContentModalProps> = ({ file, videoUrl, thumbnail, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: file.name.split('.')[0],
    description: '',
    genre: 'Vídeo',
    ageRating: 'L' as any,
    year: new Date().getFullYear()
  });

  const handleAiMagic = async () => {
    setLoading(true);
    try {
      const metadata = await getMetadataFromFilename(file.name);
      setFormData({
        title: metadata.title || formData.title,
        description: metadata.description || '',
        genre: metadata.genre ? metadata.genre[0] : 'Vídeo',
        ageRating: metadata.ageRating || 'L',
        year: metadata.year || new Date().getFullYear()
      });
    } catch (error) {
      console.error("Erro na IA:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMovie: Movie = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      backdropPath: thumbnail,
      posterPath: thumbnail,
      rating: 9.0,
      year: formData.year,
      genre: [formData.genre],
      ageRating: formData.ageRating,
      videoUrl: videoUrl,
      isOriginal: false,
      isUserAdded: true,
      isInMyList: false
    };
    onConfirm(newMovie);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-2xl min-h-screen md:min-h-0 md:rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
        
        <div className="relative aspect-video w-full bg-gray-900">
          <img src={thumbnail} className="w-full h-full object-cover opacity-60" alt="Preview" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-[#A78BFA] p-4 rounded-full shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
             </div>
          </div>
          <button onClick={onCancel} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-black text-white">Detalhes do Conteúdo</h2>
            <button 
              type="button"
              onClick={handleAiMagic}
              disabled={loading}
              className="flex items-center gap-2 text-[#A78BFA] hover:text-white transition-colors text-sm font-bold bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20"
            >
              <span className={loading ? 'animate-spin' : ''}>✨</span>
              {loading ? 'Consultando IA...' : 'Mágica com IA'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Título</label>
              <input 
                required
                className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Descrição</label>
              <textarea 
                rows={3}
                className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 transition-all resize-none"
                placeholder="Sobre o que é este conteúdo?"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Gênero</label>
                <select 
                  className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
                  value={formData.genre}
                  onChange={e => setFormData({...formData, genre: e.target.value})}
                >
                  <option>Vídeo</option>
                  <option>Filme</option>
                  <option>Série</option>
                  <option>Documentário</option>
                  <option>Família</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Classificação</label>
                <select 
                  className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
                  value={formData.ageRating}
                  onChange={e => setFormData({...formData, ageRating: e.target.value as any})}
                >
                  <option value="L">Livre</option>
                  <option value="12">12+</option>
                  <option value="14">14+</option>
                  <option value="16">16+</option>
                  <option value="18">18+</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row gap-4">
            <button 
              type="submit"
              className="flex-1 bg-[#A78BFA] text-white py-4 rounded-full font-black text-lg hover:bg-[#8B5CF6] transition-all transform active:scale-95 shadow-xl"
            >
              Adicionar ao Laboratório
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="md:hidden text-gray-500 font-bold py-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentModal;
