"use client";

import {
  createContext, useContext, useState,
  useEffect, useCallback, type ReactNode,
} from 'react';

export interface AuthUser {
  id:      string;
  name:    string;
  email:   string;
  gender?: string;
  role?:   string;
  created_at: string;
}

export interface AuthTokens {
  access:  string;
  refresh: string;
}

interface AuthContextValue {
  user:        AuthUser | null;
  tokens:      AuthTokens | null;
  isLoggedIn:  boolean;
  isLoading:   boolean; 
  login:       (tokens: AuthTokens, user: AuthUser) => void;
  logout:      () => void;
  updateUser:  (partial: Partial<AuthUser>) => void;
}

const K = {
  access:   'neuroCareAccessToken',
  refresh:  'neuroCareRefreshToken',
  user:     'neuroCareUser',

  loggedIn: 'neuroCareUserLoggedIn',
  email:    'neuroCareUserEmail',
  name:     'neuroCareUserIdentifier',
} as const;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [tokens,    setTokens]    = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw    = localStorage.getItem(K.user);
      const access = localStorage.getItem(K.access);
      const refresh = localStorage.getItem(K.refresh);
      if (raw && access) {
        setUser(JSON.parse(raw) as AuthUser);
        setTokens({ access, refresh: refresh ?? '' });
      }
    } catch {
      Object.values(K).forEach(k => localStorage.removeItem(k));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistAll = (t: AuthTokens, u: AuthUser) => {
    localStorage.setItem(K.access,   t.access);
    localStorage.setItem(K.refresh,  t.refresh);
    localStorage.setItem(K.user,     JSON.stringify(u));

    localStorage.setItem(K.loggedIn, 'true');
    localStorage.setItem(K.email,    u.email);
    localStorage.setItem(K.name,     u.name);
    document.cookie = `accessToken=${t.access}; path=/`;
  };

  const clearAll = () => Object.values(K).forEach(k => localStorage.removeItem(k));

  const login = useCallback((newTokens: AuthTokens, newUser: AuthUser) => {
    setTokens(newTokens);
    setUser(newUser);
    persistAll(newTokens, newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    clearAll();
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem(K.user,  JSON.stringify(next));
      localStorage.setItem(K.name,  next.name);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, tokens,
      isLoggedIn: !!user && !!tokens,
      isLoading,
      login, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}