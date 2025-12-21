// backend/models/Product.js
import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    gender: {
      type: String,
      enum: ['Women', 'Men', 'Unisex'],
      required: true,
    },

    category: {
      type: String,
      enum: [
        'Hoodie unisex',
        'Oversized unisex',
        'Sweater unisex',
        'Pants men',
        'Pants women',
        'Special set',
      ],
      required: true,
    },

    description: { type: String, required: true },
discountPrice: {
  type: Number,default: 0,},
    price: { type: Number, required: true },

    // colors & sizes (overall)
    colors: [{ type: String }],
    sizes: [{ type: String }],

    // global stock (مجموع الـ variants أو fallback)
    stock: { type: Number, default: 0 },

    // 🔥 stock per color + size
    variants: [variantSchema],

    images: [{ type: String }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
