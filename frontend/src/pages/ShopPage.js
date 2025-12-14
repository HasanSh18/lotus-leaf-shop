// src/pages/ShopPage.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import FiltersBar from '../components/FiltersBar';

// gender → slug
const genderToSlug = (gender) => {
  if (gender === 'Men') return 'men';
  if (gender === 'Women') return 'women';
  if (gender === 'Unisex') return 'unisex';
  return '';
};

// category → slug
const getCategorySlug = (category) => {
  switch (category) {
    case 'Hoodie unisex':
      return 'hoodies';
    case 'Oversized unisex':
      return 'oversized';
    case 'Pants men':
    case 'Pants women':
      return 'sweatpants';
    case 'Sweater unisex':
      return 'basics';
    case 'Special set':
      return 'special-offers';
    default:
      return '';
  }
};

// category → implied gender
const categoryToGender = (category) => {
  switch (category) {
    case 'Pants men':
      return 'Men';
    case 'Pants women':
      return 'Women';
    case 'Sweater unisex':
      return 'Unisex';
    default:
      return '';
  }
};

// read filters from URL the first time
const initialFiltersFromRoute = (genderSlug, categorySlug) => {
  let gender = '';
  let category = '';

  if (genderSlug === 'men') gender = 'Men';
  if (genderSlug === 'women') gender = 'Women';
  if (genderSlug === 'unisex') gender = 'Unisex';

  if (genderSlug === 'special-offers') {
    category = 'Special set';
  }

  if (categorySlug) {
    if (categorySlug === 'hoodies') {
      category = 'Hoodie unisex';
    } else if (categorySlug === 'oversized') {
      category = 'Oversized unisex';
    } else if (categorySlug === 'sweatpants') {
      category = gender === 'Women' ? 'Pants women' : 'Pants men';
    } else if (categorySlug === 'basics') {
      category = 'Sweater unisex';
      if (!gender) gender = 'Unisex';
    } else if (categorySlug === 'special-offers') {
      category = 'Special set';
    }
  }

  return {
    q: '',
    gender,
    category,
    color: '',
    size: '',
    minPrice: '',
    maxPrice: '',
  };
};

const ShopPage = () => {
  const { genderSlug, categorySlug } = useParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(() =>
    initialFiltersFromRoute(genderSlug, categorySlug)
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true); // toggle for mobile

  // sync with URL
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...initialFiltersFromRoute(genderSlug, categorySlug),
    }));
  }, [genderSlug, categorySlug]);

  // fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/products', { params: filters });
        setProducts(res.data);
      } catch (err) {
        setError('Could not load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // لما يغيّر الـ gender
  const handleGenderChange = (newGender) => {
    setFilters((prev) => {
      const updated = { ...prev, gender: newGender };

      const catSlug = getCategorySlug(updated.category);
      const genSlug = genderToSlug(updated.gender);

      // SPECIAL OFFERS
      if (catSlug === 'special-offers') {
        if (!genSlug) {
          navigate('/shop/special-offers'); // كل الأوفرز
        } else {
          navigate(`/shop/${genSlug}/special-offers`); // men / women / unisex
        }
      }
      // باقي الكاتيجوريز
      else if (genSlug && catSlug) {
        navigate(`/shop/${genSlug}/${catSlug}`);
      } else if (genSlug) {
        navigate(`/shop/${genSlug}`);
      } else {
        navigate('/shop');
      }

      return updated;
    });
  };

  // لما يغيّر الـ category
  const handleCategoryChange = (newCategory) => {
    setFilters((prev) => {
      let updated = { ...prev, category: newCategory };

      const impliedGender = categoryToGender(newCategory);
      if (impliedGender) {
        updated.gender = impliedGender;
      }

      const catSlug = getCategorySlug(updated.category);
      const genSlug = genderToSlug(updated.gender);

      // SPECIAL OFFERS
      if (catSlug === 'special-offers') {
        if (!genSlug) {
          navigate('/shop/special-offers');
        } else {
          navigate(`/shop/${genSlug}/special-offers`);
        }
      }
      // باقي الكاتيجوريز
      else if (genSlug && catSlug) {
        navigate(`/shop/${genSlug}/${catSlug}`);
      } else if (genSlug) {
        navigate(`/shop/${genSlug}`);
      } else {
        navigate('/shop');
      }

      return updated;
    });
  };

  // toggle button click (mobile)
  const handleToggleFilters = () => {
    setFiltersOpen((prev) => {
      const next = !prev;

      if (!next) {
        const el = document.getElementById('shop-products-list');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      return next;
    });
  };

  // title حسب الجيندر + special offers
  let title = 'Shop all products';

  if (categorySlug === 'special-offers') {
    if (!genderSlug || genderSlug === 'special-offers') {
      title = 'Special Offers';
    } else if (genderSlug === 'men') {
      title = 'Men – Special Offers';
    } else if (genderSlug === 'women') {
      title = 'Women – Special Offers';
    } else if (genderSlug === 'unisex') {
      title = 'Unisex – Special Offers';
    }
  } else {
    if (genderSlug === 'men') title = 'Shop Men';
    else if (genderSlug === 'women') title = 'Shop Women';
    else if (genderSlug === 'unisex') title = 'Shop Unisex';
    else if (genderSlug === 'special-offers') title = 'Special Offers';
  }

  return (
    <div className="page-inner shop-page">
      {/* sticky header with title + filter icon */}
      <div className="shop-page-header">
        <h2 className="mb-0 shop-page-title">{title}</h2>

        {/* يظهر بس على الموبايل عن طريق الـ CSS */}
        <button
          type="button"
          className="shop-filters-toggle-btn"
          onClick={handleToggleFilters}
          aria-label="Toggle filters"
        >
          <span className="shop-filters-toggle-icon" />
        </button>
      </div>

      {/* filters block – يختفي على الموبايل إذا filtersOpen = false */}
      <div className={`shop-filters ${filtersOpen ? 'is-open' : 'is-closed'}`}>
        <FiltersBar
          filters={filters}
          onChange={handleFiltersChange}
          onGenderChange={handleGenderChange}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* products list */}
      <div id="shop-products-list">
        <Row className="g-4">
          {products.map((p) => (
            <Col xs={6} md={4} key={p._id}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>

        {!loading && !products.length && <p>No products found.</p>}
      </div>
    </div>
  ); 
};

export default ShopPage;
