// src/components/ProductCard.js
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const firstImage =
    product.images?.[0] ||
    'https://via.placeholder.com/400x400?text=Lotus+Leaf';

  const isSoldOut =
    typeof product.stock === 'number' && product.stock <= 0;

  const shortDesc =
    (product.description || '').length > 80
      ? product.description.slice(0, 80) + '…'
      : product.description || '';

  // 🔥 نفس منطق ال ProductPage
  const hasDiscount =
    typeof product.discountPrice === 'number' &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const displayPrice = hasDiscount
    ? product.discountPrice
    : product.price;

  return (
    <Card className="product-card h-100 position-relative">
      {/* Badge أعلى الصورة لو Sold out */}
      {isSoldOut && (
        <Badge
          bg="danger"
          className="position-absolute"
          style={{ top: 10, left: 10, zIndex: 1 }}
        >
          Sold out
        </Badge>
      )}

      <Link to={`/product/${product._id}`}>
        <Card.Img variant="top" src={firstImage} alt={product.name} />
      </Link>

      {/* body flex column */}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="product-tag">
            {product.gender} · {product.category}
          </div>

          {/* 👇 هون منعرض السعر مع الديسكاونت لو موجود */}
          <div className="product-price-wrap">
            {hasDiscount ? (
              <>
                <span className="product-price-old">${product.price}</span>
                <span className="product-price-new">${displayPrice}</span>
              </>
            ) : (
              <span className="product-price-regular">
                ${product.price}
              </span>
            )}
          </div>
        </div>

        <Card.Title className="mb-2">{product.name}</Card.Title>

        {shortDesc && (
          <Card.Text className="small text-muted">
            {shortDesc}
          </Card.Text>
        )}

        {/* حالة الستوك */}
        <div className="small mb-2">
          {isSoldOut ? (
            <span className="text-danger">Sold out</span>
          ) : (
            <span className="text-success">
              In stock{product.stock > 0 && `: ${product.stock}`}
            </span>
          )}
        </div>

        {/* الزر مع mt-auto عشان دايمًا يطلع تحت */}
        <Button
          as={Link}
          to={`/product/${product._id}`}
          className="btn-lotus w-100 mt-auto"
          disabled={isSoldOut}
        >
          {isSoldOut ? 'Sold out' : 'View details'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
