import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    contestant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    thumbnail: String,
    bio: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote',
      },
    ],
    voteCount: {
      type: Number,
      default: 0,
    },
    rank: Number,
    entryFeePaymentId: String,
    isWinner: {
      type: Boolean,
      default: false,
    },
    prizeAwarded: Number,
  },
  {
    timestamps: true,
  }
);

entrySchema.index({ contest: 1, status: 1 });
entrySchema.index({ contestant: 1 });
entrySchema.index({ voteCount: -1 });

export default mongoose.model('Entry', entrySchema);
