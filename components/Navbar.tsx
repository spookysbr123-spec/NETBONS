
import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import AddContentModal from './AddContentModal';

interface NavbarProps {
  onAddMovie: (movie: Movie) => void;
  onLogout: () => void;
  activeProfile: any;
}

const Navbar: React.FC<NavbarProps> = ({ onAddMovie, onLogout, activeProfile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [pendingFile, setPendingFile] = useState<{ file: File, url: string, thumb: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ['addedByUser', 'newReleases', 'trending', 'myList'];
      let current = 'top';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 150) current = section;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  const captureThumbnail = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = url;
      video.crossOrigin = 'anonymous';
      video.currentTime = 1;
      video.muted = true;
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      video.onerror = () => resolve('https://picsum.photos/1920/1080');
      video.load();
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      const thumb = await captureThumbnail(url);
      setPendingFile({ file, url, thumb });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmAdd = (movie: Movie) => {
    onAddMovie(movie);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const navLinks = [
    { id: 'top', label: 'Início' },
    { id: 'addedByUser', label: 'Comunidade' },
    { id: 'newReleases', label: 'Novos' },
    { id: 'trending', label: 'Em Alta' },
    { id: 'myList', label: 'Minha Lista' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 flex items-center justify-between px-4 md:px-12 py-3 md:py-4 ${isScrolled || isMobileMenuOpen ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl' : 'navbar-gradient'}`}>
        <div className="flex items-center gap-2 md:gap-8">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
          <h1 onClick={() => scrollToSection('top')} className="text-2xl md:text-3xl font-black tracking-tighter uppercase cursor-pointer">
            <span className="text-white">NET</span><span className="text-[#A78BFA]">BONS</span>
          </h1>
          <ul className="hidden lg:flex gap-6 text-sm font-medium text-gray-400">
            {navLinks.map(link => (
              <li key={link.id} onClick={() => scrollToSection(link.id)} className={`cursor-pointer hover:text-white transition-colors ${activeSection === link.id ? 'text-white font-black' : ''}`}>
                {link.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
          <button onClick={handleUploadClick} disabled={isUploading} className="flex items-center gap-2 bg-[#A78BFA] hover:bg-[#8B5CF6] transition-all px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-black shadow-lg">
            {isUploading ? <span className="animate-spin text-lg">↻</span> : <span>+</span>}
            <span className="hidden sm:inline">Postar</span>
          </button>
          
          <div className="relative group">
            <div onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-white transition-all">
              <img src={activeProfile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {isAccountMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-black/95 border border-white/10 rounded-2xl py-4 shadow-2xl">
                <div className="px-4 py-2 border-b border-white/5 mb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black">Perfil Ativo</p>
                  <p className="text-white font-bold">{activeProfile?.name}</p>
                </div>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-purple-400 font-bold hover:bg-white/5">Sair do NETBONS</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 p-8 pt-24 space-y-6 flex flex-col items-center">
          {navLinks.map(link => (
            <div key={link.id} onClick={() => scrollToSection(link.id)} className="text-2xl font-black text-gray-400 hover:text-white transition-colors">{link.label}</div>
          ))}
          <button onClick={onLogout} className="mt-auto text-purple-400 font-bold">Sair</button>
        </div>
      )}

      {pendingFile && (
        <AddContentModal 
          file={pendingFile.file}
          videoUrl={pendingFile.url}
          thumbnail={pendingFile.thumb}
          onConfirm={handleConfirmAdd}
          onCancel={() => setPendingFile(null)}
          authorName={activeProfile?.name} // Passa o nome do autor logado
        />
      )}
    </>
  );
};

export default Navbar;
