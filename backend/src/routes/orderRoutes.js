// backend/routes/orderRoutes.js
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import {
  sendOrderEmail,
  buildWhatsAppNotificationUrl,
} from '../utils/sendNotifications.js';

const router = express.Router();

/**
 * POST /api/orders
 * body: { items, shippingAddress, paymentMethod }
 */
// backend/routes/orderRoutes.js
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;

    // 1) verify products + stock per variant
    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);

      if (!dbProduct || !dbProduct.isActive) {
        return res.status(400).json({
          message: `Product not available: ${item.name}`,
        });
      }

      const qty = Number(item.quantity) || 0;
      if (qty <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      // price from DB
      total += dbProduct.price * qty;

      let availableStock = 0;

      if (
        Array.isArray(dbProduct.variants) &&
        dbProduct.variants.length > 0 &&
        item.color &&
        item.size
      ) {
        const variant = dbProduct.variants.find(
          (v) => v.color === item.color && v.size === item.size
        );
        availableStock = variant ? variant.stock || 0 : 0;
      } else {
        availableStock =
          typeof dbProduct.stock === 'number' ? dbProduct.stock : 0;
      }

      if (availableStock < qty) {
        return res.status(400).json({
          message: `Not enough stock for ${dbProduct.name} (${item.color || ''} ${item.size || ''})`,
        });
      }
    }

    // 2) create order snapshot
    const orderItems = items.map((item) => ({
      product: item.productId,
      name: item.name,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      items: orderItems,
      shippingAddress,
      paymentMethod,
      total,
    });

    // 3) deduct stock per variant + global
    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) continue;

      const qty = Number(item.quantity) || 0;

      if (
        Array.isArray(dbProduct.variants) &&
        dbProduct.variants.length > 0 &&
        item.color &&
        item.size
      ) {
        const idx = dbProduct.variants.findIndex(
          (v) => v.color === item.color && v.size === item.size
        );
        if (idx !== -1) {
          dbProduct.variants[idx].stock = Math.max(
            0,
            (dbProduct.variants[idx].stock || 0) - qty
          );
        }
      }

      if (typeof dbProduct.stock === 'number') {
        dbProduct.stock = Math.max(0, dbProduct.stock - qty);
      } else {
        dbProduct.stock = 0;
      }

      await dbProduct.save();
    }

    // 4) email admin
    try {
      await sendOrderEmail(order);
    } catch (err) {
      console.error('sendOrderEmail failed:', err.message);
    }

    // 5) WhatsApp URL
    const whatsappUrl = buildWhatsAppNotificationUrl(order);

    res.status(201).json({ order, whatsappUrl });
  } catch (err) {
    console.error('POST /orders error:', err);
    res.status(500).json({ message: 'Could not place order' });
  }
});


/**
 * GET /api/orders
 * list all orders
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('GET /orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ⭐ GET /api/orders/by-short/:shortId
 */
router.get('/by-short/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId || shortId.length < 4 || shortId.length > 16) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    const order = orders.find((o) => o._id.toString().endsWith(shortId));

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('GET /orders/by-short/:shortId error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/orders/:id   (full ObjectId)
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('GET /orders/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/orders/:id   (change status / paid)
 */
router.put('/:id', async (req, res) => {
  try {
    const { status, isPaid } = req.body;

    const allowed = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    const update = {};

    if (status) {
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      update.status = status;
    }

    if (typeof isPaid === 'boolean') {
      update.isPaid = isPaid;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('PUT /orders/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
