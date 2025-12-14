// src/pages/OrderDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spinner, Alert, Table, Button } from 'react-bootstrap';
import api from '../api';

const OrderDetailsPage = () => {
  // short id من /orders/:id → آخر 8 chars
  const { id: shortId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/orders/by-short/${shortId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError('Could not load this order.');
      } finally {
        setLoading(false);
      }
    };
    if (shortId) load();
  }, [shortId]);

  if (loading) {
    return (
      <div className="orders-page order-details-page">
        <Spinner animation="border" size="sm" /> Loading…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="orders-page order-details-page">
        <Alert variant="danger">{error || 'Order not found.'}</Alert>
        <Button as={Link} to="/orders" variant="link" className="p-0 mt-2">
          ← Back to orders
        </Button>
      </div>
    );
  }

  const shortDisplayId = order._id.slice(-8);

  return (
    <div className="orders-page order-details-page">
      <Card className="orders-card order-details-card">
        <Card.Body>
          {/* HEADER */}
          <div className="order-details-header d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="page-title mb-1">Order #{shortDisplayId}</h2>
              <div className="order-details-subtitle">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <Button as={Link} to="/orders" variant="link" className="p-0">
              ← Back to orders
            </Button>
          </div>

          {/* META INFO */}
          <div className="order-details-meta mb-3">
            <div className="order-details-meta-item">
              <span className="label">Status</span>
              <span className="value text-capitalize">{order.status}</span>
            </div>
            <div className="order-details-meta-item">
              <span className="label">Paid</span>
              <span className="value">{order.isPaid ? 'Yes' : 'No'}</span>
            </div>
            <div className="order-details-meta-item">
              <span className="label">Total</span>
              <span className="value">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <Table
            responsive
            size="sm"
            className="mb-0 order-details-table"
          >
            <thead>
              <tr>
                <th>Product</th>
                <th>Options</th>
                <th className="text-end">Qty</th>
                <th className="text-end">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id}>
                  <td>{item.product?.name || item.name}</td>
                  <td className="small text-muted">
                    {item.color && <>Color: {item.color}</>}
                    {item.size && (
                      <>
                        {item.color && ' • '}Size: {item.size}
                      </>
                    )}
                  </td>
                  <td className="text-end">{item.quantity}</td>
                  <td className="text-end">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="text-end fw-bold">
                  Total
                </td>
                <td className="text-end fw-bold">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
