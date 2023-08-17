import mongoose, {Schema} from 'mongoose';

const tradezSchema = new Schema({
    primaryItemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    secondaryItemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    primaryUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    secondaryUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accepted:{
        type: Boolean,
        default: false
    },
    isArchived:{
        type: Boolean,
        default: false
    }
});

export class TradezModel {
    constructor(data){
        this.primaryItemId = mongoose.Types.ObjectId(data.primaryItemId);
        this.secondaryItemId = mongoose.Types.ObjectId(data.secondaryItemId);
        this.primaryUserId = mongoose.Types.ObjectId(data.primaryUserId);
        this.secondaryUserId = mongoose.Types.ObjectId(data.secondaryUserId);
        this.accepted = false;
        this.isArchived = false;
    }
}

export class AdminTradezModel {
    constructor(itemModel1, itemModel2, tradeId){
        console.log('trade id in constructor: ', tradeId);
        this.item1 = itemModel1
        this.item2 = itemModel2;
        this.tradeId = tradeId;
    }
}

const model = mongoose.model('Tradez', tradezSchema);

export const schema = model.schema;
export default model;