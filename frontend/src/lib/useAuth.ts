import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  loading: boolean;
}

const API_BASE = '/api/auth';
const TOKEN_KEY = 'kirov5_jwt_token';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    userId: null,
    email: null,
    loading: true,
  });

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ authenticated: false, userId: null, email: null, loading: false });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/session`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setState({
          authenticated: data.authenticated,
          userId: data.userId ?? null,
          email: data.email ?? null,
          loading: false,
        });
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setState({ authenticated: false, userId: null, email: null, loading: false });
      }
    } catch {
      setState({ authenticated: false, userId: null, email: null, loading: false });
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Identifiants incorrects');

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    await checkSession();
    return data;
  }, [checkSession]);

  const register = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Erreur inscription');

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    await checkSession();
    return data;
  }, [checkSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ authenticated: false, userId: null, email: null, loading: false });
  }, []);

  return { ...state, login, register, logout, checkSession };
}
