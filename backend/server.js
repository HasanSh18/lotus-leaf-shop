import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
console.log('GOOGLE_CLIENT_ID (backend):', process.env.GOOGLE_CLIENT_ID);
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- SECURITY MIDDLEWARE ---------- */

app.use(helmet());
app.use(xss());

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// CORS – منسمح للـ localhost + الدومين تبعك من الـ .env
const allowedOrigins = [
  'https://lotus-leaf.com',
  'https://www.lotus-leaf.com',
  'https://lotus-leaf-shop.vercel.app', // الدومين تبع Vercel كمان، احتياطاً
  process.env.CLIENT_URL,               // إذا بكون مضبوط صح بالـ env
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
       console.log('Incoming origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Rate limiting (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use('/api', limiter);

app.use(morgan('dev'));

/* ---------- MONGODB CONNECTION ---------- */

const mongoUri =
  process.env.MONGO_URI || 'mongodb://localhost:27017/lotus_leaf_shop';

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

/* ---------- ROUTES ---------- */

// health check
app.get('/', (req, res) => {
  res.json({ message: 'Lotus Leaf API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

/* ---------- START SERVER ---------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
