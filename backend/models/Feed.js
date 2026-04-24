import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['announcement', 'update', 'highlight', 'user_post'],
      default: 'user_post',
    },
    title: String,
    content: {
      type: String,
      required: true,
    },
    image: String,
    video: String,
    relatedContest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
    },
    relatedEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    tags: [String],
    isPinned: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

feedSchema.index({ createdAt: -1 });
feedSchema.index({ author: 1 });
feedSchema.index({ type: 1 });
feedSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model('Feed', feedSchema);
