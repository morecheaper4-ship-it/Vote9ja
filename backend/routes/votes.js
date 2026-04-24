import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { voteLimiter } from '../middleware/rateLimiter.js';
import { castVote } from '../services/voteService.js';
import { generateDeviceFingerprint, getClientIP } from '../utils/deviceFingerprint.js';
import Vote from '../models/Vote.js';

router.post(
  '/',
  protect,
  voteLimiter,
  asyncHandler(async (req, res) => {
    const { entryId, contestId } = req.body;

    if (!entryId || !contestId) {
      return res.status(400).json({ message: 'Entry ID and Contest ID are required' });
    }

    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'];
    const deviceFingerprint = generateDeviceFingerprint(userAgent);

    const vote = await castVote(req.user._id, entryId, contestId, ipAddress, deviceFingerprint, userAgent);

    res.status(201).json({
      success: true,
      message: 'Vote cast successfully',
      vote,
    });
  })
);

router.get(
  '/entry/:entryId',
  asyncHandler(async (req, res) => {
    const votes = await Vote.find({ entry: req.params.entryId }).populate('voter', 'firstName lastName');

    res.status(200).json({
      success: true,
      votes,
      count: votes.length,
    });
  })
);

router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const votes = await Vote.find({ voter: req.params.userId }).populate('entry').populate('contest');

    res.status(200).json({
      success: true,
      votes,
      count: votes.length,
    });
  })
);

export default router;
