import mongoose, {Schema} from 'mongoose';

const commentSchema = new Schema({

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true    
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    commentText: {
        type: String,
        required: true
    },
    commentDate: {
        type: Date,
        default: new Date().toISOString()
    },
    isReply: {
        type: Boolean,
        default: false
    }
});

export class CommentModel {
    constructor(comment){
        this.commentId = comment._id;
        this.itemId = comment.itemId;
        this.userId = comment.userId;
        this.parentCommentId = comment.parentCommentId;
        this.commentText = comment.commentText;
        this.commentDate = comment.commentDate;
        this.isReply = comment.isReply;
        this.user = null;
        this.replyCommentsNb = 0;
        this.replyComments = [];
    }
}

const model = mongoose.model('Comment', commentSchema);

export const schema = model.schema;
export default model;