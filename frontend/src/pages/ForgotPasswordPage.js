import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // للتحقق من حالة التحميل
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true); // تفعيل التحميل عند إرسال البيانات

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(email)) {
      setLoading(false);
      return setError('Please enter a valid email address');
    }

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'If that email exists, a reset code was sent.');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // إيقاف التحميل بعد معالجة الطلب
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="mb-3">Forgot password</h2>

        {message && <Alert variant="info">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-secure"
            />
          </Form.Group>

          <Button type="submit" className="btn-lotus" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'SEND RESET CODE'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
