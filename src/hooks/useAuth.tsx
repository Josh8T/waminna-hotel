import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserRole } from '@/lib/data';
import { supabase, getProfile, createProfile, type AuthUser } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Load existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Return generic message — don't expose whether email or password is wrong
        return { success: false, error: 'Invalid email or password.' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to connect. Please try again.' };
    }
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          return { success: false, error: 'An account with this email already exists.' };
        }
        if (error.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            error: 'Email rate limit exceeded. Please disable "Confirm email" in Supabase Auth settings to allow instant signups.',
          };
        }
        return { success: false, error: error.message || 'Registration failed. Please try again.' };
      }

      // Create profile manually in case the DB trigger isn't set up yet
      if (authData.user) {
        await createProfile(
          authData.user.id,
          data.email,
          data.firstName,
          data.lastName,
          data.phone
        );
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unable to connect. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
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
