import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { registerUser, loginUser } from '../services/authService.js';

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, referralCode } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const { user, token } = await registerUser({ firstName, lastName, email, password });

    // Handle referral code
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        referrer.referralCount += 1;
        referrer.wallet.coins += 5; // Bonus coins for referral
        referrer.referralEarnings += 5;
        await referrer.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  })
);

router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        coins: user.wallet.coins,
      },
    });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  })
);

export default router;