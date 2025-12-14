// backend/src/controllers/productController.js
import Product from '../models/Product.js';

// ================== GET ALL PRODUCTS (مع فلاتر) ==================
export const getProducts = async (req, res) => {
  try {
    const {
      q,
      gender,
      category,
      color,
      size,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = { isActive: true }; // بس المنتجات الفعّالة

    // ✅ هون التعديل المهم
    if (gender) {
      if (gender === 'Men') {
        // لما يختار Men → جيب Men + Unisex
        filter.gender = { $in: ['Men', 'Unisex'] };
      } else if (gender === 'Women') {
        // لما يختار Women → جيب Women + Unisex
        filter.gender = { $in: ['Women', 'Unisex'] };
      } else {
        // لو اختار Unisex أو أي قيمة ثانية
        filter.gender = gender;
      }
    }

    // الكاتيجوري متل ما هي
    if (category) filter.category = category;

    if (q) {
      filter.name = { $regex: q, $options: 'i' }; // search by name
    }

    if (color) {
      // يا إمّا بالـ colors array أو جوّا variants
      filter.$or = [
        { colors: color },
        { 'variants.color': color },
      ];
    }

    if (size) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { sizes: size },
        { 'variants.size': size }
      );
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================== GET SINGLE PRODUCT BY ID ==================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('getProductById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================== CREATE PRODUCT ==================
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      gender,
      category,
      description,
      price,
      colors,
      sizes,
      images,
      stock,
    } = req.body;

    const numericPrice = Number(price);
    const numericStock = stock !== undefined ? Number(stock) : 0;

    const product = await Product.create({
      name,
      gender,
      category,
      description,
      price: numericPrice,
      colors,
      sizes,
      images,
      stock: numericStock,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// ================== UPDATE PRODUCT ==================
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// ================== DELETE PRODUCT (SOFT DELETE) ==================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false }, // ما منمسحه، بس منخبيه
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deactivated', product });
  } catch (err) {
    console.error('deleteProduct error:', err);
    res.status(400).json({ message: 'Delete failed' });
  }
};
