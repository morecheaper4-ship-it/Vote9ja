import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

router.get(
  '/profile/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate('followers following', 'firstName lastName profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        role: user.role,
        wallet: user.wallet,
        followers: user.followers,
        following: user.following,
        referralCode: user.referralCode,
        totalVotes: user.totalVotes,
      },
    });
  })
);

router.put(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, bio, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, bio, profileImage },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  })
);

router.post(
  '/follow/:id',
  protect,
  asyncHandler(async (req, res) => {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
    });
  })
);

export default router;
