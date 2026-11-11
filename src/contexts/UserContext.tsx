import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface UserProfile {
  id: number | string;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  target_role?: string;
  experience_years?: string;
  created_at?: string;
  approved_at?: string;
}

export interface UserContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; status?: string; message?: string }>;
  signup: (data: {
    full_name: string;
    email: string;
    password: string;
    target_role?: string;
    experience_years?: string;
  }) => Promise<{ success: boolean; status?: string; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Backwards compatibility fields
  user_id: string | null;
  isPremiumUser: boolean;
  setUser: (user_id: string, isPremium: boolean, token: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Determine API base url
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      // Check if running on Vite dev server (port 5173) -> job engine backend runs on port 5055
      return 'http://localhost:5055';
    }
  }
  return '';
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('quickjob_token') || localStorage.getItem('token') || null;
  });

  const [user, setUserState] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('quickjob_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on mount
  const refreshUser = useCallback(async () => {
    const activeToken = token || localStorage.getItem('quickjob_token') || localStorage.getItem('token');
    if (!activeToken) {
      setUserState(null);
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (res.ok) {
        const userData: UserProfile = await res.json();
        setUserState(userData);
        localStorage.setItem('quickjob_user', JSON.stringify(userData));
        localStorage.setItem('quickjob_token', activeToken);
      } else {
        // Invalid or expired token or revoked status
        localStorage.removeItem('quickjob_token');
        localStorage.removeItem('quickjob_user');
        localStorage.removeItem('token');
        setToken(null);
        setUserState(null);
      }
    } catch {
      // Network offline - keep cached user if approved
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; status?: string; message?: string }> => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'approved') {
        const authToken = data.token;
        const profile: UserProfile = data.user;
        setToken(authToken);
        setUserState(profile);
        localStorage.setItem('quickjob_token', authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('quickjob_user', JSON.stringify(profile));
        return { success: true, status: 'approved' };
      }

      // Check status gating (403 or specific status)
      if (data.status === 'pending') {
        return { success: false, status: 'pending', message: data.message || 'Your account is waiting for admin approval.' };
      }
      if (data.status === 'rejected') {
        return { success: false, status: 'rejected', message: data.message || 'Your request was not approved' };
      }

      return {
        success: false,
        status: 'error',
        message: data.detail || data.message || 'Invalid email or password.',
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'error',
        message: err?.message || 'Unable to connect to QuickJob authentication service.',
      };
    }
  };

  const signup = async (data: {
    full_name: string;
    email: string;
    password: string;
    target_role?: string;
    experience_years?: string;
  }): Promise<{ success: boolean; status?: string; message?: string }> => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (res.ok) {
        return {
          success: true,
          status: 'pending',
          message: resData.message || 'Your account is waiting for admin approval.',
        };
      }

      return {
        success: false,
        status: 'error',
        message: resData.detail || resData.message || 'Registration failed. Please check your inputs.',
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'error',
        message: err?.message || 'Unable to reach the registration server.',
      };
    }
  };

  const logout = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    } catch {}

    localStorage.removeItem('quickjob_token');
    localStorage.removeItem('quickjob_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setToken(null);
    setUserState(null);
  };

  const setUser = (userId: string, isPremium: boolean, authToken: string) => {
    setToken(authToken);
    localStorage.setItem('quickjob_token', authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user_id', userId);
  };

  const clearUser = () => {
    logout();
  };

  const isAuthenticated = !!token && !!user && user.status === 'approved';
  const isAdmin = !!user && user.role === 'admin';

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
        user_id: user ? String(user.id) : null,
        isPremiumUser: true,
        setUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
