// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      // backend لازم يرجّع { token, user }
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      await loginWithGoogle(response.credential);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Google login failed');
    }
  };

  useEffect(() => {
    if (!clientId) {
      console.warn('REACT_APP_GOOGLE_CLIENT_ID is missing');
      return;
    }

    const initializeGoogle = () => {
      /* global google */
      if (!window.google || !window.google.accounts) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
        }
      );
    };

    // لو السكريبت محمّل أصلاً (مثلاً من صفحة تانية)
    if (window.google && window.google.accounts) {
      initializeGoogle();
      return;
    }

    // غير هيك: نزّل السكريبت ديناميكياً
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    // cleanup (اختياري)
    return () => {
      // ما في cleanup إجباري هون، بس منتركها لو حبّينا نضيف لاحقاً
    };
  }, [clientId]);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2>Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" className="btn-lotus">
            LOGIN
          </Button>

          <div style={{ marginTop: '10px' }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div style={{ marginTop: '5px' }}>
            Don’t have an account? <Link to="/signup">Register</Link>
          </div>
        </Form>

        <div style={{ marginTop: '20px' }}>
          <div id="googleSignInDiv"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
