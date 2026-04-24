import express from 'express';
const router = express.Router();
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, authorize } from '../middleware/auth.js';
import Feed from '../models/Feed.js';
import Comment from '../models/Comment.js';

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const feed = await Feed.find({ visibility: 'public' })
      .populate('author', 'firstName lastName profileImage')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      feed,
    });
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { title, content, image, postType } = req.body;

    const post = await Feed.create({
      author: req.user._id,
      title,
      content,
      image,
      postType,
      visibility: 'public',
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  })
);

router.post(
  '/:id/like',
  protect,
  asyncHandler(async (req, res) => {
    const post = await Feed.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter((like) => like.toString() !== req.user._id.toString());
      post.likesCount -= 1;
    } else {
      // Like
      post.likes.push(req.user._id);
      post.likesCount += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: post.likes.includes(req.user._id) ? 'Post liked' : 'Post unliked',
      likesCount: post.likesCount,
    });
  })
);

router.post(
  '/:id/comment',
  protect,
  asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.create({
      post: req.params.id,
      author: req.user._id,
      content,
    });

    const post = await Feed.findById(req.params.id);
    post.comments.push(comment._id);
    post.commentsCount += 1;
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added',
      comment,
    });
  })
);

router.post(
  '/comment/:id/reply',
  protect,
  asyncHandler(async (req, res) => {
    const { content } = req.body;

    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = await Comment.create({
      post: parentComment.post,
      author: req.user._id,
      content,
      parentComment: req.params.id,
      isReply: true,
    });

    parentComment.replies.push(reply._id);
    parentComment.repliesCount += 1;
    await parentComment.save();

    res.status(201).json({
      success: true,
      message: 'Reply added',
      reply,
    });
  })
);

export default router;
