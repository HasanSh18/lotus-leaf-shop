// src/pages/OrdersPage.js
import React, { useEffect, useState } from 'react';
import { Table, Alert, Badge, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/orders');
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      } catch (err) {
        setError('Could not load orders.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase();

    if (s === 'delivered') return <Badge bg="success">Delivered</Badge>;
    if (s === 'shipped') return <Badge bg="info">Shipped</Badge>;
    if (s === 'processing') {
      return (
        <Badge bg="warning" text="dark">
          Processing
        </Badge>
      );
    }
    if (s === 'cancelled') return <Badge bg="danger">Cancelled</Badge>;
    return <Badge bg="secondary">Pending</Badge>;
  };

  const renderPaidBadge = (isPaid) =>
    isPaid ? (
      <Badge bg="success">Yes</Badge>
    ) : (
      <Badge bg="outline-light" className="orders-badge-unpaid">
        No
      </Badge>
    );

  return (
    <div className="orders-page">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

     {loading && (
  <div
    className="orders-loading d-flex justify-content-center align-items-center"
    style={{ minHeight: '40vh' }}
  >
    <Spinner animation="border" size="sm" className="me-2" />
    Loading your orders…
  </div>
)}

      {/* ما في أوردرز */}
      {!loading && !orders.length && !error && (
        <Card className="orders-card mt-2">
          <Card.Body className="text-center py-5">
            <h2 className="page-title mb-2">My orders</h2>
            <p className="mb-2 fw-semibold">
              You don&apos;t have any orders yet.
            </p>
            <p className="text-muted small mb-0">
              Once you place an order, it will appear here with its status.
            </p>
          </Card.Body>
        </Card>
      )}

      {/* في أوردرز */}
      {!loading && orders.length > 0 && (
        <>
          {/* 🖥️ Desktop / Tablet */}
          <Card className="orders-card d-none d-md-block">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h2 className="page-title mb-1">My orders</h2>
                </div>
                <span className="orders-count-badge">
                  {orders.length} order{orders.length > 1 ? 's' : ''}
                </span>
              </div>

              <Table
                responsive
                hover
                size="sm"
                className="mb-0 orders-table"
              >
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th className="text-end">Total</th>
                    <th>Status</th>
                    <th>Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const shortId = o._id.slice(-8);
                    return (
                      <tr key={o._id}>
                        <td>
                          <Link
                            to={`/orders/${shortId}`}
                            className="orders-id-link"
                            title={o._id}
                          >
                            #{shortId}
                          </Link>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="text-end">
                          <span className="orders-total">${o.total}</span>
                        </td>
                        <td>{renderStatusBadge(o.status)}</td>
                        <td>{renderPaidBadge(o.isPaid)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* 📱 Mobile cards */}
          <div className="d-block d-md-none">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="page-title mb-0">My orders</h2>
              <span className="orders-count-mobile">
                {orders.length} order{orders.length > 1 ? 's' : ''}
              </span>
            </div>

            {orders.map((o) => {
              const shortId = o._id.slice(-8);
              return (
                <Card key={o._id} className="orders-mobile-card mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Link
                        to={`/orders/${shortId}`}
                        className="orders-id-link"
                      >
                        #{shortId}
                      </Link>
                      <span className="orders-total">${o.total}</span>
                    </div>

                    <div className="orders-mobile-row">
                      <span className="orders-mobile-label">Date</span>
                      <span className="orders-mobile-value">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="orders-mobile-row">
                      <span className="orders-mobile-label">Status</span>
                      <span className="orders-mobile-value">
                        {renderStatusBadge(o.status)}
                      </span>
                    </div>

                    <div className="orders-mobile-row">
                      <span className="orders-mobile-label">Paid</span>
                      <span className="orders-mobile-value">
                        {renderPaidBadge(o.isPaid)}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
