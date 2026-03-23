import express from 'express';
import { getComments, createComment, deleteComment, getAllComments } from '../controllers/commentController.js';

const router = express.Router();

router.get('/all', getAllComments);
router.get('/', getComments);
router.post('/', createComment);
router.delete('/:id', deleteComment);

export default router;
