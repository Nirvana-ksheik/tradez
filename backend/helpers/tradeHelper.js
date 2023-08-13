import model from "../models/Tradez.js";
import {default as ItemModel} from "../models/Item.js";
import { getItemDetails, getItemMetaData } from "./itemHelper.js";
import mongoose from "mongoose";

const createTrade = async (trade) => {
    console.log("trade: ", trade);
    const res = await model.create({ ...trade })
    .then(res => {
        console.log("res: ", res);
    })
    .catch(err =>{
         console.log("error occured", err);
         throw Error(err);
    });

    const item = await ItemModel.findById(trade.primaryItemId);
    let tradez = item.tradez + 1;
    await ItemModel.findByIdAndUpdate(item._id, {tradez: tradez});
    return res;
}

const getTrade = async (item1, item2) => {
    const trade = await model.findOne({primaryItemId: new mongoose.Types.ObjectId(item1), secondaryItemId: new mongoose.Types.ObjectId(item2)});
    console.log("trade: ", trade);
    return trade;
}

const getTradez = async (itemId, query) => {
    console.log("item iddd: ", itemId);
    const tradez = await model.find({
        primaryItemId: itemId,
        accepted: false
    });
    const itemIds = [];
    tradez.forEach((trade, i) => {
        itemIds.push(trade.secondaryItemId);
    });

    const order = [];
    query.order ? order.push(query.order) : order.push("publishedDate");
    query.orderDirection ? order.push(query.orderDirection) : order.push(-1);

    const itemsQuery = ItemModel.find({'_id': { $in: itemIds }}).sort([order]);
    itemsQuery.getFilter();

    const searchText = query.searchText;
    const locationFilter = query.location;
    const categoriesFilter = query.category;

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

    if(categoriesFilter !== null && categoriesFilter !== undefined && categoriesFilter !== []){
        console.log("categories filter array: ", categoriesFilter);
        itemsQuery.find({
            categories: {$in: categoriesFilter}
        });
        itemsQuery.getFilter();
    }

    if(locationFilter !== null && locationFilter !== undefined){
        itemsQuery.find({
            location: locationFilter
        });
        itemsQuery.getFilter();
    }

    console.log("tradezItems: ", tradez);
    const items = await itemsQuery.exec();
    const itemsResults = [];

    await Promise.all(items.map(async (item, i) => {
        const itemModel = await getItemDetails({id: item._id});
        console.log("Trade item: ", itemModel);
        itemsResults.push(itemModel);
    }));

    console.log("items: ", itemsResults);
    return itemsResults;
}

const acceptTrade = async (body) => {

    console.log("body is: ", body);

    const trade = await model.findOneAndUpdate(
            {...body}, {accepted: true, closed: true}
        ).catch(err => console.log("error: ", err));
    
    await ItemModel.findByIdAndUpdate(body.primaryItemId, {archived: true});
    await ItemModel.findByIdAndUpdate(body.secondaryItemId, {archived: true});

    await model.deleteMany({
        $and:[
                {$or:[
                    {primaryItemId: {$in:[mongoose.Types.ObjectId(body.primaryItemId), mongoose.Types.ObjectId(body.secondaryItemId)]}},
                    {secondaryItemId: {$in:[mongoose.Types.ObjectId(body.primaryItemId), mongoose.Types.ObjectId(body.secondaryItemId)]}}
                ]},
                {accepted: false},
                {closed: false}
        ]}
        ).catch(err => console.log("error: ", err));

    return trade;
}

export { createTrade, getTradez, getTrade, acceptTrade };