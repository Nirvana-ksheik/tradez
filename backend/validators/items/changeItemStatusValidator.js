import { ItemStatus } from "../../models/Statics.js";
import model from "../../models/Item.js";

export const _changeItemStatusValidator = async (req, res, next)=>{
    const { status } = req.body;
    const { id } = req.params;
    console.log("id in validator: ", id);
    if(status == ItemStatus.APPROVED || status == ItemStatus.REJECTED){
        const item = await model.findById(id);
        if(item.status != ItemStatus.PENDING){
            return res.status(601).json({message: "Decision Already Taken"});
        }else{
            next();
        }
    }else{
        return res.status(601).json({message: "Invalid Status"});
    }
}