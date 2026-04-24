import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import Entry from '../models/Entry.js';
import User from '../models/User.js';

router.get(
  '/contest/:contestId',
  asyncHandler(async (req, res) => {
    const leaderboard = await Entry.find({
      contest: req.params.contestId,
      status: 'approved',
    })
      .populate('contestant', 'firstName lastName profileImage')
      .sort({ votes: -1 })
      .limit(100);

    // Assign ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1,
    }));

    res.status(200).json({
      success: true,
      leaderboard: rankedLeaderboard,
    });
  })
);

router.get(
  '/top-voters',
  asyncHandler(async (req, res) => {
    const topVoters = await User.find()
      .sort({ totalVotes: -1 })
      .limit(20)
      .select('firstName lastName profileImage totalVotes');

    res.status(200).json({
      success: true,
      topVoters,
    });
  })
);

export default router;