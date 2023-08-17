import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { ItemModel } from '../models/Item.js';
import { createItem, getItemMetaData, getAllItems, editItem, changeItemStatus, setItemDelivered } from '../helpers/itemHelper.js';
import { ImageModel } from '../models/Image.js';
import { createImagesAndReturnIds } from '../helpers/imageHelper.js';
import { deleteFilesWithItemId } from '../helpers/fileHelper.js';
import { ItemStatus } from '../models/Statics.js';
import { generateQrCode } from '../helpers/qrCodeGenerator.js';
import fs from 'fs';
dotenv.config();

const _createItemController = async (req, res) => {
    console.log("request body: ", req.body);
    try {
        const item = new ItemModel(req.body);
        item.setOwnerId(req.user.id);
        item.setItemId(req.body._id);
        item.status = ItemStatus.PENDING;
        console.log("item: ", item);
        const files = ImageModel.getImages(req.files);
        const fileReferences = await createImagesAndReturnIds(files);
        item.setImageReferences(fileReferences);
        const result = await createItem({item});
        console.log("result is: ", result);
        generateQrCode(result);
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
        console.log("userId: in conrtoller: ", userId);
        const role = req.user.role;
        const id = new mongoose.Types.ObjectId(req.params);
        const item = await getItemMetaData({id, userId: userId, role})
        res.status(200).json(item);
        console.log("finished getting item");
    
    } catch (err) {
        res.status(500).json(err.message);
    }
};
export { _getItemController as getItemController };

const _getAllUserItemsController = async(req, res) => {
    console.log("reached get all user items controller");
    try{
        const id = req.params.id;
        const query = req.query;
        query.userId = id;
        query.isUserProfile = true;
        query.isMine = true;
        query.archived = false;
        console.log("query params: ", query);
        const items = await getAllItems({query});
        res.status(200).json(items);
        console.log("finished getting items for user");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
}
export { _getAllUserItemsController as getAllUserItemsController };


const _getAllItemsController = async (req, res) => {

    console.log("reached get all user items controller");
    try{
        let userId = req.user.id;
        const query = req.query;
        query.userId = userId;
        query.role = req.user.role;
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

const _changeItemStatusController = async (req, res) => {

    console.log("reached approve item controller");
    try{
        const {id} = req.params;
        const data = req.body;
        const item = await changeItemStatus(id, data.status, data.rejectMessage);
        console.log("finished approving item : ", id);
        res.status(200).json(item);
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _changeItemStatusController as changeItemStatusController };

const _getAllItemsAdminController = async (req, res) => {

    console.log("reached get all user items controller");
    try{
        const query = req.query;
        console.log("query params: ", query);
        const items = await getAllItems({query});
        res.status(200).json(items);
        console.log("finished getting items for user");
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _getAllItemsAdminController as getAllItemsAdminController };


const _setItemDeliveredController = async (req, res) => {

    console.log("reached approve item controller");
    try{
        const {id} = req.params;
        const tradeId = req.body.tradeId;
        console.log("tradeId: ", tradeId);
        const result = await setItemDelivered(id, tradeId);
        console.log("finished setting item as delivered");
        res.status(200).json(result);
    } catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _setItemDeliveredController as setItemDeliveredController };

const _downloadQrCode = async (req, res) => {

    console.log("downloading");
    try{
        const id = req.params.id;
        const idd = req.params.idd;

        const fileUrl = 'public/' + idd + '/' + id.toString() + '/qr-code/' + id.toString() + '--qrCode.png'; // URL of the file you want to download
        const fileName = id.toString() + '---qrCode.png';

        res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-type', 'image/png');

        const fileStream = fs.createReadStream(fileUrl);
        fileStream.pipe(res);
    }
    catch(err){
        console.log("error: ", err);    
        res.status(500).json(err.message);
    }
};
export { _downloadQrCode as downloadQrCode };