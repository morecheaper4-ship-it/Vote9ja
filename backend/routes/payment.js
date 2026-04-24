import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { processPaystackPayment } from '../services/paymentService.js';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';

router.post(
  '/verify-payment',
  protect,
  asyncHandler(async (req, res) => {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }

    const transaction = await processPaystackPayment(req.user._id, req.body.amount, reference);

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      transaction,
    });
  })
);

router.post(
  '/webhook',
  asyncHandler(async (req, res) => {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const amount = event.data.amount;
      const customerEmail = event.data.customer.email;

      // Find user and process payment
      // Implementation depends on your user lookup strategy
      console.log(`Payment successful for ${customerEmail}`);
    }

    res.json({ success: true });
  })
);

export default router;
