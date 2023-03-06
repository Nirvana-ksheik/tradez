import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ItemModel } from '../models/Item.js';
import { createItem, getItemById, getAllItems } from '../helpers/itemHelper.js';
import { ImageModel } from '../models/Image.js';
import { createImagesAndReturnIds } from '../helpers/imageHelper.js';
dotenv.config();

const _createItemController = async (req, res) => {

    try {
        const item = new ItemModel(req.body);
        item.setOwnerId(req.user.id);
        item.setItemId(req.body._id)
        console.log("item: ", item);
        const files = ImageModel.getImages(req.files);
        const fileReferences = await createImagesAndReturnIds(files);
        item.setImageReferences(fileReferences);
        const result = await createItem({item});
        res.status(200).json(result);
        console.log("finished creating item");
    } catch (err) {
        res.status(500).json(err.message);
    }
};
export { _createItemController as createItemController };

const _getItemController = async (req, res) => {
    
    try {
        const id = new mongoose.Types.ObjectId(req.params);
        const item = await getItemById({id})
        res.status(200).json(item);
        console.log("finished getting item");
    
    } catch (err) {
        res.status(500).json(err.message);
    }
};
export { _getItemController as getItemController };

const _getAllItemsController = async (req, res) => {

    console.log("reached get all user items controller");
    try{
        let userId = req.user.id;
        const query = req.query;
        console.log("query params: ", query);
        if(query.isMine){
            query.userId = userId;
        }
        const items = await getAllItems({query});
        res.status(200).json(items);
        console.log("finished getting items for user");
    } catch(err){
        res.status(500).json(err.message);
    }
};
export { _getAllItemsController as getAllItemsController };