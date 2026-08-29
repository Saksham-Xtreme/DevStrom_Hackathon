/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('oauth_success') === 'true') {
          localStorage.setItem('meditrack_auth', JSON.stringify({
            isAuthenticated: true,
            hasCompletedOnboarding: true
          }));
          return true;
        }
      }
      const authState = localStorage.getItem('meditrack_auth');
      return authState ? JSON.parse(authState).isAuthenticated : false;
    } catch {
      return false;
    }
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('oauth_success') === 'true') {
          return true;
        }
      }
      const authState = localStorage.getItem('meditrack_auth');
      return authState ? JSON.parse(authState).hasCompletedOnboarding : false;
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const authState = localStorage.getItem('meditrack_auth');
      return authState && JSON.parse(authState).user
        ? JSON.parse(authState).user
        : {
            name: 'Hem Ranjan',
            greeting: 'Hem',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            email: 'hem.ranjan@example.com',
          };
    } catch {
      return {
        name: 'Hem Ranjan',
        greeting: 'Hem',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        email: 'hem.ranjan@example.com',
      };
    }
  });

  const saveState = (auth, onboard, userData) => {
    localStorage.setItem(
      'meditrack_auth',
      JSON.stringify({
        isAuthenticated: auth,
        hasCompletedOnboarding: onboard,
        user: userData || user,
      })
    );
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);
    if (userData) {
      setUser(userData);
      saveState(true, true, userData);
    } else {
      saveState(true, true, user);
    }
  };

  const signup = (userData) => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(false);
    if (userData) {
      setUser(userData);
      saveState(true, false, userData);
    } else {
      saveState(true, false, user);
    }
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    saveState(true, true, user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setUser({
      name: 'Hem Ranjan',
      greeting: 'Hem',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      email: 'hem.ranjan@example.com',
    });
    localStorage.removeItem('meditrack_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCompletedOnboarding,
        user,
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
