import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/lib/data';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const result = loginUser(email, password);
    if (result) {
      setUser(result);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    const newUser = registerUser(data);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    if (!user) return role === 'guest';
    const roleHierarchy: Record<UserRole, number> = { guest: 0, user: 1, staff: 2, owner: 3 };
    return roleHierarchy[user.role] >= roleHierarchy[role];
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
