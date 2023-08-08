import { Router } from 'express';
import * as _controller from '../controllers/charityAuthController.js';
import { checkConfirmationEmailToken, checkResetPasswordToken, checkCharity, checkAdmin } from '../middleware/authMiddleware.js';
import { logoUpload } from '../middleware/fileMiddleware.js';

const charityRouter = Router();

charityRouter.post('/api/charity/auth/signup', logoUpload.single('logo'),  _controller.signupController);
charityRouter.post('/api/charity/auth/login', _controller.loginController);
charityRouter.post('/api/charity/auth/confirm/:token', checkConfirmationEmailToken, _controller.confirmController);
charityRouter.post('/api/charity/auth/forgot', _controller.forgotPasswordController);
charityRouter.post('/api/charity/auth/logout', _controller.logoutController);
charityRouter.post('/api/charity/auth/reset/:token', checkResetPasswordToken, _controller.resetPasswordController);
charityRouter.get('/api/charity/auth/profile/:id', _controller.getUserProfileController);
charityRouter.get('/api/charity', _controller.getAllCharitiesController);
charityRouter.put('/api/charity/categories', checkCharity, _controller.updateCharityCategoriesController);

charityRouter.put('/api/admin/charity/:id', checkAdmin, _controller.changeCharityStatusController);

export default charityRouter;