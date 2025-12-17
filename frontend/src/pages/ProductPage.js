// src/pages/ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import api from '../api';
import { useCart } from '../context/CartContext';

// helper برا الكومبوننت
const getVariantStock = (product, chosenColor, chosenSize) => {
  if (!product) return null;
  if (!Array.isArray(product.variants) || !product.variants.length) return null;

  const v = product.variants.find(
    (variant) => variant.color === chosenColor && variant.size === chosenSize
  );
  if (!v) return null;
  return typeof v.stock === 'number' ? v.stock : null;
};

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 1) fetch المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await api.get(`/products/${id}`);
        const p = res.data;

        setProduct(p);

        if (Array.isArray(p.variants) && p.variants.length > 0) {
          setColor(p.variants[0].color || '');
          setSize(p.variants[0].size || '');
        } else {
          setColor(p.colors?.[0] || '');
          setSize(p.sizes?.[0] || '');
        }

        setActiveImageIndex(0);
        setQuantity(1);
      } catch (err) {
        console.error(err);
        setError('Could not load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 2) مشتقّات الـ stock
  const variantStock = getVariantStock(product, color, size);

  const totalVariantsStock =
    product && Array.isArray(product.variants) && product.variants.length
      ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : null;

  // هيدا هو الـ stock الكلي يلي منعرضو “In stock: X”
  const globalStock =
    typeof totalVariantsStock === 'number'
      ? totalVariantsStock
      : typeof product?.stock === 'number'
      ? product.stock
      : 0;

  const isAllSoldOut = !globalStock || globalStock <= 0; // لكل المنتج

  // هيدا للـ color/size الحالي
  const effectiveMax =
    typeof variantStock === 'number'
      ? variantStock
      : typeof globalStock === 'number'
      ? globalStock
      : 0;

  const isCurrentVariantSoldOut = !effectiveMax || effectiveMax <= 0;
  const maxQty = isCurrentVariantSoldOut ? 0 : effectiveMax;

  // 3) نزبط الكمية حسب الماكس (بس ما منغيّر الديزاين)
  useEffect(() => {
    const max = effectiveMax;

    if (max <= 0) {
      setQuantity(1); // الـ input أصلاً رح يكون disabled لما يخلص
      return;
    }

    setQuantity((prev) => {
      const q = Number(prev) || 1;
      return q > max ? max : q;
    });
  }, [color, size, effectiveMax, product?._id]);

  // 4) early returns
  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <p>Not found</p>;

  const fallback = 'https://via.placeholder.com/500x500?text=Lotus+Leaf';
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [fallback];

  const mainImage = images[activeImageIndex] || fallback;

  const handleAddToCart = () => {
    const qty = Number(quantity) || 0;

    if (!color || !size || qty < 1) return;

    if (isCurrentVariantSoldOut) {
      // بس حماية إضافية
      alert('This item is sold out for this color/size.');
      return;
    }

    if (qty > effectiveMax) {
      alert(`Only ${effectiveMax} pieces available in this color/size.`);
      return;
    }

    addToCart(product, { color, size, quantity: qty });
    
  };

  return (
    <div className="product-page">
      <Row className="g-5 product-page-inner justify-content-center">
        {/* الصور – نفس الديزاين القديم  */}
        <Col lg={7} md={7} className="product-images-col d-flex justify-content-center">
          <div className="product-images-card">
            <div className="product-thumbs-column">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={
                    'product-thumb-btn' +
                    (idx === activeImageIndex ? ' active' : '')
                  }
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>

            <div className="product-main-image">
              <img src={mainImage} alt={product.name} />
            </div>
          </div>
        </Col>

        {/* التفاصيل – كمان نفس JSX القديم تقريباً */}
        <Col lg={5} md={5}>
          <p className="product-tag mb-1 text-uppercase">
            {product.gender} · {product.category}
          </p>
          <h2 className="mb-1">{product.name}</h2>
          <h4 className="mb-3">${product.price}</h4>

          <p className="mb-3">
            {isAllSoldOut ? (
              <span className="text-danger fw-semibold">Sold out</span>
            ) : (
              <span className="text-success fw-semibold">
                In stock{globalStock > 0 ? `: ${globalStock}` : ''}
              </span>
            )}
          </p>

          <p>{product.description}</p>

          <Form className="mt-3">
            {/* Color */}
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ maxWidth: 260 }}
              >
                {(product.colors || []).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Size */}
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                style={{ maxWidth: 260 }}
              >
                {(product.sizes || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Quantity – نفس الشكل، بس منعطّلها إذا الـ variant خلص */}
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={maxQty || 1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ maxWidth: 120 }}
                disabled={isCurrentVariantSoldOut}
              />
               <Form.Text
    className="text-muted"
    style={{
      display: 'block',                // يخليها تاخد سطر كامل
      minHeight: '1.2rem',             // ارتفاع ثابت تقريبا
      visibility:
        !isCurrentVariantSoldOut && effectiveMax > 0
          ? 'visible'
          : 'hidden',                   // مخفي بس بعدو حاجز المساحة
    }}
  >
    Max available: {effectiveMax > 0 ? effectiveMax : ''}
  </Form.Text>
            </Form.Group>

            {/* الزر دايماً "ADD TO CART" بس disabled لو خلص */}
            <Button
              className="btn-lotus"
              onClick={handleAddToCart}
              disabled={isCurrentVariantSoldOut}
            >
              ADD TO CART
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
