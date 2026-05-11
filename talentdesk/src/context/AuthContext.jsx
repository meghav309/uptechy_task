import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const AUTH_KEY  = 'td-auth';
const VALID_EMAIL    = 'admin@talentdesk.com';
const VALID_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem(AUTH_KEY) === 'true'
  );

  const login = useCallback((email, password) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
