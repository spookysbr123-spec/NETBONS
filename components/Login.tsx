
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (userData: { name: string, email: string }) => void;
}

interface UserRecord {
  email: string;
  password: string;
  name: string;
}

// Chave unificada v5
const USERS_STORAGE_KEY = 'netbons_registered_users_v5';

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getUsers = (): UserRecord[] => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getUsers();
    const normalizedEmail = email.toLowerCase().trim();

    if (isLoginMode) {
      const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (!user) {
        setError('E-mail não encontrado. Que tal criar uma conta?');
        return;
      }

      if (user.password !== password) {
        setError('Senha incorreta. Tente novamente.');
        return;
      }

      onLoginSuccess({ name: user.name, email: user.email });
    } else {
      if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        setError('Este e-mail já está em uso.');
        return;
      }

      if (password.length < 4) {
        setError('A senha deve ter pelo menos 4 caracteres.');
        return;
      }

      const newUser: UserRecord = { email: normalizedEmail, password, name: name || 'Usuário' };
      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      onLoginSuccess({ name: newUser.name, email: newUser.email });
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="grid grid-cols-6 gap-2 transform -rotate-12 scale-150">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-900 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="relative z-20 w-full max-w-[450px] p-8 md:p-16 bg-black/80 backdrop-blur-2xl md:rounded-[3rem] shadow-2xl border border-white/5">
        <h1 className="text-white text-3xl font-black mb-8">
          {isLoginMode ? 'Entrar' : 'Assinar'}
        </h1>

        {error && (
          <div className="bg-[#e87c03] text-white p-4 rounded-xl mb-6 text-sm animate-fade-in-up flex gap-3 items-start font-medium">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <input 
              type="text" 
              placeholder="Nome"
              required
              className="w-full bg-[#333] text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input 
            type="email" 
            placeholder="Email"
            required
            className="w-full bg-[#333] text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            type="password" 
            placeholder="Senha"
            required
            className="w-full bg-[#333] text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button 
            type="submit"
            className="w-full bg-[#A78BFA] text-white py-4 rounded-full font-black text-lg hover:bg-[#8B5CF6] transition-all transform active:scale-95 shadow-xl"
          >
            {isLoginMode ? 'Entrar' : 'Começar'}
          </button>
        </form>

        <p className="mt-8 text-gray-500 text-center text-sm md:text-base">
          {isLoginMode ? 'Novo por aqui?' : 'Já tem uma conta?'} {' '}
          <span 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }}
            className="text-white font-bold hover:underline cursor-pointer"
          >
            {isLoginMode ? 'Crie sua conta.' : 'Faça login.'}
          </span>
        </p>
      </div>

      <div className="absolute top-12 left-12">
        <h1 className="text-3xl font-black tracking-tighter uppercase">
          <span className="text-white">NET</span><span className="text-[#A78BFA]">BONS</span>
        </h1>
      </div>
    </div>
  );
};

export default Login;
