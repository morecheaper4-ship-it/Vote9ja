import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ['music', 'talent', 'photography', 'video', 'art', 'other'],
      default: 'other',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    prizes: {
      first: {
        type: Number,
        default: 100000,
      },
      second: {
        type: Number,
        default: 50000,
      },
      third: {
        type: Number,
        default: 30000,
      },
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'ended', 'archived'],
      default: 'draft',
    },
    votingConfig: {
      coinsPerVote: {
        type: Number,
        default: 1,
      },
      maxVotesPerUser: {
        type: Number,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entries: {
      type: Number,
      default: 0,
    },
    totalVotes: {
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
    winners: [
      {
        entry: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Entry',
        },
        position: {
          type: Number,
          enum: [1, 2, 3],
        },
        prizeAmount: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Contest', contestSchema);