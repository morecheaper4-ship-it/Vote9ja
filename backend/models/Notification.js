import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'contest_update',
        'vote_received',
        'entry_approved',
        'entry_rejected',
        'contest_ending',
        'achievement_unlocked',
        'referral_bonus',
        'new_comment',
        'post_liked',
        'contest_result',
        'daily_reward_available',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: mongoose.Schema.Types.Mixed,
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', notificationSchema);