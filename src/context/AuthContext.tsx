import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gl_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Tự động load user từ token khi mở trang
  useEffect(() => {
    const savedToken = localStorage.getItem('gl_token');
    if (savedToken) {
      authAPI.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('gl_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('gl_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authAPI.register(name, email, password);
    localStorage.setItem('gl_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('gl_token');
    setToken(null);
    setUser(null);
    window.location.href = '/ak-management/login';
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAdmin: user?.role === 'ADMIN',
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
