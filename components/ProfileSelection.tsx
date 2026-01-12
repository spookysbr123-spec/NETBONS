
import React from 'react';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids?: boolean;
}

interface ProfileSelectionProps {
  onSelect: (profile: Profile) => void;
  userName?: string;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ onSelect, userName }) => {
  const profiles: Profile[] = [
    { id: '1', name: userName || 'Você', avatar: 'https://picsum.photos/id/64/200/200' },
    { id: '2', name: 'Crianças', avatar: 'https://picsum.photos/id/103/200/200', isKids: true },
    { id: '3', name: 'Convidado', avatar: 'https://picsum.photos/id/177/200/200' },
  ];

  return (
    <div className="fixed inset-0 z-[300] bg-[#141414] flex flex-col items-center justify-center p-6 animate-fade-in overflow-y-auto">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-3xl md:text-5xl text-white font-medium mb-12 tracking-wide">
          Quem está assistindo?
        </h1>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {profiles.map((profile) => (
            <div 
              key={profile.id}
              onClick={() => onSelect(profile)}
              className="group cursor-pointer flex flex-col items-center space-y-4"
            >
              <div className="relative">
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-28 h-28 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-transparent group-hover:border-white transition-all duration-300 shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-2xl" />
              </div>
              <span className="text-gray-500 text-lg md:text-2xl group-hover:text-white transition-colors font-medium">
                {profile.name}
              </span>
            </div>
          ))}

          <div className="group cursor-pointer flex flex-col items-center space-y-4">
             <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-gray-800 flex items-center justify-center border-4 border-transparent group-hover:border-gray-400 group-hover:bg-gray-700 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
             </div>
             <span className="text-gray-500 text-lg md:text-2xl group-hover:text-white transition-colors">
              Adicionar
            </span>
          </div>
        </div>

        <button className="mt-20 px-8 py-2 border border-gray-500 text-gray-500 text-lg uppercase tracking-widest hover:text-white hover:border-white transition-all rounded-sm font-black">
          Gerenciar Perfis
        </button>
      </div>
    </div>
  );
};

export default ProfileSelection;
