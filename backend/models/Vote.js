import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    entry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
      required: true,
    },
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    coinsSpent: {
      type: Number,
      default: 1,
    },
    ipAddress: String,
    deviceFingerprint: String,
    userAgent: String,
    flaggedForFraud: {
      type: Boolean,
      default: false,
    },
    fraudReason: String,
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one vote per user per entry
voteSchema.index({ entry: 1, voter: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);