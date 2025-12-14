// src/App.js
import { Routes, Route } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

import NavbarHeader from './components/NavbarHeader';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import OrdersPage from './pages/OrdersPage';
import PoliciesPage from './pages/PoliciesPage';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <div className="app-root">
      <NavbarHeader />

      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Shop (all, men, women, category) */}
 <Route path="/shop" element={<ShopPage />} />

<Route path="/shop/:genderSlug" element={<ShopPage />} />
<Route path="/shop/:genderSlug/:categorySlug" element={<ShopPage />} />

        {/* Static pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Cart / products */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Orders & policies */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
<Route path="/orders/:id" element={<OrderDetailsPage />} />
        {/* Password reset flow */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/96171659649"
        className="whatsapp-floating"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      <Footer />
    </div>
  );
}

export default App;
