import { Router } from 'express';
import * as _controller from '../controllers/postsController.js';
import { checkToken, checkCharity } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileMiddleware.js';

const postRouter = Router();

postRouter.post('/api/charity/posts/create', checkCharity, upload.array('imagesReferences'), _controller.createPostController);
postRouter.post('/api/charity/posts/edit/:id', checkCharity, upload.array('imagesReferences'), _controller.editPostController);
postRouter.get('/api/charity/posts/:id', checkToken,  _controller.getPostById);
postRouter.get('/api/charity/posts', checkToken, _controller.getAllPostsController);

postRouter.post('/api/charity/posts/:id/comment', checkToken, _controller.addPostCommentController);
postRouter.delete('/api/charity/posts/:id/comment/:commentId', checkToken, _controller.deletePostCommentController);

postRouter.post('/api/charity/posts/:id/like', checkToken, _controller.likePostCommentController);
postRouter.post('/api/charity/posts/:id/unlike', checkToken, _controller.unlikePostCommentController);

export default postRouter;