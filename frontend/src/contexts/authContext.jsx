import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'authUser';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

const safelyParseUser = (rawUser) => {
  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.warn('Unable to parse stored auth user.', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      setUser(safelyParseUser(storedUser));
    }
    setIsReady(true);
  }, []);

  const persistUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const signIn = (nextUser) => {
    setUser(nextUser);
    persistUser(nextUser);
  };

  const signUp = async (nextUser) => {
    /**
     * Replace this with your real sign-up implementation.
     * For now we simply persist the user immediately after "sign up".
     */
    signIn(nextUser);
    return nextUser;
  };

  const signOut = () => {
    setUser(null);
    persistUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      signUp,
      isAuthenticated: Boolean(user),
      isReady,
    }),
    [user, isReady]
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

