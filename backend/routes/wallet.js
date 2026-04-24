import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

router.get(
  '/balance',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      balance: user.wallet.coins,
      totalSpent: user.wallet.totalSpent,
      totalEarned: user.wallet.totalEarned,
    });
  })
);

router.get(
  '/transactions',
  protect,
  asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  })
);

router.post(
  '/daily-reward',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // Check if reward already claimed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.dailyRewardClaimed && user.dailyRewardClaimed >= today) {
      return res.status(400).json({ message: 'Daily reward already claimed' });
    }

    // Add coins
    user.wallet.coins += 10;
    user.wallet.totalEarned += 10;
    user.dailyRewardClaimed = new Date();
    await user.save();

    // Create transaction
    await Transaction.create({
      user: req.user._id,
      type: 'reward',
      amount: 10,
      coinsAmount: 10,
      status: 'completed',
      paymentMethod: 'wallet',
      description: 'Daily login reward',
    });

    res.status(200).json({
      success: true,
      message: 'Daily reward claimed successfully',
      coins: user.wallet.coins,
    });
  })
);

export default router;