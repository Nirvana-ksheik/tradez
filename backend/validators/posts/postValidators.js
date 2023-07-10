import model from "../../models/Charity.js";
import { CharityStatus } from "../../models/Statics.js";

export const _editPostValidator = async (req, res, next)=>{
    const id = req.user.id;
    console.log("charity id: ", id);
    const charity = await model.findById(id);

    if(charity == null || charity === undefined || charity.status !== CharityStatus.APPROVED ){
        return res.status(601).json({message: "Invalid charity status"});
    }
    next();
}