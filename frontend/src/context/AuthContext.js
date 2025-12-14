// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ⬅️ جرّب نقرأ اليوزر من localStorage أول ما يشتغل الكونتكست
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (data) => {
    // data = { token, user: { id, name, email, role } }
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // 👈 مهم
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 👈 نمحيه كمان
  };

  // Google login
  const loginWithGoogle = async (credential) => {
    console.log('credential from Google:', credential); // للتأكد بس
    const res = await api.post('/auth/google-login', { credential });
    login(res.data); // نفس login العادي
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
