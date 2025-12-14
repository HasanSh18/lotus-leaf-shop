// src/components/NavbarHeader.jsx
import React, { useState } from 'react';
import { Navbar, Container, Nav, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NavbarHeader = () => {
  const { items, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [shopOpen, setShopOpen] = useState(false);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    clearCart();
    logout();
    navigate('/');
  };

  const displayName = user?.name || user?.email || '';

  return (
    <Navbar expand="lg" className="navbar-lotus" variant="dark">
      <Container className="navbar-inner">
        <Navbar.Brand as={Link} to="/" className="navbar-brand-text">
          LOTUS LEAF
        </Navbar.Brand>

        <Navbar.Brand as={Link} to="/" className="navbar-brand-center">
          <img src="/logo-mark.png" alt="Lotus Leaf" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          {/* LEFT LINKS */}
          <Nav className="navbar-main">
            {/* SHOP DROPDOWN */}
            <NavDropdown
              id="shop-dropdown"
              className="navbar-shop-dropdown"
              show={shopOpen}
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
              onToggle={(next) => setShopOpen(next)}
              title={
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/shop');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Shop
                </span>
              }
            >
              <NavDropdown.Item as={Link} to="/shop/men">
                Men
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/shop/women">
                Women
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/shop/unisex">
                Unisex / Basics
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/shop/special-offers">
                Special offers
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
          </Nav>

          {/* RIGHT LINKS */}
          <Nav className="navbar-right">
        
{user && user.role === 'admin' && (
  <Nav.Link as={Link} to="/admin" className="navbar-admin">
    Admin
  </Nav.Link>
)}
            {user ? (
              <>
                {displayName && (
                  <Nav.Link disabled className="navbar-user">
                    {displayName}
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/orders">
                  My Orders
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign up
                </Nav.Link>
              </>
            )}

            <Nav.Link as={Link} to="/cart">
              Cart{' '}
              {cartCount > 0 && (
                <Badge bg="light" text="dark">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarHeader;
