import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['purchase', 'vote', 'referral', 'reward', 'withdrawal'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coinsAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['paystack', 'wallet'],
    },
    reference: String,
    paystackReference: String,
    paystackAmount: Number,
    description: String,
    relatedTo: {
      type: String,
      enum: ['contest', 'vote', 'referral'],
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
    },
    metadata: mongoose.Schema.Types.Mixed,
    verifiedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Transaction', transactionSchema);