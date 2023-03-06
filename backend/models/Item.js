import mongoose, {Schema} from 'mongoose';
import { UserModel } from './User.js';

const itemSchema = new Schema({
    _id:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    name:{
        type: String,
        required: [true, 'Please enter an item name']
    },
    description:{
        type: String,
        required: [true, 'Please enter an item name'],
        maxlength: [5000, 'Maximum descrption length is 5000 characters']
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // categoryId:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category',
    //     required: true
    // },
    locationName:{
        type:String,
        required: true,
        minlength: [5, 'Minimum location name length is 5 characters'],
        maxlength: [500, 'Maximum location name length is 500 characters']
    },
    imagesReferences:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    isAvailable:{
        type: Boolean,
        default: true
    },
    approximateValue:{
        type: Number
    },
    tradez:{
        type: Number,
        default: 0
    },
    publishedDate:{
        type: Date
    }
}, { _id: false });

export class ItemModel {
    constructor(data){
        this.name = data.name;
        this.description = data.description;
        this.locationName = data.locationName;
        this.imagesReferences = data.imagesReferences;
        this.approximateValue = data.approximateValue;
        this.imagePaths = null;
        this.publishedDate = Date.now();
        this.ownerId = null;
        this.tradez = data.tradez;
        this._id = null;
    }

    setOwnerId = (id) => { this.ownerId = id; }
    setItemOwner = (user) => { this.itemOwner = new UserModel(user); }
    setItemId = (id) => { this._id = id; }
    setImageReferences = (refs) => { this.imagesReferences = refs; }
    setImagePaths = (refs) => { this.imagePaths = refs; }
}

const model = mongoose.model('Item', itemSchema);

export const schema = model.schema;
export default model;