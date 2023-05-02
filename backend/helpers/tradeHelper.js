import model from "../models/Tradez.js";
import {default as ItemModel} from "../models/Item.js";
import { getItemMetaData } from "./itemHelper.js";
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

const getTradez = async (itemId) => {
    console.log("item iddd: ", itemId);
    const tradez = await model.find({
        primaryItemId: itemId,
        accepted: false
    });
    console.log("tradezItems: ", tradez);
    let items = [];
    await Promise.all(tradez.map(async (trade, i) => {
        const id = trade.secondaryItemId;
        const item = await getItemMetaData({id});
        console.log("Trade item: ", item);
        items.push(item);
    }));
    console.log("items: ", items);
    return items;
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