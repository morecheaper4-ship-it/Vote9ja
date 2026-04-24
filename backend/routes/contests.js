import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import Contest from '../models/Contest.js';

router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { title, description, image, startDate, endDate, prizes } = req.body;

    const contest = await Contest.create({
      title,
      description,
      image,
      startDate,
      endDate,
      prizes,
      createdBy: req.user._id,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Contest created successfully',
      contest,
    });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const contests = await Contest.find({ status: 'active' })
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contests,
    });
  })
);

router.get(
  '/trending',
  asyncHandler(async (req, res) => {
    const contests = await Contest.find({ status: 'active', isTrending: true })
      .sort({ totalVotes: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      contests,
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const contest = await Contest.findById(req.params.id).populate('createdBy', 'firstName lastName email');

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.status(200).json({
      success: true,
      contest,
    });
  })
);

export default router;
