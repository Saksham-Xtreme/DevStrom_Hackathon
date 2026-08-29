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

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.user);
      setIsAuthenticated(true);
      setHasCompletedOnboarding(true);
      return true;
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
      return false;
    }
  };

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
        await refreshUser();
      } catch (error) {
        console.error('Authentication initialization failed:', error);
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

  // React to mid-session token expiry/invalidation
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

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
        refreshUser,
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
