
import { Movie } from './types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar AI',
    description: 'Um grupo de exploradores faz uso de um buraco negro recém-descoberto para superar as limitações das viagens espaciais humanas e conquistar as vastas distâncias de uma viagem interestelar.',
    backdropPath: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1920',
    posterPath: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=500',
    rating: 9.2,
    year: 2024,
    genre: ['Ficção Científica', 'Drama'],
    isOriginal: true,
    ageRating: '12',
    duration: '2h 49min',
    isInMyList: false,
    authorName: 'Admin'
  },
  {
    id: '2',
    title: 'A Redenção do Código',
    description: 'Em um futuro onde o código dita a realidade, um programador renegado descobre uma falha que pode mudar o destino da humanidade.',
    backdropPath: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920',
    posterPath: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500',
    rating: 8.8,
    year: 2023,
    genre: ['Ação', 'Thriller'],
    isOriginal: true,
    ageRating: '14',
    duration: '1h 55min',
    isInMyList: true,
    authorName: 'Admin'
  }
];

export const CATEGORIES = [
  { id: 'addedByUser', title: '🍿 Enviados pela Comunidade' },
  { id: 'myList', title: 'Minha Lista' },
  { id: 'trending', title: 'Em Alta' },
  { id: 'newReleases', title: 'Lançamentos' },
  { id: 'originals', title: 'Originais NETBONS' },
  { id: 'topRated', title: 'Melhores Avaliados' }
];

export const getAgeRatingColor = (rating: string | undefined): string => {
  switch (rating) {
    case 'L': return 'bg-[#00a650]'; 
    case '10': return 'bg-[#00adef]'; 
    case '12': return 'bg-[#ffca05] text-black'; 
    case '14': return 'bg-[#f58220]'; 
    case '16': return 'bg-[#ff0000]'; 
    case '18': return 'bg-[#000000] border border-gray-600'; 
    default: return 'bg-gray-700';
  }
};
