import model from "../models/Comment.js";
import { CommentModel } from "../models/Comment.js";
import {default as userSchema} from '../models/User.js';
import { UserModel } from "../models/User.js";

const addComment = async (comment) => {
    console.log("comment: ", comment);
    const result = await model.create({ ...comment })
    .catch(err =>{
         console.log("error occured", err);
         throw Error(err);
    });
    const commentModel = new CommentModel(result);
    const user = await userSchema.findById(result.userId);
    commentModel.user = new UserModel(user);
    return commentModel;
}

const getComments = async (itemId) => {
    console.log("itemId: ", itemId);

    const result = await model.find({itemId: itemId, $or:[
        {parentCommentId: null},
        {parentCommentId: undefined}
    ]})
    .catch(err =>{
         console.log("error occured", err);
         throw Error(err);
    });

    console.log("comments first: ", result);
    let comments = [];

    for await (const comment of result){
        const commentModel = new CommentModel(comment);
        console.log("comment model: ", commentModel);
        const user = await userSchema.findById(comment.userId);
        commentModel.user = new UserModel(user);
        console.log("user is: ", commentModel.user);
        commentModel.replyComments = await getCommentReplies(commentModel.commentId);
        comments.push(commentModel);
    }

    console.log("comments: ", comments);
    return comments;
}

const getCommentReplies = async (commentId) => {
    console.log("commentId: ", commentId);

    const result = await model.find({$and: [
        {parentCommentId: commentId},
        {isReply: true}
    ]})
    .catch(err =>{
         console.log("error occured", err);
         throw Error(err);
    });

    console.log("replies: ", result);
    let comments = [];

    for await (const comment of result){
        const commentModel = new CommentModel(comment);
        console.log("comment model: ", commentModel);
        const user = await userSchema.findById(comment.userId);
        commentModel.user = new UserModel(user);
        console.log("user is: ", commentModel.user);
        comments.push(commentModel);
    }

    console.log("comments: ", comments);
    return comments;
}


export { addComment, getComments, getCommentReplies };