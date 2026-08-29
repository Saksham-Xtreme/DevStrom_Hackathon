/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if Google OAuth returned a JWT
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          localStorage.setItem('token', token);

          // Remove token from URL after saving it
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

        const savedToken = localStorage.getItem('token');

        // No token means the user is not logged in
        if (!savedToken) {
          setLoading(false);
          return;
        }

        // Ask backend for the actual logged-in user
        const response = await authApi.getCurrentUser();

        setUser(response.user);
        setIsAuthenticated(true);
        setHasCompletedOnboarding(true);
      } catch (error) {
        console.error('Authentication initialization failed:', error);

        // Invalid/expired token
        localStorage.removeItem('token');

        setUser(null);
        setIsAuthenticated(false);
        setHasCompletedOnboarding(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);
  };

  const signup = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setHasCompletedOnboarding(false);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const logout = () => {
    localStorage.removeItem('token');

    setUser(null);
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCompletedOnboarding,
        user,
        loading,
        login,
        signup,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}