import { Router } from 'express';
import { getAllNotificationsController, saveNotificationController } from '../controllers/notificationsController.js';
import { checkToken } from '../middleware/authMiddleware.js';

const notificationRouter = Router();

notificationRouter.get('/api/notifications', checkToken, getAllNotificationsController);
notificationRouter.post('/api/notifications', saveNotificationController);

export default notificationRouter;