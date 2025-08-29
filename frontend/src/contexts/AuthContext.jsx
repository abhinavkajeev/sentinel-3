import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const savedCompany = localStorage.getItem('sentinel3_company');
    if (savedCompany && savedCompany !== 'undefined' && savedCompany !== '' && savedCompany !== null) {
      try {
        const parsed = JSON.parse(savedCompany);
        // Check for required fields
        if (parsed && parsed.companyId && parsed.companyPin) {
          setCompany(parsed);
        } else {
          setCompany(null);
          localStorage.removeItem('sentinel3_company');
        }
      } catch (err) {
        console.error('Failed to parse saved company data:', err);
        setCompany(null);
        localStorage.removeItem('sentinel3_company');
      }
    } else {
      setCompany(null);
      localStorage.removeItem('sentinel3_company');
    }
    setLoading(false);
  }, []);

  const login = async (companyPin, password) => {
    try {
      setError(null);
      const response = await api.loginCompany({ companyPin, password });
      if (response.ok) {
        const companyData = response.company;
        setCompany(companyData);
        localStorage.setItem('sentinel3_company', JSON.stringify(companyData));
        // Return companyPin for consistency with registration
        return { success: true, companyPin: companyPin };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (companyData) => {
    try {
      setError(null);
      const response = await api.registerCompany(companyData);
      
      if (response.ok) {
        const company = response.company;
        setCompany(company);
        localStorage.setItem('sentinel3_company', JSON.stringify(company));
        return { success: true, company };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setCompany(null);
    setError(null);
    localStorage.removeItem('sentinel3_company');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    company,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!company,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
