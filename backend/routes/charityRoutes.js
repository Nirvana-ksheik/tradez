import { Router } from 'express';
import * as _controller from '../controllers/charityController.js';

const charityRouter = Router();

charityRouter.post('/api/charity/auth/signup',  _controller.signupController);

export default charityRouter;