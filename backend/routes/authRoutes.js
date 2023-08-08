import { Router } from 'express';
import { loginController, signupController, logoutController, confirmController, forgotPasswordController, resetPasswordController, getUserProfileController, getAllAdminsController, updateProfilePictureController } from '../controllers/authController.js';
import { checkConfirmationEmailToken, checkResetPasswordToken, checkToken, checkUser } from '../middleware/authMiddleware.js';
import { _loginUserValidator } from '../validators/auth/loginUserValidator.js';
import { _signupUserValidator } from '../validators/auth/signupUserValidator.js';
import { userProfileUpload } from '../middleware/fileMiddleware.js';

const authRouter = Router();

authRouter.post('/api/auth/login', _loginUserValidator, loginController);
authRouter.post('/api/auth/signup', _signupUserValidator,  signupController);
authRouter.post('/api/auth/confirm/:token', checkConfirmationEmailToken, confirmController);
authRouter.post('/api/auth/forgot', forgotPasswordController);
authRouter.post('/api/auth/logout', logoutController);
authRouter.post('/api/auth/reset/:token', checkResetPasswordToken, resetPasswordController);
authRouter.get('/api/auth/profile', checkToken, getUserProfileController);
authRouter.get('/api/auth/admins', getAllAdminsController);
authRouter.put('/api/auth/update-logo', checkToken, userProfileUpload.single('logo'), updateProfilePictureController);

export default authRouter;