import { Router } from 'express';
import { createTradeController, getTradezController, acceptTradezController, getAcceptedTradezController} from '../controllers/tradezController.js';
import { checkAdmin, checkUser } from '../middleware/authMiddleware.js';

const tradeRouter = Router();

tradeRouter.post('/api/trade/create', checkUser, createTradeController);
tradeRouter.get('/api/tradez/:id', checkUser, getTradezController);
tradeRouter.put('/api/tradez/accept', checkUser, acceptTradezController);

tradeRouter.get('/api/admin/tradez', checkAdmin, getAcceptedTradezController);

export default tradeRouter;