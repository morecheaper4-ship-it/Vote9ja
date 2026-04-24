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
    currency: {
      type: String,
      default: 'NGN',
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentReference: {
      paystackReference: String,
      orderId: String,
    },
    metadata: {
      contestId: mongoose.Schema.Types.ObjectId,
      entryId: mongoose.Schema.Types.ObjectId,
      referredUserId: mongoose.Schema.Types.ObjectId,
    },
    relatedTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ 'paymentReference.paystackReference': 1 });

export default mongoose.model('Transaction', transactionSchema);
