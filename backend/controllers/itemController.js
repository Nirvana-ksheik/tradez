import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ItemModel } from '../models/Item.js';
import { createItem, getItemMetaData, getAllItems, editItem } from '../helpers/itemHelper.js';
import { ImageModel } from '../models/Image.js';
import { createImagesAndReturnIds } from '../helpers/imageHelper.js';
import { deleteFilesWithItemId } from '../helpers/fileHelper.js';

dotenv.config();

const _createItemController = async (req, res) => {
    console.log("request body: ", req.body);
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

const _editItemController = async (req, res) => {

    console.log("request body: ", req.body);
    console.log("request files: ", req.files);
    
    try {
        const item = new ItemModel(req.body);
        item.setOwnerId(req.user.id);
        item.setItemId(req.body._id)
        console.log("item: ", item);
        const files = req.files;
        console.log("files: ", files);
        if(files != [] && files != null && files != undefined && files != ''){
            console.log("item id: ", item._id);
            await deleteFilesWithItemId(item._id);
            const files = ImageModel.getImages(req.files);
            const fileReferences = await createImagesAndReturnIds(files);
            item.setImageReferences(fileReferences);
        }
        const result = await editItem({item});
        res.status(200).json(result);
        console.log("finished editing item");
    } catch (err) {
        res.status(500).json(err.message);
    }
};
export { _editItemController as editItemController };

const _getItemController = async (req, res) => {

    try {
        const userId = req.user.id;
        const id = new mongoose.Types.ObjectId(req.params);
        const item = await getItemMetaData({id, userId})
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
        query.userId = userId;
        console.log("query params: ", query);
        const items = await getAllItems({query});
        res.status(200).json(items);
        console.log("finished getting items for user");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _getAllItemsController as getAllItemsController };


const _getAllPublicItemsController = async (req, res) => {

    console.log("reached get all user items controller");
    try{
        const query = req.query;
        query.isMine = false;
        query.archived = false;
        console.log("query params: ", query);
        const items = await getAllItems({query});
        res.status(200).json(items);
        console.log("finished getting items for user");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _getAllPublicItemsController as getAllPublicItemsController };