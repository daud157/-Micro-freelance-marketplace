import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'employer';
  bio?: string;
  skills?: string[];
  company_name?: string;
  company_description?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook for using the user context
function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Create the provider component
function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Found token, fetching user profile...');
      fetchUserProfile(token);
    } else {
      console.log('No token found, setting loading to false');
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      console.log('Fetching user profile...');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('User profile response:', response.data);
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('Attempting login with:', { email });
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);

      const { token, user } = response.data;
      console.log('Setting user in context:', user);
      localStorage.setItem('token', token);
      setUser(user);
    } catch (err: any) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out user:', user);
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, useUser }; 