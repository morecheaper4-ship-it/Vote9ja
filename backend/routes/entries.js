import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import Entry from '../models/Entry.js';
import Contest from '../models/Contest.js';

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { contestId, title, description, bio, mediaUrl, mediaType } = req.body;

    if (!contestId || !title || !mediaUrl || !mediaType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const entry = await Entry.create({
      contest: contestId,
      contestant: req.user._id,
      title,
      description,
      bio,
      mediaUrl,
      mediaType,
      status: 'pending',
    });

    // Update contest entry count
    await Contest.findByIdAndUpdate(contestId, { $inc: { entries: 1 } });

    res.status(201).json({
      success: true,
      message: 'Entry submitted successfully',
      entry,
    });
  })
);

router.get(
  '/contest/:contestId',
  asyncHandler(async (req, res) => {
    const entries = await Entry.find({ contest: req.params.contestId, status: 'approved' })
      .populate('contestant', 'firstName lastName profileImage')
      .sort({ votes: -1 });

    res.status(200).json({
      success: true,
      entries,
    });
  })
);

router.put(
  '/:id/approve',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.user._id,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Entry approved',
      entry,
    });
  })
);

router.put(
  '/:id/reject',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: req.user._id,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Entry rejected',
      entry,
    });
  })
);

export default router;