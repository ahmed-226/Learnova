import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });

      const { user: userData } = response.data;
      
      
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (firstName, lastName, email, password, role = 'STUDENT') => {
    try {
      const response = await api.post('/users/register', {
        firstName,
        lastName,
        email,
        password,
        role,
      });

      const { user: userData } = response.data;
      
      
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    api, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};