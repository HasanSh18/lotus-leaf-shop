// src/utils/sendNotifications.js
import axios from 'axios';

// 🟢 Helper لإرسال إيميل عبر Resend
async function sendEmailViaResend({ to, subject, text }) {
  const from = process.env.EMAIL_FROM;

  console.log('Resend FROM value =', JSON.stringify(from));

  if (!process.env.RESEND_API_KEY || !from) {
    console.log('RESEND_API_KEY or EMAIL_FROM not set, skipping email.');
    return;
  }

  try {
    const res = await axios.post(
      'https://api.resend.com/emails',
      {
        from,
        to,
        subject,
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Email sent via Resend:', res.data?.id || '');
  } catch (err) {
    console.error(
      '❌ Failed to send email via Resend:',
      err.response?.data || err.message
    );
  }
}

// 📨 1) Email لما ينعمل Order جديد
export const sendOrderEmail = async (order) => {
  if (!order) return;

  const itemsList = order.items
    .map(
      (item) =>
        `- ${item.name} (${item.color}/${item.size}) x ${item.quantity} = $${
          item.price * item.quantity
        }`
    )
    .join('\n');

  const text = `
New order placed:

Customer: ${order.shippingAddress.fullName}
Phone: ${order.shippingAddress.phone}
Email: ${order.shippingAddress.email}
Address: ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.country}

Items:
${itemsList}

Total: $${order.total}
Payment Method: ${order.paymentMethod}
Status: ${order.status}

Order ID: ${order._id}
  `;

  await sendEmailViaResend({
    to: process.env.ADMIN_EMAIL,
    subject: `New order from ${order.shippingAddress.fullName}`,
    text,
  });
};

// 🟢 2) WhatsApp link للـ order (متل ما هو)
export const buildWhatsAppNotificationUrl = (order) => {
  const baseUrl =
    process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  if (!adminNumber) {
    console.log('WHATSAPP_ADMIN_NUMBER not set');
    return null;
  }
  const msg = encodeURIComponent(
    `New Lotus Leaf order\nOrder ID: ${order._id}\nCustomer: ${order.shippingAddress.fullName}\nPhone: ${order.shippingAddress.phone}\nTotal: $${order.total}`
  );
  return `${baseUrl}?phone=${adminNumber}&text=${msg}`;
};

// 🔐 3) Email لكود Reset Password
export const sendPasswordResetEmail = async (user, code) => {
  if (!user?.email) return;

  const text = `
You requested to reset your Lotus Leaf account password.

Your reset code is: ${code}

This code will expire in 15 minutes.

If you did not request this, you can ignore this email.
  `;

  await sendEmailViaResend({
    to: user.email,
    subject: 'Reset your Lotus Leaf password',
    text,
  });
};
