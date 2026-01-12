
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieDetailsModal from './components/MovieDetailsModal';
import ProfileSelection from './components/ProfileSelection';
import Login from './components/Login';
import { INITIAL_MOVIES, CATEGORIES } from './constants';
import { Movie } from './types';
import { getMovieRecommendation } from './services/geminiService';

// Chaves de persistência consistentes
const SESSION_KEY = 'netbons_session_v5';
const PROFILE_KEY = 'netbons_activeProfile_v5';
const MOVIE_DATA_KEY = 'netbons_user_movies_v5';
const LOGGED_USER_KEY = 'netbons_current_user_v5';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const checkInitialAuth = () => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return { isLoggedIn: false, profile: null, user: null };
  try {
    const session = JSON.parse(sessionStr);
    if (Date.now() < session.expiry) {
      const profileStr = localStorage.getItem(PROFILE_KEY);
      const userStr = localStorage.getItem(LOGGED_USER_KEY);
      return { 
        isLoggedIn: true, 
        profile: profileStr ? JSON.parse(profileStr) : null,
        user: userStr ? JSON.parse(userStr) : null
      };
    }
  } catch (e) {}
  return { isLoggedIn: false, profile: null, user: null };
};

const App: React.FC = () => {
  const initial = checkInitialAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(initial.isLoggedIn);
  const [activeProfile, setActiveProfile] = useState(initial.profile);
  const [currentUser, setCurrentUser] = useState<any>(initial.user);
  
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem(MOVIE_DATA_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_MOVIES; }
    }
    return INITIAL_MOVIES;
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [heroMovie, setHeroMovie] = useState<Movie>(movies[0] || INITIAL_MOVIES[0]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(MOVIE_DATA_KEY, JSON.stringify(movies));
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
    localStorage.clear(); // Limpa tudo para segurança no logout
    setIsLoggedIn(false);
    setActiveProfile(null);
    setCurrentUser(null);
    window.location.reload(); // Garante reset total
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

  if (!isLoggedIn) return <Login onLoginSuccess={handleLoginSuccess} />;
  if (!activeProfile) return <ProfileSelection userName={currentUser?.name} onSelect={handleProfileSelect} />;

  return (
    <div className="relative min-h-screen bg-[#141414] text-white pb-20 animate-fade-in overflow-x-hidden">
      <Navbar onAddMovie={handleAddMovie} onLogout={handleLogout} activeProfile={activeProfile} />
      <Hero movie={heroMovie} onMoreInfo={setSelectedMovie} />

      <div className="relative z-30 -mt-16 md:-mt-48 pb-10">
        {CATEGORIES.filter(c => getMoviesByCat(c.id).length > 0 || !['addedByUser', 'myList'].includes(c.id)).map(cat => (
          <MovieRow key={cat.id} id={cat.id} title={cat.title} movies={getMoviesByCat(cat.id)} isLarge={cat.id === 'originals'} onMovieClick={setSelectedMovie} />
        ))}
      </div>

      {selectedMovie && (
        <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onToggleMyList={() => toggleMyList(selectedMovie.id)} />
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
