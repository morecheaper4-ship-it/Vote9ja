import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
      required: true,
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    coinsSpent: {
      type: Number,
      required: true,
    },
    voteCount: {
      type: Number,
      default: 1,
    },
    ipAddress: String,
    deviceFingerprint: String,
    userAgent: String,
    deviceInfo: {
      os: String,
      browser: String,
      device: String,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint to prevent duplicate votes
voteSchema.index({ voter: 1, entry: 1 }, { unique: true });
voteSchema.index({ contest: 1, voter: 1 });
voteSchema.index({ ipAddress: 1, contest: 1 });

export default mongoose.model('Vote', voteSchema);
