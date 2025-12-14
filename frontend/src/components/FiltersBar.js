// src/components/FiltersBar.js
import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import SizeSelect from './SizeSelect'; // 👈 جديد

const FiltersBar = ({ filters, onChange, onGenderChange, onCategoryChange }) => {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };

    if (onChange) onChange(newFilters);

    if (name === 'gender' && onGenderChange) {
      onGenderChange(value);
    }

    if (name === 'category' && onCategoryChange) {
      onCategoryChange(value);
    }
  };

  // 👇 handler خاص للـ SizeSelect
  const handleSizeChange = (val) => {
    const newFilters = { ...filters, size: val || '' };
    if (onChange) onChange(newFilters);
  };

  return (
    <Form className="mb-4">
      <Row className="g-2">
        <Col md={3}>
          <Form.Control
            placeholder="Search by name"
            name="q"
            value={filters.q || ''}
            onChange={handleFieldChange}
          />
        </Col>

        <Col md={2}>
          <Form.Select
            name="gender"
            value={filters.gender || ''}
            onChange={handleFieldChange}
          >
            <option value="">Gender</option>
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select
            name="category"
            value={filters.category || ''}
            onChange={handleFieldChange}
          >
            <option value="">Category</option>
            <option value="Hoodie unisex">Hoodie (Unisex)</option>
            <option value="Oversized unisex">Oversized T-shirt (Unisex)</option>
            <option value="Sweater unisex">Sweater (Unisex)</option>
            <option value="Pants men">Sweatpants (M)</option>
            <option value="Pants women">Sweatpants (W)</option>
            <option value="Special set">Special offer sets</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Control
            placeholder="Color"
            name="color"
            value={filters.color || ''}
            onChange={handleFieldChange}
          />
        </Col>

        {/* 👇 هون الـ dropdown الجديد تبع Size */}
        <Col md={1}>
          <SizeSelect
            value={filters.size || ''}
            onChange={handleSizeChange}
          />
        </Col>

        <Col md={2}>
          <Row className="g-1">
            <Col>
              <Form.Control
                placeholder="Min $"
                name="minPrice"
                type="number"
                value={filters.minPrice || ''}
                onChange={handleFieldChange}
              />
            </Col>
            <Col>
              <Form.Control
                placeholder="Max $"
                name="maxPrice"
                type="number"
                value={filters.maxPrice || ''}
                onChange={handleFieldChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltersBar;
