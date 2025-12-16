import nodemailer from 'nodemailer';

// 📨 1) Email لما ينعمل Order جديد
export const sendOrderEmail = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.ADMIN_EMAIL) {
    console.log('Email env vars not set, skipping email sending.');
    return;
  }

  console.log('EMAIL_USER =', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length =', process.env.EMAIL_PASS?.length);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemsList = order.items
    .map(
      (item) =>
        `- ${item.name} (${item.color}/${item.size}) x ${item.quantity} = $${item.price * item.quantity}`
    )
    .join('\n');

  const mailOptions = {
    from: `"Lotus Leaf Shop" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New order from ${order.shippingAddress.fullName}`,
    text: `
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
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send order email:', err.message);
    // ما منرمي error مشان ما يوقع الorder
  }
};

// 🟢 2) WhatsApp link للـ order
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
  console.log('*** sendPasswordResetEmail called for', user.email);

  // اطبع قيم الـ env كرمال نتأكد إنهن واصلين على Render
  console.log('EMAIL_USER =', process.env.EMAIL_USER);
  console.log('EMAIL_HOST =', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT =', process.env.EMAIL_PORT);
  console.log('EMAIL_PASS length =', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email config not set, skipping reset email.');
    // خليها ترمي error هلّق كرمال يبين على الـ frontend
    throw new Error('Email config not set on server');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,   // debug زيادة
    debug: true,
  });

  const mailOptions = {
    from: `"Lotus Leaf Shop" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Reset your Lotus Leaf password',
    text: `
You requested to reset your Lotus Leaf account password.

Your reset code is: ${code}

This code will expire in 15 minutes.

If you did not request this, you can ignore this email.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reset password email SENT to', user.email, 'messageId:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send reset email:', err);
    // كمان ارمي error كرمال يطلع 500 وما نضل نفكر إنو كل شي تمام
    throw err;
  }
};