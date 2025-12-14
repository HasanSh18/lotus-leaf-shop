// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || '';

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: initialEmail,
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.post('/auth/verify-reset-code', {
        email: form.email,
        code: form.code,
      });
      setMessage(res.data.message || 'Code verified. Please choose a new password.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', {
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
      });
      setMessage(
        res.data.message ||
          'Password updated. You can now log in with your new password.'
      );
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password. Try again.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="mb-3">Reset password</h2>

        {message && <Alert variant="info">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {step === 1 && (
          <Form onSubmit={handleVerifyCode}>
            <Form.Control type="hidden" name="email" value={form.email} />

            <Form.Group className="mb-3">
              <Form.Label>Reset code</Form.Label>
              <Form.Control
                required
                name="code"
                value={form.code}
                onChange={handleChange}
                className="input-secure"
              />
            </Form.Group>

            <Button type="submit" className="btn-lotus">
              Verify code
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>New password</Form.Label>
              <Form.Control
                required
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="input-secure"
                minLength={8}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control
                required
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-secure"
              />
            </Form.Group>

            <Button type="submit" className="btn-lotus">
              Change password
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
