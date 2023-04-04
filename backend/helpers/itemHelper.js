import model, {ItemModel} from '../models/Item.js';
import {default as userModel} from '../models/User.js';
import {default as imageModel} from '../models/Image.js';
import {default as tradezModel} from '../models/Tradez.js';
import { getTradez } from './tradeHelper.js';
import mongoose from 'mongoose';

const createItem = async ({item}) => {
    console.log("items: ", {...item});
    return await model.create({ ...item })
    .catch(err =>{
         console.log("error occured");
         throw Error(err);
    });
}

const editItem = async ({item}) => {
    console.log("items: ", {...item});
    if(item.imagesReferences == null || item.imagesReferences == undefined || item.imagesReferences == []){
        const itemTemp = await model.findById(item._id);
        item.imagesReferences = itemTemp.imagesReferences;
    }

    return await model.findByIdAndUpdate(item._id, { ...item })
    .catch(err =>{
         console.log("error occured: ", err);
         throw Error(err);
    });
}

const getItemById = async ({id}) => {
    console.log("id: ", id);
    const itemResult = await getItemMetaData({id});
    const tradezItems = await getTradez(itemResult._id);
    itemResult.setTradezItems(tradezItems);
    return itemResult;
}

const getItemMetaData = async ({id, userId}) => {
    console.log("id: ", id);
    const item = await model.findById(id);
    const itemOwner = await userModel.findById(item.ownerId);
    const imagePaths = [];
    for(const imageRef of item.imagesReferences){
        const img = await imageModel.findById(imageRef);
        imagePaths.push(img.path);
    }
    const itemResult = new ItemModel(item);
    itemResult.setImagePaths(imagePaths);
    itemResult.setItemId(item._id);
    itemResult.setItemOwner(itemOwner);
    itemResult.setOwnerId(item.ownerId);
    itemResult.itemTradeInOrder = await isItemTradeInOrder(id, userId)
    return itemResult;
}

const getAllItems = async ({query}) => {
    const order = [];
    query.order ? order.push(query.order) : order.push("publishedDate");
    query.orderDirection ? order.push(query.orderDirection) : order.push(-1);
    const searchText = query.searchText;
    const isMine = query.isMine;
    console.log("isMine: ", isMine);
    console.log("order: ", order);
    const itemsQuery = model.find({...query}).sort([order]);
    itemsQuery.getFilter();
    let userId = new mongoose.Types.ObjectId(query.userId);
    if(isMine == true || isMine == 'true'){
        itemsQuery.where('ownerId').equals(userId);
        itemsQuery.getFilter();
    }else{
        itemsQuery.where('ownerId').ne(userId);
        itemsQuery.getFilter();
    }
    if(searchText){
        itemsQuery.find({
            $or:[
                {name: { $regex: '.*' + searchText + '.*' }},
                {locationName: { $regex: '.*' + searchText + '.*' }},
                {description: { $regex: '.*' + searchText + '.*' }}
            ]
        });
        itemsQuery.getFilter();
    }
    const items = await itemsQuery.exec();
    const itemsResult = [];
    for(const item of items){
        const imagePaths = [];
        for(const imageRef of item.imagesReferences){
            const img = await imageModel.findById(imageRef);
            imagePaths.push(img.path);
        }
        const itemResult = new ItemModel(item);
        itemResult.setImagePaths(imagePaths);
        itemResult.setItemId(item._id);
        itemResult.setOwnerId(item.ownerId);
        itemsResult.push(itemResult);
    }
    
    return itemsResult;
}

const isItemTradeInOrder = async(itemId, userId) => {
    console.log("itemId: ", itemId);
    console.log("userId: ", userId);
    const item = await tradezModel.findOne({
        secondaryItemId: itemId,
        primaryUserId: userId
    });

    return item != null && item != undefined;
}

export { createItem, getItemById, getAllItems, editItem, getItemMetaData };