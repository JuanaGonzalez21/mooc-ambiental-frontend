// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/config';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  roleId?: number;
  roleName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token con el servidor
  const verifyTokenWithServer = async (token: string): Promise<User | null> => {
    try {
      const data = await apiRequest('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ token })
      });

      if (data?.success && data.user) {
        return data.user;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Cargar usuario al inicializar
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
          // Verificar token con servidor; si falla, la sesión no es válida
          const serverUser = await verifyTokenWithServer(storedToken);

          if (serverUser) {
            setUser(serverUser);
            localStorage.setItem('user', JSON.stringify(serverUser));
          } else {
            logout();
          }
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Mantener sesión activa
  useEffect(() => {
    if (!user) return;

    const keepSessionAlive = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        const serverUser = await verifyTokenWithServer(storedToken);
        if (serverUser) {
          setUser(serverUser);
          localStorage.setItem('user', JSON.stringify(serverUser));
        } else {
          logout();
        }
      }
    };

    // Verificar cada 10 minutos
    const sessionInterval = setInterval(keepSessionAlive, 600000);

    // Verificar al enfocar la página
    const handleFocus = () => {
      keepSessionAlive();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(sessionInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberUser');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


