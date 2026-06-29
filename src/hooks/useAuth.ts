import { useState, useEffect } from 'react';

const TOKEN_KEY = 'tfg_auth_token';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const isAuthenticated = !!token;

  const login = (fakeToken: string) => {
    localStorage.setItem(TOKEN_KEY, fakeToken);
    setToken(fakeToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem(TOKEN_KEY));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { token, isAuthenticated, login, logout };
}
