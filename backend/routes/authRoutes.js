import { Router } from 'express';
import { loginController, signupController, logoutController, confirmController, forgotPasswordController, resetPasswordController, getUserProfileController } from '../controllers/authController.js';
import { loginHandleErrors, signupHandleErrors, checkConfirmationEmailToken, checkResetPasswordToken, checkUser } from '../middleware/authMiddleware.js';

const authRouter = Router();

authRouter.post('/api/auth/login', loginHandleErrors, loginController);
authRouter.post('/api/auth/signup', signupHandleErrors, signupController);
authRouter.post('/api/auth/confirm/:token', checkConfirmationEmailToken, confirmController);
authRouter.post('/api/auth/forgot', forgotPasswordController);
authRouter.post('/api/auth/logout', logoutController);
authRouter.post('/api/auth/reset/:token', checkResetPasswordToken, resetPasswordController);
authRouter.get('/api/auth/profile', checkUser, getUserProfileController);

export default authRouter;