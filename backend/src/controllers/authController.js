import User from '../models/User.js';
import { sendPasswordResetEmail } from '../utils/sendNotifications.js';
import { generateToken } from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================== REGISTER ==================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include uppercase, lowercase and a number.',
      });
    }

    // Check if email is admin email
    const isAdminEmail = email === process.env.ADMIN_EMAIL;

    const user = await User.create({
      name,
      email,
      password,
      role: isAdminEmail ? 'admin' : 'user',
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isAdminEmail = user.email === process.env.ADMIN_EMAIL;
    const desiredRole = isAdminEmail ? 'admin' : 'user';

    if (user.role !== desiredRole) {
      user.role = desiredRole;
      await user.save();
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================== FORGOT PASSWORD ==================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that email exists, a reset code was sent.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = code;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user, code);

    console.log('RESET CODE for', user.email, 'is:', code);
    res.json({ message: 'If that email exists, a reset code was sent.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ message: 'Failed to send reset email', error: err.message });
  }
};

// ================== VERIFY RESET CODE (STEP 1) ==================
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordCode || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (String(user.resetPasswordCode) !== String(code).trim()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.json({ message: 'Code verified. You can reset your password now.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================== RESET PASSWORD (STEP 2) ==================
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordCode || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (String(user.resetPasswordCode) !== String(code).trim()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Code has expired, request a new one' });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
      });
    }

    user.password = newPassword; // Hashes password via Mongoose pre-save hook
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated. You can now log in with your new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================== GOOGLE LOGIN ==================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // Get credential from the frontend
    if (!credential) {
      return res.status(400).json({ message: 'No credential provided' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, email_verified } = payload;

    if (!email) {
      return res.status(400).json({ message: 'No email returned from Google' });
    }

    if (email_verified === false) {
      return res.status(400).json({ message: 'Google email is not verified' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const isAdminEmail = email === process.env.ADMIN_EMAIL;

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: randomPassword, // This will not be used, just for the schema
        provider: 'google',
        googleId: sub,
        role: isAdminEmail ? 'admin' : 'user',
      });
    } else {
      const isAdminEmail = email === process.env.ADMIN_EMAIL;
      const desiredRole = isAdminEmail ? 'admin' : 'user';

      if (user.role !== desiredRole) {
        user.role = desiredRole;
        await user.save();
      }
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Google login failed' });
  }
};
