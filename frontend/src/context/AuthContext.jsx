/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const authState = localStorage.getItem('meditrack_auth');
      return authState ? JSON.parse(authState).isAuthenticated : false;
    } catch {
      return false;
    }
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    try {
      const authState = localStorage.getItem('meditrack_auth');
      return authState ? JSON.parse(authState).hasCompletedOnboarding : false;
    } catch {
      return false;
    }
  });

  const saveState = (auth, onboard) => {
    localStorage.setItem('meditrack_auth', JSON.stringify({
      isAuthenticated: auth,
      hasCompletedOnboarding: onboard
    }));
  };

  const login = () => {
    setIsAuthenticated(true);
    // Assume returning users have completed onboarding
    setHasCompletedOnboarding(true);
    saveState(true, true);
  };

  const signup = () => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(false);
    saveState(true, false);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    saveState(true, true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('meditrack_auth');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      hasCompletedOnboarding,
      login,
      signup,
      completeOnboarding,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
