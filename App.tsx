
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieDetailsModal from './components/MovieDetailsModal';
import ProfileSelection from './components/ProfileSelection';
import Login from './components/Login';
import { INITIAL_MOVIES, CATEGORIES } from './constants';
import { Movie } from './types';

const SESSION_KEY = 'netbons_session_v5';
const PROFILE_KEY = 'netbons_activeProfile_v5';
const MOVIE_DATA_KEY = 'netbons_user_movies_v5';
const LOGGED_USER_KEY = 'netbons_current_user_v5';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const App: React.FC = () => {
  // Estado de Autenticação com proteção contra Null
  const [authState, setAuthState] = useState(() => {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (Date.now() < session.expiry) {
          const userStr = localStorage.getItem(LOGGED_USER_KEY);
          const profileStr = localStorage.getItem(PROFILE_KEY);
          return {
            isLoggedIn: true,
            user: userStr ? JSON.parse(userStr) : null,
            profile: profileStr ? JSON.parse(profileStr) : null
          };
        }
      }
    } catch (e) {}
    return { isLoggedIn: false, user: null, profile: null };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);
  const [currentUser, setCurrentUser] = useState(authState.user);
  const [activeProfile, setActiveProfile] = useState(authState.profile);
  
  // Lista de filmes unificada para todos os usuários do dispositivo
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(MOVIE_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Garante que INITIAL_MOVIES existam mas não dupliquem
        const combined = [...parsed];
        INITIAL_MOVIES.forEach(initial => {
          if (!combined.some(m => m.id === initial.id)) {
            combined.push(initial);
          }
        });
        return combined;
      }
    } catch (e) {}
    return INITIAL_MOVIES;
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Sincroniza filmes no LocalStorage sempre que a lista mudar
  useEffect(() => {
    try {
      localStorage.setItem(MOVIE_DATA_KEY, JSON.stringify(movies));
    } catch (e) {}
  }, [movies]);

  const handleLoginSuccess = (userData: any) => {
    const expiry = Date.now() + THIRTY_DAYS_MS;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ expiry }));
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(userData));
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleProfileSelect = (p: any) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setActiveProfile(p);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LOGGED_USER_KEY);
    setIsLoggedIn(false);
    setActiveProfile(null);
    setCurrentUser(null);
    window.location.reload();
  };

  const handleAddMovie = (m: Movie) => {
    setMovies(prev => [m, ...prev]);
    setSelectedMovie(m);
    setToast(`"${m.title}" postado na comunidade!`);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleMyList = (id: string) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, isInMyList: !m.isInMyList } : m));
  };

  const getMoviesByCat = (id: string) => {
    switch (id) {
      case 'addedByUser': return movies.filter(m => m.isUserAdded);
      case 'myList': return movies.filter(m => m.isInMyList);
      case 'trending': return [...movies].filter(m => m.rating >= 8.5).sort((a,b) => b.rating - a.rating);
      case 'newReleases': return movies.filter(m => m.year >= 2024);
      case 'originals': return movies.filter(m => m.isOriginal);
      case 'topRated': return movies.filter(m => m.rating >= 8.8);
      default: return movies;
    }
  };

  // Movie do Hero (dinâmico baseado no último post ou original)
  const heroMovie = useMemo(() => {
    return movies.find(m => m.isUserAdded) || movies[0] || INITIAL_MOVIES[0];
  }, [movies]);

  if (!isLoggedIn) return <Login onLoginSuccess={handleLoginSuccess} />;
  if (!activeProfile) return <ProfileSelection userName={currentUser?.name} onSelect={handleProfileSelect} />;

  return (
    <div className="relative min-h-screen bg-[#141414] text-white pb-20 animate-fade-in overflow-x-hidden">
      <Navbar onAddMovie={handleAddMovie} onLogout={handleLogout} activeProfile={activeProfile} />
      
      <Hero movie={heroMovie} onMoreInfo={setSelectedMovie} />

      <div className="relative z-30 -mt-16 md:-mt-48 pb-10">
        {CATEGORIES.map(cat => {
          const categoryMovies = getMoviesByCat(cat.id);
          // Oculta linhas vazias de comunidade/lista se não houver itens
          if (categoryMovies.length === 0 && (cat.id === 'addedByUser' || cat.id === 'myList')) return null;
          
          return (
            <MovieRow 
              key={cat.id} 
              id={cat.id} 
              title={cat.title} 
              movies={categoryMovies} 
              isLarge={cat.id === 'originals'} 
              onMovieClick={setSelectedMovie} 
            />
          );
        })}
      </div>

      {selectedMovie && (
        <MovieDetailsModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onToggleMyList={() => toggleMyList(selectedMovie.id)} 
        />
      )}

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-[#A78BFA] text-white px-8 py-4 rounded-2xl font-black shadow-2xl animate-fade-in-up flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
