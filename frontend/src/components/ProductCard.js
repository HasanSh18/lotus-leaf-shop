// src/components/ProductCard.js
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const firstImage =
    product.images?.[0] ||
    'https://via.placeholder.com/400x400?text=Lotus+Leaf';

  const isSoldOut = product.stock <= 0;

  const shortDesc =
    (product.description || '').length > 80
      ? product.description.slice(0, 80) + '…'
      : product.description;

  return (
    <Card className="product-card h-100 position-relative">
      {/* Sold out badge */}
      {isSoldOut && (
        <Badge
          bg="danger"
          className="position-absolute"
          style={{ top: 10, left: 10, zIndex: 1 }}
        >
          Sold out
        </Badge>
      )}

      {/* 👇 image wrapper so the full picture appears */}
      <Link to={`/product/${product._id}`}>
        <div className="product-card-img-wrap">
          <Card.Img variant="top" src={firstImage} alt={product.name} />
        </div>
      </Link>

      {/* Body */}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="product-tag">
            {product.gender} · {product.category}
          </div>
          <div className="product-tag">${product.price}</div>
        </div>

        <Card.Title className="mb-2">{product.name}</Card.Title>

        {shortDesc && (
          <Card.Text className="small text-muted">{shortDesc}</Card.Text>
        )}

        <div className="small mb-2">
          {isSoldOut ? (
            <span className="text-danger">Sold out</span>
          ) : (
            <span className="text-success">
              In stock{product.stock > 0 && `: ${product.stock}`}
            </span>
          )}
        </div>

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
