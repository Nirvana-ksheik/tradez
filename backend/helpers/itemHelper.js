import model, {ItemModel} from '../models/Item.js';
import {default as userModel} from '../models/User.js';
import {default as imageModel} from '../models/Image.js';
import {default as tradezModel} from '../models/Tradez.js';
import { getTradez } from './tradeHelper.js';
import mongoose from 'mongoose';
import { ItemStatus, Role } from '../models/Statics.js';

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

const getItemMetaData = async ({id, userId, role}) => {
    console.log("id: ", id);
    console.log("userId: ", userId);
    const item = await model.findById(id);
    if(item.approved == false){
        return null;
    }
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
    itemResult.rejectMessage = item.status == ItemStatus.REJECTED && (userId == item.ownerId || role == Role.ADMIN) ? item.rejectMessage : null;
    return itemResult;
}

const getAllItems = async ({query}) => {
    const order = [];
    query.order ? order.push(query.order) : order.push("publishedDate");
    query.orderDirection ? order.push(query.orderDirection) : order.push(-1);
    const itemsQuery = model.find({...query}).sort([order]);
    itemsQuery.getFilter();
    const searchText = query.searchText;
    const statusFilter = query.status;
    console.log("status filter: ", statusFilter);
    console.log("role: ", query.role);

    if(query.role === Role.USER){
        const isMine = query.isMine;
        let userId = new mongoose.Types.ObjectId(query.userId);
        if(isMine == true || isMine == 'true'){
            itemsQuery.where('ownerId').equals(userId);
            itemsQuery.getFilter();
        }else{
            itemsQuery.where('ownerId').ne(userId);
            itemsQuery.getFilter();
        }
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

    if(statusFilter !== null && statusFilter !== undefined && statusFilter !== [] && query.role != undefined && query.role != null){
        console.log("status array: ", statusFilter);
        itemsQuery.find({
            status: {$in: statusFilter}
        });
        itemsQuery.getFilter();
    }else if(query.role == undefined || query.role == null){
        itemsQuery.find({
            status: ItemStatus.APPROVED
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
        primaryUserId: userId,
        accepted: false
    });
    console.log("traaaaaaaaaaaaaaaaaaaaaaaaaaaaaaade in order: ", item);
    return item != null && item != undefined;
}

const changeItemStatus = async (itemId, status, rejectMessage) => {
    console.log("item id in helper: ", itemId);
    console.log("status id in helper: ", status);

    const item = await model.findOneAndUpdate({_id: itemId}, {status: status, rejectMessage: rejectMessage})
        .catch((err) => {
            console.log("error in helper: ", err);
            throw Error(err);
        });

    return item;
}

export { createItem, getItemById, getAllItems, editItem, getItemMetaData, changeItemStatus };