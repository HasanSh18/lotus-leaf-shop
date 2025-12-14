import Order from '../models/Order.js';
import Product from '../models/Product.js';
import {
  sendOrderEmail,
  buildWhatsAppNotificationUrl,
} from '../utils/sendNotifications.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items' });
    }

    let total = 0;
    const productSavePromises = [];

    for (const item of items) {
      const qty = Number(item.quantity) || 0;

      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: 'Product not found' });
      }

      // نتحقق من المخزون قبل ما نكمّل
      if (typeof product.stock === 'number') {
        if (product.stock < qty) {
          return res.status(400).json({
            message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
          });
        }

        // ننقص المخزون
        product.stock -= qty;
        productSavePromises.push(product.save());
      }

      total += product.price * qty;
    }

    // نعمل save لكل المنتجات بعد ما نعدّل stock
    await Promise.all(productSavePromises);

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      items: items.map((i) => ({
        product: i.productId,
        name: i.name,
        price: i.price,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
      })),
      total,
      shippingAddress,
      paymentMethod,
    });

    await sendOrderEmail(order);
    const whatsappUrl = buildWhatsAppNotificationUrl(order);

    res.status(201).json({ order, whatsappUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create order' });
  }
};
