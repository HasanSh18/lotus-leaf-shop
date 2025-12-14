import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  googleLogin, // ⬅
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-code', verifyResetCode);

// ⬅ endpoint الجديد
router.post('/google-login', googleLogin);

export default router;