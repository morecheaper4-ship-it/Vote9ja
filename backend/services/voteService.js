import Vote from '../models/Vote.js';
import Entry from '../models/Entry.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const castVote = async (voterId, entryId, contestId, ipAddress, deviceFingerprint, userAgent) => {
  // Check if user already voted
  const existingVote = await Vote.findOne({
    voter: voterId,
    entry: entryId,
  });

  if (existingVote) {
    throw new Error('You have already voted for this entry');
  }

  // Check user has enough coins
  const user = await User.findById(voterId);
  if (user.wallet.coins < 1) {
    throw new Error('Insufficient coins to vote');
  }

  // Create vote
  const vote = await Vote.create({
    entry: entryId,
    voter: voterId,
    contest: contestId,
    coinsSpent: 1,
    ipAddress,
    deviceFingerprint,
    userAgent,
  });

  // Deduct coins from user
  user.wallet.coins -= 1;
  user.wallet.totalSpent += 1;
  user.totalVotes += 1;
  await user.save();

  // Increment entry votes
  const entry = await Entry.findById(entryId);
  entry.votes += 1;
  entry.voters.push(voterId);
  await entry.save();

  // Create transaction record
  await Transaction.create({
    user: voterId,
    type: 'vote',
    amount: 1,
    coinsAmount: 1,
    status: 'completed',
    paymentMethod: 'wallet',
    relatedTo: 'contest',
    contestId,
  });

  return vote;
};
