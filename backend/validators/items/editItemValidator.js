import model from "../../models/Item.js";
import { ItemStatus } from "../../models/Statics.js";

export const _editItemValidator = async (req, res, next)=>{
    const {id} = req.params;
    console.log("item id: ", id);
    const item = await model.findById(id);
    if(item.status != ItemStatus.APPROVED){
        return res.status(601).json({message: "Invalid item status"});
    }
    req.body.status = ItemStatus.APPROVED;
    next();
}