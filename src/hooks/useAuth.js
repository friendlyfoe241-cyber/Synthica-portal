import { useState, useEffect } from 'react';

const AUTH_KEY = 'synthica_auth';

export function useAuth() {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setStaff(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (password === adminPassword) {
      const authData = { loggedIn: true, timestamp: Date.now() };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      setStaff(authData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setStaff(null);
  };

  return { staff, loading, login, logout };
}