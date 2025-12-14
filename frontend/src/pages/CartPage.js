// src/pages/CartPage.js
import React, { useState } from 'react';
import { Row, Col, Card, Button, Image, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authMessage, setAuthMessage] = useState('');

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return;
    updateQuantity(item.key, item.quantity - 1);
  };

  const handleIncrease = (item) => {
    updateQuantity(item.key, item.quantity + 1);
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setAuthMessage('You need to login to be able to checkout.');
      return;
    }
    navigate('/checkout');
  };

  // EMPTY CART
  if (!items.length) {
    return (
      <div className="page-inner cart-page">
        <h2 className="cart-title mb-2">Basket</h2>
        <p className="cart-empty-text">Your cart is empty.</p>
        <Button as={Link} to="/shop" className="btn-lotus mt-3">
          Continue shopping
        </Button>
      </div>
    );
  }

  // CART WITH ITEMS
  return (
    <div className="page-inner cart-page">
      <Row className="gy-4">
        {/* ITEMS LIST – mobile: awalan, desktop: 3al yasaar */}
        <Col
          xs={{ span: 12, order: 1 }}
          md={{ span: 8, order: 1 }}
        >
          <div className="d-flex align-items-baseline justify-content-between mb-3">
            <h2 className="cart-title mb-0">Basket</h2>
            <span className="cart-items-count">
              {items.length} item{items.length > 1 ? 's' : ''}
            </span>
          </div>

          {items.map((item) => (
            <Card className="mb-3 cart-item-card" key={item.key}>
              <Card.Body>
                <Row className="align-items-center">
                  {/* Image */}
                  <Col xs={4} md={3}>
                    <div className="cart-item-image-wrapper">
                      <Image
                        src={item.product.images?.[0] || '/placeholder.png'}
                        alt={item.product.name}
                        fluid
                        rounded
                      />
                    </div>
                  </Col>

                  {/* Info */}
                  <Col xs={8} md={5} className="mt-2 mt-md-0">
                    <Card.Title className="mb-1 cart-item-title">
                      {item.product.name}
                    </Card.Title>
                    <Card.Text className="small mb-1 cart-item-meta">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && (
                        <span>{item.color && ' • '}Size: {item.size}</span>
                      )}
                    </Card.Text>
                    <Button
                      variant="link"
                      className="p-0 mt-1 cart-remove-btn"
                      onClick={() => removeFromCart(item.key)}
                    >
                      Remove
                    </Button>
                  </Col>

                  {/* Qty + price */}
                  <Col xs={12} md={4} className="mt-3 mt-md-0 text-md-end">
                    <div className="cart-qty-wrapper mb-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleDecrease(item)}
                      >
                        −
                      </Button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="cart-item-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="cart-item-price-each">
                      (${item.product.price.toFixed(2)} each)
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <div className="mt-1">
            <Button
              variant="outline-light"
              size="sm"
              onClick={clearCart}
              className="cart-clear-btn"
            >
              Clear basket
            </Button>
          </div>
        </Col>

        {/* SUMMARY – mobile: t2ani, desktop: 3al yameen */}
        <Col 
          xs={{ span: 12, order: 2 }}
          md={{ span: 4, order: 2 }}
        >
          <Card className="cart-summary-card" style={{ marginTop: '15%' }} >
            <Card.Body>
              <Card.Title className="mb-3">Order summary</Card.Title>

              <div className="d-flex justify-content-between mb-1">
                <span>Sub-total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Button
                className="w-100 btn-lotus mb-2"
                onClick={handleCheckoutClick}
              >
                CHECKOUT NOW
              </Button>

              {authMessage && (
                <Alert variant="warning" className="mt-1 mb-2 py-2 small">
                  {authMessage}{' '}
                  <Link to="/login" className="alert-link">
                    Login
                  </Link>{' '}
                  to continue.
                </Alert>
              )}

              <Button
                as={Link}
                to="/shop"
                variant="link"
                className="w-100 cart-continue-link"
              >
                Continue shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
