import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token and user exist in storage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user details", err);
        // Clear corrupt storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Handler for user registration
  const register = async (username, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
      });

      if (data.success) {
        const userData = { _id: data._id, username: data.username, email: data.email };
        setUser(userData);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
      setLoading(false);
      return false;
    }
  };

  // Handler for user login
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      if (data.success) {
        const userData = { _id: data._id, username: data.username, email: data.email };
        setUser(userData);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
      return false;
    }
  };

  // Handler for user logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
