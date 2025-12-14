// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Table,
  Button,
  Form,
  Alert,
  Row,
  Col,
  Card,
  Modal, // 👈 NEW
} from 'react-bootstrap';
import api from '../api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // default form على Unisex + Hoodie unisex
  const [productForm, setProductForm] = useState({
    name: '',
    gender: 'Unisex',
    category: 'Hoodie unisex',
    description: '',
    price: 0,
    colors: '',
    sizes: '',
    images: '',
    stock: 0,
    // 🔥 textarea للـ variants
    variantsText: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // 👇 NEW: order details modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const load = async () => {
    try {
      const [pRes, oRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ]);
      setProducts(pRes.data);
      setOrders(oRes.data);
    } catch (err) {
      console.error(err);
      setError('Could not load data');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setProductForm({
      name: '',
      gender: 'Unisex',
      category: 'Hoodie unisex',
      description: '',
      price: 0,
      colors: '',
      sizes: '',
      images: '',
      stock: 0,
      variantsText: '',
    });
    setEditingId(null);
  };

  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const { variantsText, ...rest } = productForm;

      // colors / sizes / images arrays
      const colorsArray = (rest.colors || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const sizesArray = (rest.sizes || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const imagesArray = (rest.images || '')
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      // 🔥 parse variants من textarea
      let variants = [];
      if (variantsText && variantsText.trim().length > 0) {
        variants = variantsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [color, size, stockRaw] = line.split(',').map((x) => x.trim());
            return {
              color,
              size,
              stock: Number(stockRaw) || 0,
            };
          })
          .filter((v) => v.color && v.size);
      }

      const totalStockFromVariants = variants.length
        ? variants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : Number(rest.stock) || 0;

      const body = {
        ...rest,
        price: Number(rest.price),
        stock: totalStockFromVariants,
        colors: colorsArray,
        sizes: sizesArray,
        images: imagesArray,
        variants,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, body);
      } else {
        await api.post('/products', body);
      }

      resetForm();
      load();
    } catch (err) {
      console.error(err);
      setError('Could not save product');
    }
  };

  const handleEditProduct = (p) => {
    setEditingId(p._id);
    setProductForm({
      name: p.name || '',
      gender: p.gender || 'Unisex',
      category: p.category || 'Hoodie unisex',
      description: p.description || '',
      price: p.price ?? 0,
      stock: p.stock ?? 0,
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
      images: Array.isArray(p.images) ? p.images.join(', ') : '',
      // 🔥 حوّلنا الـ variants لنص textarea
      variantsText: Array.isArray(p.variants)
        ? p.variants
            .map((v) => `${v.color || ''}, ${v.size || ''}, ${v.stock ?? 0}`)
            .join('\n')
        : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      console.error(err);
      setError('Could not delete product');
    }
  };

  // status + isPaid
  const handleOrderStatus = async (id, status) => {
    try {
      const body = { status };
      if (status === 'delivered') {
        body.isPaid = true;
      }
      await api.put(`/orders/${id}`, body);
      load();
    } catch (err) {
      console.error(err);
      setError('Could not update order status');
    }
  };

  return (
    <div className="admin-page">
      <h2 className="page-title mb-3">Admin dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="products" className="mb-4 admin-tabs">
        {/* PRODUCTS TAB */}
        <Tab eventKey="products" title="Products">
          <Row className="gy-4">
            {/* FORM CARD */}
            <Col lg={5}>
              <Card className="admin-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>{editingId ? 'Edit product' : 'Create product'}</span>
                  {editingId && (
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  )}
                </Card.Header>
                <Card.Body>
                  <Form
                    onSubmit={handleCreateOrUpdateProduct}
                    className="admin-product-form"
                  >
                    <Row className="g-2">
                      {/* Name */}
                      <Col xs={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">Name</Form.Label>
                          <Form.Control
                            placeholder="Hoodie – Brown (Unisex)"
                            name="name"
                            value={productForm.name}
                            onChange={handleProductChange}
                            required
                          />
                        </Form.Group>
                        <Form.Text className="text-muted">
                          Product name
                        </Form.Text>
                      </Col>

                      {/* Gender */}
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={productForm.gender}
                            onChange={handleProductChange}
                          >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Category */}
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">Category</Form.Label>
                          <Form.Select
                            name="category"
                            value={productForm.category}
                            onChange={handleProductChange}
                          >
                            <option value="Hoodie unisex">Hoodie (Unisex)</option>
                            <option value="Oversized unisex">
                              Oversized T-shirt (Unisex)
                            </option>
                            <option value="Sweater unisex">
                              Sweater (Unisex)
                            </option>
                            <option value="Pants men">Sweatpants (Men)</option>
                            <option value="Pants women">Sweatpants (Women)</option>
                            <option value="Special set">Special offer set</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Description */}
                      <Col xs={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">
                            Description
                          </Form.Label>
                          <Form.Control
                            placeholder="Cozy fleece hoodie for everyday wear."
                            name="description"
                            value={productForm.description}
                            onChange={handleProductChange}
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>
                        <Form.Text className="text-muted">
                          Short description
                        </Form.Text>
                      </Col>

                      {/* Price & Stock (global) */}
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">
                            Price (USD)
                          </Form.Label>
                          <Form.Control
                            placeholder="30"
                            type="number"
                            min="0"
                            name="price"
                            value={productForm.price}
                            onChange={handleProductChange}
                          />
                        </Form.Group>
                        <Form.Text className="text-muted">Unit price</Form.Text>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">
                            Stock (total)
                          </Form.Label>
                          <Form.Control
                            placeholder="42"
                            type="number"
                            min="0"
                            name="stock"
                            value={productForm.stock}
                            onChange={handleProductChange}
                          />
                        </Form.Group>
                        <Form.Text className="text-muted">
                          Total stock (auto from variants if filled)
                        </Form.Text>
                      </Col>

                      {/* Colors */}
                      <Col xs={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">Colors</Form.Label>
                          <Form.Control
                            placeholder="black, brown, white"
                            name="colors"
                            value={productForm.colors}
                            onChange={handleProductChange}
                          />
                          <Form.Text className="text-muted">
                            Comma separated (e.g. black, white, navy)
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      {/* Sizes */}
                      <Col xs={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">Sizes</Form.Label>
                          <Form.Control
                            placeholder="S, M, L, XL"
                            name="sizes"
                            value={productForm.sizes}
                            onChange={handleProductChange}
                          />
                          <Form.Text className="text-muted">
                            Comma separated sizes
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      {/* 🔥 Variants textarea */}
                      <Col xs={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="admin-label">
                            Variants (color, size, stock)
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="variantsText"
                            placeholder={
                              'black, M, 5\nblack, L, 3\nwhite, M, 0'
                            }
                            value={productForm.variantsText}
                            onChange={handleProductChange}
                          />
                          <Form.Text className="text-muted">
                            One variant per line: color, size, stock. Total stock
                            will be calculated automatically.
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      {/* Images */}
                      <Col xs={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="admin-label">
                            Image URLs
                          </Form.Label>
                          <Form.Control
                            placeholder="https://.../front.jpg, https://.../back.jpg"
                            name="images"
                            value={productForm.images}
                            onChange={handleProductChange}
                          />
                          <Form.Text className="text-muted">
                            Public image URLs, comma separated
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button type="submit" className="btn-lotus w-100">
                      {editingId ? 'Update product' : 'Save product'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* PRODUCTS TABLE / CARDS */}
            <Col lg={7}>
              <Card className="admin-card">
                <Card.Header>
                  Products{' '}
                  <span className="text-muted">({products.length})</span>
                </Card.Header>
                <Card.Body className="p-0">
                  {/* Desktop / tablet: table */}
                  <div className="d-none d-md-block">
                    <div className="admin-table-wrapper">
                      <Table
                        striped
                        bordered
                        hover
                        variant="dark"
                        className="mb-0 admin-table"
                      >
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th style={{ width: '170px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p._id}>
                              <td>{p.name}</td>
                              <td>{p.gender}</td>
                              <td>{p.category}</td>
                              <td>${p.price}</td>
                              <td>{p.stock}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="outline-light"
                                  className="me-2"
                                  onClick={() => handleEditProduct(p)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeleteProduct(p._id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  {/* Mobile: cards */}
                  <div className="d-block d-md-none admin-products-mobile">
                    {products.map((p) => (
                      <Card
                        key={p._id}
                        className="admin-product-mobile-card mb-3"
                      >
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0 admin-product-mobile-name">
                              {p.name}
                            </h6>
                            <span className="admin-product-mobile-price">
                              ${p.price}
                            </span>
                          </div>

                          <div className="admin-product-mobile-row">
                            <span className="label">Gender</span>
                            <span className="value">{p.gender}</span>
                          </div>

                          <div className="admin-product-mobile-row">
                            <span className="label">Category</span>
                            <span className="value">{p.category}</span>
                          </div>

                          <div className="admin-product-mobile-row">
                            <span className="label">Stock</span>
                            <span className="value">{p.stock}</span>
                          </div>

                          <div className="admin-product-mobile-actions mt-3">
                            <Button
                              size="sm"
                              variant="outline-light"
                              className="me-2"
                              onClick={() => handleEditProduct(p)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteProduct(p._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* ORDERS TAB */}
        <Tab eventKey="orders" title="Orders">
          <Card className="admin-card">
            <Card.Header>
              Orders <span className="text-muted">({orders.length})</span>
            </Card.Header>
            <Card.Body className="p-0">
              {/* Desktop / tablet: table */}
              <div className="d-none d-md-block admin-orders-table">
                <div className="admin-table-wrapper">
                  <Table
                    responsive
                    bordered
                    hover
                    variant="dark"
                    className="mb-0 admin-table"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td className="admin-order-id" title={o._id}>
                            #{o._id.slice(-8)}
                          </td>
                          <td>{o.shippingAddress?.fullName}</td>
                          <td>${o.total}</td>
                          <td className="text-capitalize">{o.status}</td>
                          <td>
                            {/* NEW: view button */}
                            <Button
                              size="sm"
                              variant="outline-info"
                              className="me-1 mb-1"
                              onClick={() => {
                                setSelectedOrder(o);
                                setShowOrderModal(true);
                              }}
                            >
                              View
                            </Button>

                            <Button
                              size="sm"
                              className="me-1 mb-1 admin-order-status-btn"
                              onClick={() =>
                                handleOrderStatus(o._id, 'processing')
                              }
                            >
                              Processing
                            </Button>
                            <Button
                              size="sm"
                              className="me-1 mb-1 admin-order-status-btn"
                              onClick={() =>
                                handleOrderStatus(o._id, 'shipped')
                              }
                            >
                              Shipped
                            </Button>
                            <Button
                              size="sm"
                              className="mb-1 admin-order-status-btn"
                              onClick={() =>
                                handleOrderStatus(o._id, 'delivered')
                              }
                            >
                              Delivered
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Mobile: cards */}
              <div className="d-block d-md-none admin-orders-mobile">
                {orders.map((o) => (
                  <Card key={o._id} className="admin-order-mobile-card mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="admin-order-mobile-id">
                          #{o._id.slice(-8)}
                        </div>
                        <div className="admin-order-mobile-total">
                          ${o.total}
                        </div>
                      </div>

                      <div className="admin-order-mobile-row">
                        <span className="label">Customer</span>
                        <span className="value">
                          {o.shippingAddress?.fullName || '—'}
                        </span>
                      </div>

                      <div className="admin-order-mobile-row">
                        <span className="label">Status</span>
                        <span className="value text-capitalize">
                          {o.status}
                        </span>
                      </div>

                      <div className="admin-order-mobile-actions mt-2">
                        <Button
                          size="sm"
                          variant="outline-info"
                          className="me-2"
                          onClick={() => {
                            setSelectedOrder(o);
                            setShowOrderModal(true);
                          }}
                        >
                          View
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-light"
                          onClick={() =>
                            handleOrderStatus(o._id, 'processing')
                          }
                        >
                          Processing
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-light"
                          onClick={() =>
                            handleOrderStatus(o._id, 'shipped')
                          }
                        >
                          Shipped
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-light"
                          onClick={() =>
                            handleOrderStatus(o._id, 'delivered')
                          }
                        >
                          Delivered
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* ORDER DETAILS MODAL */}
      <Modal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Order #{selectedOrder?._id?.slice(-8)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <h6>Customer</h6>
              <p className="mb-2">
                <strong>{selectedOrder.shippingAddress?.fullName}</strong>
                <br />
                {selectedOrder.shippingAddress?.phone}
                <br />
                {selectedOrder.shippingAddress?.email}
                <br />
                {selectedOrder.shippingAddress?.addressLine},{' '}
                {selectedOrder.shippingAddress?.city},{' '}
                {selectedOrder.shippingAddress?.country}
              </p>

              <h6>Items</h6>
              <Table size="sm" bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Color / Size</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{it.name}</td>
                      <td>
                        {it.color} / {it.size}
                      </td>
                      <td>{it.quantity}</td>
                      <td>${it.price}</td>
                      <td>${(it.price * it.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="mt-3">
                <p className="mb-1">
                  <strong>Status:</strong>{' '}
                  <span className="text-capitalize">
                    {selectedOrder.status}
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Payment:</strong> {selectedOrder.paymentMethod}
                </p>
                <p className="mb-0">
                  <strong>Total:</strong> ${selectedOrder.total}
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOrderModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
