import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    postType: {
      type: String,
      enum: ['announcement', 'update', 'highlight', 'general'],
      default: 'general',
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
    isPinned: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    relatedContest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Feed', feedSchema);