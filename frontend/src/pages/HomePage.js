// src/pages/HomePage.js
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      {/* HERO – full width */}
      <section className="home-section home-section-full">
        <div className="hero-banner">
          <div className="hero-text">
            <p className="product-tag mb-2">ESTABLISHED • 2025 • BEIRUT</p>
            <h1 className="mb-3">LOTUS LEAF</h1>
            <p className="mb-4">
              Cozy hoodies, unisex sweater and sweatpants in six signature
              colors: black, navy blue, burgundy, green, baby blue and aqua.
              Mix and match or grab our special men/women sets for a better
              price.
            </p>
            <Button as={Link} to="/shop" className="btn-lotus">
              SHOP THE COLLECTION
            </Button>
          </div>
        </div>
      </section>

      {/* BIG MEN / WOMEN TILES – full width */}
      <section className="home-section home-section-full home-category-grid">
        <Row className="g-4">
          <Col md={6}>
            <Link to="/shop/men" className="category-tile">
              {/* صورة الرجال من public/men.jpeg */}
              <img src="/men.jpeg" alt="Shop Men" />
              <div className="tile-overlay">
                <span className="tile-subtitle">FOR HIM</span>
                <span className="tile-title">SHOP MEN</span>
                <p className="mt-2 small mb-0">
                  Hoodies, Sweater and sweatpants in our signature colors.
                </p>
              </div>
            </Link>
          </Col>

          <Col md={6}>
            <Link to="/shop/women" className="category-tile">
              {/* صورة النساء من public/Women.jpeg */}
              <img src="/Women.jpeg" alt="Shop Women" />
              <div className="tile-overlay">
                <span className="tile-subtitle">FOR HER</span>
                <span className="tile-title">SHOP WOMEN</span>
                <p className="mt-2 small mb-0">
                  Coordinated sets and everyday comfort pieces.
                </p>
              </div>
            </Link>
          </Col>
        </Row>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="home-section home-section-full popular-section">
        <div className="popular-section-inner">
          <h3 className="popular-title text-center mb-4">
            SHOP OUR POPULAR CATEGORIES
          </h3>

          <Row className="g-4 popular-grid">
            {/* 1 – Hoodie (Unisex) */}
            <Col xs={12} sm={6} lg={4} className="mb-3">
              <div className="popular-card">
                {/* hoodie image */}
                <img src="/hoodies.jpeg" alt="Unisex hoodies" />
                <div className="popular-card-body">
                  <h6 className="mb-1">Hoodie (Unisex)</h6>
                  <Button
                    as={Link}
                    to="/shop/unisex/hoodies"
                    variant="link"
                    className="popular-link"
                    style={{ 
    textDecoration: 'none',
                      color: '#f4e0a3',
    border: 'solid'
  }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Col>

            {/* 2 – Oversized T-shirt (Unisex) */}
            <Col xs={12} sm={6} lg={4} className="mb-3">
              <div className="popular-card">
                {/* T-shirt image */}
                <img src="/Tshirt.jpeg" alt="Oversized T-shirt (Unisex)" />
                <div className="popular-card-body">
                  <h6 className="mb-1">Oversized T-shirt (Unisex)</h6>
                  <Button
                    as={Link}
                    to="/shop/unisex/oversized"
                    variant="link"
                    className="popular-link"
                    style={{ 
    textDecoration: 'none',
                      color: '#f4e0a3',
    border: 'solid'
  }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Col>

            {/* 3 – Sweater (Unisex) – استعملنا نفس صورة الـ hoodies لعدم وجود صورة خاصة */}
            <Col xs={12} sm={6} lg={4} className="mb-3">
              <div className="popular-card">
                <img src="/hoodies.jpeg" alt="Sweater (Unisex)" />
                <div className="popular-card-body">
                  <h6 className="mb-1">Sweater (Unisex)</h6>
                  <Button
                    as={Link}
                    to="/shop/unisex/basics"
                    variant="link"
                    className="popular-link"
                    style={{ 
    textDecoration: 'none',
                      color: '#f4e0a3',
    border: 'solid'
  }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Col>

            {/* 4 – Sweatpants (M) */}
            <Col xs={12} sm={6} lg={4} className="mb-3">
              <div className="popular-card">
                <img
                  src="/Sweatpantsmen.jpeg"
                  alt="Sweatpants (Men)"
                />
                <div className="popular-card-body">
                  <h6 className="mb-1">Sweatpants (M)</h6>
                  <Button
                    as={Link}
                    to="/shop/men/sweatpants"
                    variant="link"
                    className="popular-link"
                    style={{ 
    textDecoration: 'none',
                      color: '#f4e0a3',
    border: 'solid'
  }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Col>

            {/* 5 – Sweatpants (W) */}
            <Col xs={12} sm={6} lg={4} className="mb-3">
              <div className="popular-card">
                <img
                  src="/womenpants.jpeg"
                  alt="Sweatpants (Women)"
                />
                <div className="popular-card-body">
                  <h6 className="mb-1">Sweatpants (W)</h6>
                  <Button
                    as={Link}
                    to="/shop/women/sweatpants"
                    variant="link"
                    className="popular-link"
                    style={{ 
    textDecoration: 'none',
                      color: '#f4e0a3',
    border: 'solid'
  }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default HomePage;
