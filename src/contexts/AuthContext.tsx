import { LoginCredentials, SignupCredentials, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, expectedRole?: User['role']) => Promise<User>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@foodie_express_auth';
const USERS_STORAGE_KEY = '@foodie_express_users';

// Mock user database (in AsyncStorage)
const getMockUsers = async (): Promise<Record<string, User & { password: string }>> => {
  try {
    const data = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveMockUsers = async (users: Record<string, User & { password: string }>) => {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.log('Failed to restore token', e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreToken();
  }, []);

  const login = async (credentials: LoginCredentials, expectedRole?: User['role']) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      if (!credentials.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      const users = await getMockUsers();
      const userEntry = Object.values(users).find(u => u.email === credentials.email);

      if (!userEntry || userEntry.password !== credentials.password) {
        throw new Error('Invalid email or password');
      }

      if (expectedRole && userEntry.role !== expectedRole) {
        throw new Error(`Please login with a ${expectedRole} account`);
      }

      const loggedInUser: User = {
        id: userEntry.id,
        email: userEntry.email,
        name: userEntry.name,
        phone: userEntry.phone,
        role: userEntry.role,
        createdAt: userEntry.createdAt,
        updatedAt: userEntry.updatedAt,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate inputs
      if (!credentials.email || !credentials.password || !credentials.name) {
        throw new Error('All fields are required');
      }

      if (!credentials.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const users = await getMockUsers();

      // Check if user already exists
      if (Object.values(users).some(u => u.email === credentials.email)) {
        throw new Error('Email is already registered');
      }

      const newUser: User & { password: string } = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: credentials.name,
        phone: credentials.phone,
        role: credentials.role,
        password: credentials.password, // Mock password storage (not secure for production!)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users[newUser.id] = newUser;
      await saveMockUsers(users);

      // Auto-login after signup
      const { password, ...userWithoutPassword } = newUser;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setError(null);
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
