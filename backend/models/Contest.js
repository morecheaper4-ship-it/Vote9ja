import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['music', 'dance', 'comedy', 'arts', 'sports', 'other'],
      default: 'other',
    },
    coverImage: String,
    rules: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'ended', 'cancelled'],
      default: 'draft',
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    prizes: {
      first: {
        type: Number,
        required: true,
      },
      second: {
        type: Number,
        required: true,
      },
      third: {
        type: Number,
        required: true,
      },
    },
    votingConfig: {
      coinsPerVote: {
        type: Number,
        default: 1,
      },
      allowRevote: {
        type: Boolean,
        default: false,
      },
    },
    entries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry',
      },
    ],
    entryCount: {
      type: Number,
      default: 0,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    participantCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

contestSchema.index({ status: 1, endDate: -1 });
contestSchema.index({ startDate: 1 });
contestSchema.index({ isFeatured: 1 });

export default mongoose.model('Contest', contestSchema);
