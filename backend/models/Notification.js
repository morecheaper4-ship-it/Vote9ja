import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'contest_starting',
        'contest_ending',
        'entry_approved',
        'entry_rejected',
        'new_vote',
        'daily_reward',
        'referral_bonus',
        'streak_reward',
        'achievement_unlocked',
        'comment_on_post',
        'post_liked',
      ],
      required: true,
    },
    title: String,
    message: {
      type: String,
      required: true,
    },
    relatedContest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
    },
    relatedEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
    },
    relatedFeed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feed',
    },
    actionUrl: String,
    isRead: {
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
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    sentAt: {
      inApp: Date,
      email: Date,
      push: Date,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
