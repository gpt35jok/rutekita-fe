import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Ambil Base URL dari Env yang kita buat tadi
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rutekita_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ username: email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    
    // Asumsi API Flask kamu mengembalikan object { user: {...}, access_token: "..." }
    const userData: User = data.user;
    
    setUser(userData);
    localStorage.setItem('rutekita_user', JSON.stringify(data));
    
    // Simpan token jika backend kamu pakai JWT
    if (data.access_token) {
      localStorage.setItem('rutekita_token', data.access_token);
      return true;
    }

    return false;

  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });

        if (!response.ok) throw new Error('Registration failed');

        const data = await response.json();
        const userData: User = data.user;

        setUser(userData);
        localStorage.setItem('rutekita_user', JSON.stringify(userData));
        return true;
      } catch (error) {
        console.error("Register Error:", error);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('rutekita_user');
    localStorage.removeItem('rutekita_token'); // Hapus token juga
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}