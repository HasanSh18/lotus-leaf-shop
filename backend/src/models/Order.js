// backend/models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    notes: { type: String },
    defaultAddress: { type: Boolean, default: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['wish-number', 'whatsapp-pay', 'cod'],
      default: 'wish-number',
    },
    total: { type: Number, required: true },

    // هل الأوردر مدفوع أم لا
    isPaid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
