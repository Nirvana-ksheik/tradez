import { Router } from 'express';
import { createTradeController, getTradezController, acceptTradezController} from '../controllers/tradezController.js';
import { checkUser } from '../middleware/authMiddleware.js';

const tradeRouter = Router();

tradeRouter.post('/api/trade/create', checkUser, createTradeController);
tradeRouter.get('/api/tradez/:id', checkUser, getTradezController);
tradeRouter.put('/api/tradez/accept', checkUser, acceptTradezController);

export default tradeRouter;