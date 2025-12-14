// backend/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/products
 * كل المنتجات
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/products/:id
 * منتج واحد بالتفصيل (بيشمل variants)
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/products
 * إنشاء منتج جديد
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      gender,
      category,
      description,
      price,
      colors = [],
      sizes = [],
      images = [],
      stock,
      variants = [],
      isActive = true,
    } = req.body;

    // لو في variants منجمع الـ stock منها
    const totalStock =
      Array.isArray(variants) && variants.length > 0
        ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
        : Number(stock) || 0;

    const product = await Product.create({
      name,
      gender,
      category,
      description,
      price: Number(price),
      colors,
      sizes,
      images,
      stock: totalStock,
      variants,
      isActive,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('POST /products error:', err);
    res.status(500).json({ message: 'Could not create product' });
  }
});

/**
 * PUT /api/products/:id
 * تعديل منتج
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      gender,
      category,
      description,
      price,
      colors = [],
      sizes = [],
      images = [],
      stock,
      variants = [],
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.gender = gender ?? product.gender;
    product.category = category ?? product.category;
    product.description = description ?? product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.colors = colors;
    product.sizes = sizes;
    product.images = images;
    product.variants = variants;

    // نحسب الـ stock من الـ variants إذا موجودة
    const totalStock =
      Array.isArray(variants) && variants.length > 0
        ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
        : stock !== undefined
        ? Number(stock)
        : product.stock;

    product.stock = totalStock;
    if (typeof isActive === 'boolean') product.isActive = isActive;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('PUT /products/:id error:', err);
    res.status(500).json({ message: 'Could not update product' });
  }
});

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('DELETE /products/:id error:', err);
    res.status(500).json({ message: 'Could not delete product' });
  }
});

export default router;
