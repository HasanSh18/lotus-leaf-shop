// models/User.js (المهم يكون هيك تقريباً)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // 👈 هون المهم
      default: 'user',         // 👈 وهون كمان
    },

    // اختياري: حقول تانية
    provider: {
      type: String,
      default: 'local',
    },
    googleId: String,

    resetPasswordCode: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// hashing الباسورد قبل الحفظ
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
