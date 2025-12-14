// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // منعمل حساب جديد
      await api.post('/auth/register', form);

      // 👈 بعد ما ينجح الـ register، روح ع صفحة الـ Login
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="mb-4">Create account</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-secure"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-secure"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-secure"
              minLength={8}
              placeholder="At least 8 characters, uppercase, lowercase and a number"
            />
          </Form.Group>

          <Button type="submit" className="btn-lotus" disabled={loading}>
            {loading ? 'Signing up…' : 'Sign up'}
          </Button>
        </Form>

        <p className="mt-3 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
