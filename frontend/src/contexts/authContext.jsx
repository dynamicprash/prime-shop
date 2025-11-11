import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth.js';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        // ignore 401s (not signed in)
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (credentials) => {
    setError(null);
    try {
      const data = await apiLogin(credentials);
      setUser(data?.user ?? null);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signUp = async (payload) => {
    setError(null);
    try {
      await apiRegister(payload);
      return await signIn({ email: payload.email, password: payload.password });
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await apiLogout();
    } catch (err) {
      setError(err);
      // even if logout fails, clear client state
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      signUp,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
    }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

