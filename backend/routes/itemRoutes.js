import { Router } from 'express';
import { createItemController, getItemController, getAllItemsController, getAllPublicItemsController, editItemController, changeItemStatusController, getAllUserItemsController, setItemDeliveredController, downloadQrCode } from '../controllers/itemController.js';
import { checkAdmin, checkToken, checkUser } from '../middleware/authMiddleware.js';
import { _editItemValidator } from '../validators/items/editItemValidator.js';
import { _changeItemStatusValidator } from '../validators/items/changeItemStatusValidator.js'
import upload from '../middleware/fileMiddleware.js';

const itemRouter = Router();

itemRouter.post('/api/item/create', checkUser, upload.array('imagesReferences'), createItemController);
itemRouter.put('/api/item/edit/:id', checkUser, _editItemValidator, upload.array('imagesReferences'), editItemController);
itemRouter.get('/api/item/:id', checkToken, getItemController);
itemRouter.get('/api/items', checkToken, getAllItemsController);
itemRouter.get('/api/public/items', getAllPublicItemsController);
itemRouter.get('/api/items/:id', getAllUserItemsController);
itemRouter.get('/api/item/:id/user/:idd/qr-code/download', downloadQrCode);

itemRouter.put('/api/admin/item/delivered/:id', checkAdmin, setItemDeliveredController);
itemRouter.put('/api/admin/item/:id', checkAdmin, _changeItemStatusValidator, changeItemStatusController);

export default itemRouter;