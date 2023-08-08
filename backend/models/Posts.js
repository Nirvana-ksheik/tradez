import mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
    _id:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    description:{
        type: String,
        required: false,
        maxlength: [5000, 'Maximum descrption length is 5000 characters']
    },
    charityId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Charity', //reference
        required: true
    },
    username:{
        type: String
    },
    imagesReferences:[{
        type: String
    }],
    likes:[{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
   comments:[{
        _id:{
            type: mongoose.Schema.Types.ObjectId
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        username: {
            type: String
        },
        commentText: {
            type: String
        },
        commentDate: {
            type: Date,
            default: Date.now
        }
    }],
    publishedDate:{
        type: Date,
        default: Date.now
    }
}, { _id: false });

export class PostCommentModel {
    constructor(data){
        console.log("data in post comment model: ", data);
        this._id = data._id;
        this.userId = data.userId;
        this.username = data.username;
        this.commentText = data.commentText;
        this.commentDate = data.commentDate;
        this.logo = data.logo;
    }
}

export class PostModel {
    constructor(data){
        console.log("data in model constructor: ", data);
        this._id = data._id;
        this.description = data.description;
        this.charityId = data.charityId;
        this.imagesReferences = data.imagesReferences;
        this.likes = data.likes;
        this.comments = [];
        this.createdDate = data.createdDate;
        this.username = data.username;
        this.publishedDate = data.publishedDate;
        this.logo = data.logo;
    }

    setLogo = (logo) => {
        this.logo = logo;
    }
}

export class GetPostMetadataModel {
    constructor(data){
        this.description = data.description;
        this.images = data.imagesReferences;
    }
}

const model = mongoose.model('Post', postSchema);

export const schema = model.schema;
export default model;