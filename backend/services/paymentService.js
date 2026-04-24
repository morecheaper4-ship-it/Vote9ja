import axios from 'axios';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const verifyPaystackPayment = async (reference) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error('Payment verification failed');
  }
};

export const processPaystackPayment = async (userId, amount, reference) => {
  // Check if transaction already exists (prevent duplicate crediting)
  const existingTransaction = await Transaction.findOne({
    paystackReference: reference,
    status: 'completed',
  });

  if (existingTransaction) {
    throw new Error('This transaction has already been processed');
  }

  // Verify payment with Paystack
  const verification = await verifyPaystackPayment(reference);

  if (!verification.status || verification.data.status !== 'success') {
    throw new Error('Payment verification failed');
  }

  // Calculate coins (assuming 1 Naira = 1 coin, adjust as needed)
  const coinsAmount = Math.floor(amount / 100); // Paystack uses kobo, convert to Naira

  // Update user wallet
  const user = await User.findById(userId);
  user.wallet.coins += coinsAmount;
  user.wallet.totalEarned += coinsAmount;
  await user.save();

  // Create transaction record
  const transaction = await Transaction.create({
    user: userId,
    type: 'purchase',
    amount: amount / 100,
    coinsAmount,
    status: 'completed',
    paymentMethod: 'paystack',
    paystackReference: reference,
    paystackAmount: amount,
    verifiedAt: new Date(),
  });

  return transaction;
};