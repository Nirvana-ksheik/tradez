import { Router } from 'express';
import * as _controller from '../controllers/subscriptionController.js';

const subscriptionRouter = Router();

subscriptionRouter.post('/api/save-subscription',  _controller.saveSubscription);
subscriptionRouter.post('/api/send-notification',  _controller.sendNotification);

export default subscriptionRouter;