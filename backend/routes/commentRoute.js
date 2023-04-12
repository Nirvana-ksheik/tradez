import { Router } from 'express';
import { addCommentController, getCommentsController, getCommentRepliesController } from '../controllers/commentController.js';
import { checkUser } from '../middleware/authMiddleware.js';

const commentRouter = Router();

commentRouter.post('/api/comments/add', checkUser, addCommentController);
commentRouter.get('/api/comments/:itemId', getCommentsController);
commentRouter.get('/api/comments/:commentId/replies', getCommentRepliesController);

export default commentRouter;