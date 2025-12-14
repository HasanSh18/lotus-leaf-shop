// src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();           // 👈 نجيب اليوزر
  const navigate = useNavigate();      // 👈 للـ redirect

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    country: 'Lebanon',
    notes: '',
    paymentMethod: 'wish-number',
    defaultAddress: true,
  });

  const [message, setMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // 🔒 لو مش عامل login → رجّعو على صفحة الـ Login
  // ولو عامل login منعبّي الاسم والإيميل تلقائيًا
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name || '',
      email: prev.email || user.email || '',
    }));
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items.length) {
      setMessage('Cart is empty.');
      return;
    }

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          price: i.product.price,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          addressLine: form.addressLine.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          notes: form.notes.trim(),
          defaultAddress: form.defaultAddress,
        },
        paymentMethod: form.paymentMethod,
      };

      const res = await api.post('/orders', payload);
      setMessage(
        'Order placed! We will contact you on WhatsApp or email to confirm payment.'
      );

      if (res.data && res.data.whatsappUrl) {
        setWhatsappUrl(res.data.whatsappUrl);
      }

      clearCart();
    } catch (err) {
      console.error(err);
      setMessage('Could not place order. Please try again.');
    }
  };

  return (
    <>
      <h2 className="mb-4">Checkout</h2>
      {message && <Alert variant="info" style={{ width: '330px' }}>{message}</Alert>}

      <Row className="g-4">
        {/* LEFT: Form card */}
        <Col lg={8}>
          <Form onSubmit={handleSubmit}>
            <div
              className="bg-light text-dark rounded-3 shadow-sm p-4"
              style={{ minHeight: 320 }}
            >
              <Row className="g-4">
                {/* Address details */}
                <Col md={6} className="border-end border-0 border-md-end">
                  <h5 className="mb-3 d-flex align-items-center">
                    <span>Address details</span>
                    <span className="ms-2" role="img" aria-label="Lebanon">
                      🇱🇧
                    </span>
                  </h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Full address</Form.Label>
                    <Form.Control
                      required
                      name="addressLine"
                      value={form.addressLine}
                      onChange={handleChange}
                      placeholder="e.g. Apartment 4, Building name, Street 3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional details</Form.Label>
                    <Form.Control
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Floor, landmark, special instructions…"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Zone / City</Form.Label>
                    <Form.Select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                    >
                      <option value="">Choose a zone…</option>
                      <option value="Beirut">Beirut</option>
                      <option value="Mount Lebanon">Mount Lebanon</option>
                      <option value="North Lebanon">North Lebanon</option>
                      <option value="South Lebanon">South Lebanon</option>
                      <option value="Bekaa">Bekaa</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Contact details */}
                <Col md={6}>
                  <h5 className="mb-3">Contact details</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      required
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile number (WhatsApp)</Form.Label>
                    <div className="d-flex">
                      <span
                        className="d-inline-flex align-items-center px-2 border rounded-start bg-white"
                        style={{ minWidth: 70, borderRight: 0 }}
                      >
                        🇱🇧 +961
                      </span>
                      <Form.Control
                        required
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="rounded-start-0"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      id="defaultAddressSwitch"
                      name="defaultAddress"
                      checked={form.defaultAddress}
                      onChange={handleChange}
                      className="me-2"
                    />
                    <Form.Label
                      htmlFor="defaultAddressSwitch"
                      className="mb-0"
                    >
                      Set this as your primary delivery address
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Payment section */}
              <h5 className="mb-3">Payment</h5>
              <Form.Group className="mb-3">
                <Form.Select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="wish-number">Whish number +96171659649</option>
                  <option value="whatsapp-pay">Send payment via WhatsApp</option>
                  <option value="cod">Cash on delivery</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  After placing the order you will receive instructions to pay using
                  your Wish number or directly on WhatsApp.
                </Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" className="btn-lotus px-4">
                  Place order (${subtotal})
                </Button>
              </div>
            </div>
          </Form>

          {whatsappUrl && (
            <div className="mt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success"
              >
                Open WhatsApp with order details
              </a>
            </div>
          )}
        </Col>

        {/* RIGHT: Order summary card */}
        <Col lg={4}>
          <div className="bg-light text-dark rounded-3 shadow-sm p-4">
            <h5 className="mb-3">Order summary</h5>

            {items.map((i) => (
              <div
                key={i.key}
                className="d-flex justify-content-between small mb-2"
              >
                <span>
                  {i.product.name} · {i.color}/{i.size} × {i.quantity}
                </span>
                <span>${(i.product.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between mb-1">
              <span>Sub-total</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Shipping</span>
              <span>Calculated at confirmation</span>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CheckoutPage;
