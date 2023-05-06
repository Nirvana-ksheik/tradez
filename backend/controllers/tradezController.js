import * as dotenv from 'dotenv';
import { TradezModel } from '../models/Tradez.js';
import { createTrade, getTradez, getTrade, acceptTrade } from '../helpers/tradeHelper.js';
import mongoose from 'mongoose';
dotenv.config();

const _createTradeController = async (req, res) => {
    console.log("request body: ", req.body);
    try {
        req.body.secondaryUserId = req.user.id;
        const trade = new TradezModel(req.body);
        console.log("trade: ", trade);
        const validation = await getTrade(req.body.primaryItemId, req.body.secondaryItemId);
        console.log("validation: ", validation);
        if(!validation){
            const result = await createTrade(trade);
            console.log("res out: ", result);
            return res.status(200).json(result);
        }
        const result = {message: "Trade exists"}
        return res.status(601).json(result);
    } catch (err) {
        console.log("err ", err);
        res.status(500).json({err});
    }
};
export { _createTradeController as createTradeController };

const _getTradezController = async (req, res) => {
    try {
        console.log("entered tradez controller");
        const itemId = new mongoose.Types.ObjectId(req.params);
        console.log("item id: ", itemId);
        const result = await getTradez(itemId);
        console.log("res is: ", result);
        res.status(200).json(result);
    } catch (err) {
        console.log("error: ", err);
        res.status(500).json(err.message);
    }
};
export { _getTradezController as getTradezController };

const _acceptTradezController = async (req, res) => {
    try {
        console.log("entered accept tradez controller");
        let body = req.body;
        body.primaryUserId = req.user.id;
        console.log("body: ", body);
        const result = await acceptTrade(body);
        console.log("res is: ", result);
        res.status(200).json({result});
    } catch (err) {
        console.log("error: ", err);
        res.status(500).json(err.message);
    }
};
export { _acceptTradezController as acceptTradezController };