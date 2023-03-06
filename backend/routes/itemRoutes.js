import { Router } from 'express';
import { createItemController, getItemController, getAllItemsController } from '../controllers/itemController.js';
import { checkUser } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileMiddleware.js';

const itemRouter = Router();

itemRouter.post('/api/item/create', checkUser, upload.array('imagesReferences', 5), createItemController);
itemRouter.get('/api/item/:id', checkUser, getItemController);
itemRouter.get('/api/item', checkUser, getAllItemsController);

export default itemRouter;