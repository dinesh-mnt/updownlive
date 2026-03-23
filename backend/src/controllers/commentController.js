import Comment from '../models/Comment.js';
import { createAuth } from '../config/auth.js';

// Helper: get session from Better Auth
async function getSession(req) {
  try {
    const auth = createAuth();
    const session = await auth.api.getSession({ headers: req.headers });
    return session;
  } catch {
    return null;
  }
}

// GET /api/comments?articleUrl=...
export const getComments = async (req, res) => {
  try {
    const { articleUrl } = req.query;
    if (!articleUrl) {
      return res.status(400).json({ success: false, message: 'articleUrl is required' });
    }
    const comments = await Comment.find({ articleUrl }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};

// POST /api/comments
export const createComment = async (req, res) => {
  try {
    const session = await getSession(req);
    if (!session?.user) {
      return res.status(401).json({ success: false, message: 'You must be logged in to comment' });
    }

    const { articleUrl, articleTitle, content } = req.body;
    if (!articleUrl || !articleTitle || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const comment = await Comment.create({
      articleUrl,
      articleTitle,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      content: content.trim(),
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to post comment' });
  }
};

// DELETE /api/comments/:id  (admin only)
export const deleteComment = async (req, res) => {
  try {
    const session = await getSession(req);
    if (!session?.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (session.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete comment' });
  }
};

// GET /api/comments/all  (admin only)
export const getAllComments = async (req, res) => {
  try {
    const session = await getSession(req);
    if (!session?.user || session.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};
