import { Router } from 'express';
import { createItemController, getItemController, getAllItemsController, getItemImageController, editItemController } from '../controllers/itemController.js';
import { checkUser } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileMiddleware.js';

const itemRouter = Router();

itemRouter.post('/api/item/create', checkUser, upload.array('imagesReferences', 5), createItemController);
itemRouter.put('/api/item/edit/:id', checkUser, upload.array('imagesReferences', 5), editItemController);
itemRouter.get('/api/item/:id', checkUser, getItemController);
itemRouter.get('/api/items', checkUser, getAllItemsController);
// itemRouter.get('/api/image/:id/:idd/:iddd', getItemImageController);

export default itemRouter;