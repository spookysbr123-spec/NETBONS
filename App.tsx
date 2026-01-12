
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
  // Estado inicial calculado com segurança
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
    } catch (e) {
      console.error("Erro ao carregar sessão:", e);
    }
    return { isLoggedIn: false, user: null, profile: null };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);
  const [currentUser, setCurrentUser] = useState(authState.user);
  const [activeProfile, setActiveProfile] = useState(authState.profile);
  
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(MOVIE_DATA_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MOVIES;
    } catch {
      return INITIAL_MOVIES;
    }
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [heroMovie] = useState<Movie>(() => movies[0] || INITIAL_MOVIES[0]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(MOVIE_DATA_KEY, JSON.stringify(movies));
    } catch (e) {
      console.error("Erro ao salvar filmes:", e);
    }
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
    setToast(`"${m.title}" adicionado!`);
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

  // Renderização Condicional Protegida
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (!activeProfile) {
    return <ProfileSelection userName={currentUser?.name} onSelect={handleProfileSelect} />;
  }

  return (
    <div className="relative min-h-screen bg-[#141414] text-white pb-20 animate-fade-in overflow-x-hidden">
      <Navbar onAddMovie={handleAddMovie} onLogout={handleLogout} activeProfile={activeProfile} />
      <Hero movie={heroMovie} onMoreInfo={setSelectedMovie} />

      <div className="relative z-30 -mt-16 md:-mt-48 pb-10">
        {CATEGORIES.map(cat => {
          const categoryMovies = getMoviesByCat(cat.id);
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
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl animate-fade-in-up">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
