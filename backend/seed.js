import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const mongoUri =
  process.env.MONGO_URI || 'mongodb://localhost:27017/lotus_leaf_shop';

const run = async () => {
  await mongoose.connect(mongoUri);

  // نمسح كل المنتجات القديمة
  await Product.deleteMany({});

  // منضيف منتجات جديدة مع stock
  const products = await Product.insertMany([
    // 🔹 Hoodie Unisex
    {
      name: 'Hoodie – Black (Unisex)',
      gender: 'Unisex',
      category: 'Hoodie unisex',
      description: 'Cozy fleece hoodie, relaxed unisex fit.',
      price: 35,
      stock: 40,
      colors: ['Black', 'Navy blue', 'Burgundy', 'Green', 'Baby blue', 'Aqua'],
      sizes: ['S/M', 'L/XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/hoodie-black.jpg'],
    },
    {
      name: 'Hoodie – Burgundy (Unisex)',
      gender: 'Unisex',
      category: 'Hoodie unisex',
      description: 'Burgundy hoodie with a relaxed unisex fit.',
      price: 35,
      stock: 35,
      colors: ['Black', 'Navy blue', 'Burgundy', 'Green', 'Baby blue', 'Aqua'],
      sizes: ['S/M', 'L/XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/hoodie-burgundy.jpg'],
    },

    // 🔹 Oversized Unisex T-shirts
    {
      name: 'Oversized T-shirt – White',
      gender: 'Unisex',
      category: 'Oversized unisex',
      description: 'Oversized unisex T-shirt, premium cotton.',
      price: 25,
      stock: 50,
      colors: ['White', 'Black', 'Beige'],
      sizes: ['S', 'M', 'L', 'XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/oversized-white.jpg'],
    },
    {
      name: 'Oversized T-shirt – Black',
      gender: 'Unisex',
      category: 'Oversized unisex',
      description: 'Black oversized T-shirt for everyday streetwear look.',
      price: 25,
      stock: 40,
      colors: ['Black', 'White'],
      sizes: ['S', 'M', 'L', 'XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/oversized-black.jpg'],
    },

    // 🔹 Basic Unisex
    {
      name: 'Sweater – Unisex',
      gender: 'Unisex',
      category: 'Sweater unisex',
      description: 'Minimalist unisex basic top, perfect for layering.',
      price: 20,
      stock: 50,
      colors: ['Black', 'Navy blue', 'Burgundy', 'Green', 'Baby blue', 'Aqua'],
      sizes: ['S/M', 'L/XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/basic-unisex.jpg'],
    },

    // 🔹 Pants Men
    {
      name: 'Men Sweatpants',
      gender: 'Men',
      category: 'Pants men',
      description: 'Sweatpants for men with tapered leg.',
      price: 30,
      stock: 45,
      colors: ['Black', 'Navy blue', 'Burgundy', 'Green', 'Baby blue', 'Aqua'],
      sizes: ['S', 'M', 'L', 'XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/sweatpants-men.jpg'],
    },

    // 🔹 Pants Women
    {
      name: 'Women Sweatpants',
      gender: 'Women',
      category: 'Pants women',
      description: 'High-waist sweatpants for women.',
      price: 30,
      stock: 45,
      colors: ['Black', 'Navy blue', 'Burgundy', 'Green', 'Baby blue', 'Aqua'],
      sizes: ['S', 'M', 'L', 'XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/sweatpants-women.jpg'],
    },

    // 🔹 Special sets
    {
      name: 'Men Hoodie + Pants Set (Special Offer)',
      gender: 'Men',
      category: 'Special set',
      description: 'Special offer men set: hoodie + sweatpants.',
      price: 60,
      stock: 20,
      colors: ['Black', 'Navy blue', 'Burgundy', 'Green', 'Baby blue', 'Aqua'],
      sizes: ['S/M', 'L/XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/set-men.jpg'],
    },
    {
      name: 'Women Hoodie + Pants Set (Special Offer)',
      gender: 'Women',
      category: 'Special set',
      description: 'Special offer women set: hoodie + sweatpants.',
      price: 60,
      stock: 20,
      colors: ['Black', 'Navy blue', 'Burgundy', 'Green', 'Baby blue', 'Aqua'],
      sizes: ['S/M', 'L/XL'],
      images: ['https://storage.googleapis.com/lotus-leaf-images/set-women.jpg'],
    },
  ]);

  console.log('Seeded products:', products.length);
  await mongoose.disconnect();
};

run()
  .then(() => process.exit())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
