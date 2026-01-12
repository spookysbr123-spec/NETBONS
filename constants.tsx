
import { Movie } from './types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar AI',
    description: 'Um grupo de exploradores faz uso de um buraco negro recém-descoberto para superar as limitações das viagens espaciais humanas e conquistar as vastas distâncias de uma viagem interestelar.',
    backdropPath: 'https://picsum.photos/id/10/1920/1080',
    posterPath: 'https://picsum.photos/id/10/500/750',
    rating: 9.2,
    year: 2024,
    genre: ['Ficção Científica', 'Drama'],
    isOriginal: true,
    ageRating: '12',
    duration: '2h 49min',
    isInMyList: false
  },
  {
    id: '2',
    title: 'A Redenção do Código',
    description: 'Em um futuro onde o código dita a realidade, um programador renegado descobre uma falha que pode mudar o destino da humanidade.',
    backdropPath: 'https://picsum.photos/id/20/1920/1080',
    posterPath: 'https://picsum.photos/id/20/500/750',
    rating: 8.8,
    year: 2023,
    genre: ['Ação', 'Thriller'],
    isOriginal: true,
    ageRating: '14',
    duration: '1h 55min',
    isInMyList: true
  },
  {
    id: '3',
    title: 'Vale do Silício Sombrio',
    description: 'Por trás do brilho das startups de tecnologia, esconde-se uma rede de espionagem corporativa e segredos obscuros.',
    backdropPath: 'https://picsum.photos/id/30/1920/1080',
    posterPath: 'https://picsum.photos/id/30/500/750',
    rating: 8.5,
    year: 2024,
    genre: ['Mistério', 'Crime'],
    isOriginal: false,
    ageRating: '16',
    duration: '2h 10min',
    isInMyList: false
  },
  {
    id: '4',
    title: 'Sinfonia das Estrelas',
    description: 'Uma jornada musical através das galáxias explorando a conexão entre a harmonia universal e a consciência humana.',
    backdropPath: 'https://picsum.photos/id/40/1920/1080',
    posterPath: 'https://picsum.photos/id/40/500/750',
    rating: 9.0,
    year: 2025,
    genre: ['Documentário', 'Música'],
    isOriginal: false,
    ageRating: 'L',
    duration: '1h 30min',
    isInMyList: false
  },
  {
    id: '5',
    title: 'Neon Tokyo 2077',
    description: 'As luzes de neon nunca apagam, mas as sombras guardam segredos que podem derrubar o império tecnológico que governa a cidade.',
    backdropPath: 'https://picsum.photos/id/50/1920/1080',
    posterPath: 'https://picsum.photos/id/50/500/750',
    rating: 8.7,
    year: 2024,
    genre: ['Cyberpunk', 'Ação'],
    isOriginal: true,
    ageRating: '14',
    duration: '2h 05min',
    isInMyList: false
  },
  {
    id: '6',
    title: 'A Última Fronteira',
    description: 'Quando os recursos da Terra se esgotam, a humanidade olha para o fundo do oceano em busca de uma última chance de sobrevivência.',
    backdropPath: 'https://picsum.photos/id/60/1920/1080',
    posterPath: 'https://picsum.photos/id/60/500/750',
    rating: 8.2,
    year: 2023,
    genre: ['Aventura', 'Ação'],
    isOriginal: false,
    ageRating: '12',
    duration: '2h 15min',
    isInMyList: false
  }
];

export const CATEGORIES = [
  { id: 'addedByUser', title: 'Laboratório: Seus Envios' },
  { id: 'myList', title: 'Minha Lista' },
  { id: 'trending', title: 'Em Alta' },
  { id: 'newReleases', title: 'Novos' },
  { id: 'originals', title: 'Originais NETBONS' },
  { id: 'topRated', title: 'Mais Votados' }
];

export const getAgeRatingColor = (rating: string | undefined): string => {
  switch (rating) {
    case 'L':
      return 'bg-[#00a650]'; // Verde
    case '10':
      return 'bg-[#00adef]'; // Azul
    case '12':
      return 'bg-[#ffca05] text-black'; // Amarelo
    case '14':
      return 'bg-[#f58220]'; // Laranja
    case '16':
      return 'bg-[#ff0000]'; // Vermelho
    case '18':
      return 'bg-[#000000] border border-gray-600'; // Preto
    default:
      return 'bg-gray-700';
  }
};
