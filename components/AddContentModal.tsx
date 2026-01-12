
import React, { useState } from 'react';
import { Movie } from '../types';
import { getMetadataFromFilename } from '../services/geminiService';
import { videoStore } from '../services/videoStore';

interface AddContentModalProps {
  file: File;
  videoUrl: string;
  thumbnail: string;
  onConfirm: (movie: Movie) => void;
  onCancel: () => void;
  authorName: string;
}

const AddContentModal: React.FC<AddContentModalProps> = ({ file, videoUrl, thumbnail, onConfirm, onCancel, authorName }) => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const id = Math.random().toString(36).substr(2, 9);
    
    try {
      // Salva o vídeo fisicamente no navegador para que outros usuários vejam
      await videoStore.saveVideo(id, file);
      
      const newMovie: Movie = {
        id,
        title: formData.title,
        description: formData.description,
        backdropPath: thumbnail,
        posterPath: thumbnail,
        rating: 9.0,
        year: formData.year,
        genre: [formData.genre],
        ageRating: formData.ageRating,
        isOriginal: false,
        isUserAdded: true,
        isInMyList: false,
        authorName: authorName // Registra quem postou
      };
      onConfirm(newMovie);
    } catch (err) {
      alert("Erro ao processar vídeo para a comunidade.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      <div className="bg-[#181818] w-full max-w-2xl min-h-screen md:min-h-0 md:rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
        <div className="relative aspect-video w-full bg-gray-900">
          <img src={thumbnail} className="w-full h-full object-cover opacity-60" alt="Preview" />
          <button onClick={onCancel} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white">X</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-black text-white">Postar na Comunidade</h2>
            <button 
              type="button"
              onClick={handleAiMagic}
              className="text-[#A78BFA] text-sm font-bold bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20"
            >
              {loading ? '...' : '✨ Mágica IA'}
            </button>
          </div>

          <div className="space-y-4">
            <input 
              required
              placeholder="Título"
              className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
            <textarea 
              placeholder="Descrição"
              className="w-full bg-[#333] text-white px-4 py-3 rounded-xl focus:outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#A78BFA] text-white py-4 rounded-full font-black text-lg hover:bg-[#8B5CF6] transition-all disabled:opacity-50"
            >
              {isSaving ? 'Publicando...' : 'Publicar para Todos'}
            </button>
            <p className="text-center text-gray-500 text-[10px] mt-4 uppercase font-bold tracking-widest">
              Publicando como: {authorName}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentModal;
